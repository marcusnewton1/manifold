import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { pagesAPI, requests } from "api";
import connectAndFetch from "utils/connectAndFetch";
import entityUtils from "utils/entityUtils";
import { entityStoreActions, notificationActions } from "actions";
import lh from "helpers/linkHandler";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import { HigherOrder } from "containers/global";
import { Utility } from "components/global";
import { Dialog, Navigation, Layout } from "components/backend";
import navigation from "helpers/router/navigation";

const { select } = entityUtils;
const { request, flush } = entityStoreActions;

class PageDetailContainer extends PureComponent {
  static mapStateToProps = state => {
    return {
      page: select(requests.bePage, state.entityStore)
    };
  };

  static displayName = "Pages.Edit";

  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired,
    page: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  componentDidMount() {
    const id = this.props.match.params.id;
    if (id !== "new") this.fetchPage(this.props);
  }

  componentDidUpdate(prevProps) {
    if (this.id(this.props) !== this.id(prevProps)) {
      this.fetchPage(this.props);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(flush(requests.bePage));
  }

  fetchPage(props) {
    const id = this.id(props);
    const call = pagesAPI.show(id);
    const pageRequest = request(call, requests.bePage);
    props.dispatch(pageRequest);
  }

  redirectToPages() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  redirectToList() {
    const path = lh.link("backendRecordsPages");
    this.props.history.push(path);
  }

  notifyDestroy(feature) {
    const notification = {
      level: 0,
      id: `PAGE_DESTROYED_${feature.id}`,
      heading: "The page has been deleted.",
      body: `And we're sorry to see it go.`,
      expiration: 3000
    };
    this.props.dispatch(notificationActions.addNotification(notification));
  }

  handleSuccess = pageIgnored => {
    this.redirectToPages();
  };

  handleDestroy = () => {
    const heading = "Are you sure you want to delete this page?";
    const message = "This action cannot be undone.";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.doDestroy();
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  closeDialog = () => {
    this.setState({ confirmation: null });
  };

  doDestroy = () => {
    const { page } = this.props;
    const call = pagesAPI.destroy(page.id);
    const options = { removes: page };
    const pageRequest = request(call, requests.bePageDestroy, options);
    this.props.dispatch(pageRequest).promise.then(() => {
      this.notifyDestroy(page);
      this.redirectToList();
    });
  };

  doPreview = event => {
    event.preventDefault();
    const attr = this.props.page.attributes;
    const previewUrl = attr.isExternalLink
      ? attr.externalLink
      : lh.link("frontendPage", attr.slug);
    const win = window.open(previewUrl, "_blank");
    win.focus();
  };

  isNew(props) {
    return this.id(props) === "new";
  }

  id(props) {
    return props.match.params.id;
  }

  page(props) {
    return props.page;
  }

  renderNewHeader() {
    return (
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={"All Pages"}
        title="New Page"
        showUtility={false}
        note={
          "Enter the name of your page and, optionally, a slug. Press save to continue."
        }
      />
    );
  }

  renderExistingHeader(page) {
    if (!page) return null;
    return (
      <Navigation.DetailHeader
        type="page"
        backUrl={lh.link("backendRecordsPages")}
        backLabel={"All Pages"}
        title={page.attributes.title}
        subtitle={`/page/${page.attributes.slug}`}
        utility={this.renderUtility()}
      />
    );
  }

  renderUtility() {
    return (
      <div>
        <button onClick={this.doPreview} className="button-bare-primary">
          <i className="manicon manicon-eye-outline" aria-hidden="true" />
          Preview{" "}
        </button>
        <HigherOrder.Authorize entity={this.props.page} ability="update">
          <button onClick={this.handleDestroy} className="button-bare-primary">
            <i className="manicon manicon-trashcan" aria-hidden="true" />
            Delete
          </button>
        </HigherOrder.Authorize>
      </div>
    );
  }

  renderNew() {
    return (
      <div>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}

        {this.renderNewHeader()}
        <Layout.BackendPanel>
          <div className="panel">
            <section>{this.renderRoutes()}</section>
          </div>
        </Layout.BackendPanel>
      </div>
    );
  }

  renderExisting(page) {
    if (!page) return null;
    const skipId = "skip-to-pages-body-panel";
    const secondaryLinks = navigation.page(page);

    return (
      <div>
        <RedirectToFirstMatch
          from={lh.link("backendRecordsPage", this.id(this.props))}
          candidates={secondaryLinks}
        />
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        {this.renderExistingHeader(page)}
        <section className="backend-panel">
          <Utility.SkipLink skipId={skipId} />
          <div className="container">
            <div id={skipId} className="panel">
              <section>{this.renderRoutes()}</section>
            </div>
          </div>
        </section>
      </div>
    );
  }

  renderRoutes() {
    const { page } = this.props;
    return childRoutes(this.props.route, { childProps: { page } });
  }

  render() {
    const page = this.page(this.props);
    const isNew = this.isNew(this.props);
    const authProps = isNew
      ? { entity: "page", ability: "create" }
      : { entity: page, ability: "update" };

    if (!authProps.entity) return null;

    return (
      <HigherOrder.Authorize
        failureFatalError={{
          detail: `You are not allowed to ${authProps.ability} pages.`
        }}
        {...authProps}
      >
        {isNew ? this.renderNew() : this.renderExisting(page)}
      </HigherOrder.Authorize>
    );
  }
}

export default connectAndFetch(PageDetailContainer);
