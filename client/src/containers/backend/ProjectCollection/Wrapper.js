import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions, notificationActions } from "actions";
import { select } from "utils/entityUtils";
import { List, Project, ProjectCollection, Layout, Navigation } from "components/backend";
import { Link } from "react-router-dom";
import { HigherOrder } from "containers/global";
import { childRoutes } from "helpers/router";
import size from "lodash/size";
import lh from "helpers/linkHandler";

const { request } = entityStoreActions;

export class ProjectCollectionWrapperContainer extends PureComponent {
  static displayName = "ProjectCollection.Wrapper";

  static fetchProjectCollections = (dispatch) => {
    const call = projectCollectionsAPI.index({ order: "position ASC" });

    return dispatch(request(call, requests.beProjectCollections));
  };

  static fetchData = (getState, dispatch) => {
    const promises = [];

    const call = projectCollectionsAPI.index({ order: "position ASC" });

    const { promise: one } = dispatch(request(call, requests.beProjectCollections));
    promises.push(one);

    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownPropsIgnored) => {
    return {
      projectCollections: select(requests.beProjectCollections, state.entityStore)
    };
  };

  static propTypes = {
    projectCollections: PropTypes.array,
    collectionProjects: PropTypes.array,
    refresh: PropTypes.func,
    dispatch: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object
  };

  componentDidUpdate(prevProps) {
    this.redirectToFirstCollection(this.props, prevProps);
  }

  activeProjectCollection() {
    const { match, projectCollections } = this.props;
    return projectCollections.find(pc => pc.id === match.params.id);
  }

  redirectToFirstCollection(props, prevProps) {
    const prevMatch = prevProps.match;
    const projectCollections = props.projectCollections;

    if (!prevMatch.params.id && size(projectCollections) > 0) {
      const firstProject = projectCollections.sort(pc => pc.attributes.position)[0];
      const url = lh.link("backendProjectCollection", firstProject.id);
      props.history.push(url);
    }
  }

  handleCollectionOrderChange = result => {
    const changes = { attributes: { position: result.position } };
    const call = projectCollectionsAPI.update(result.id, changes);
    const projectCollectionRequest = request(call, requests.beProjectCollection);

    this.props.dispatch(projectCollectionRequest).promise.then(() => {
      ProjectCollectionWrapperContainer.fetchProjectCollections(this.props.dispatch);
    });
  };

  handleProjectsSortChange = () => {
    // Make an API request to change collection sortBy attribute
  };

  handleCollectionKindChange = () => {
    // Make an API request to change collection kind attribute
  };

  handleCollectionSelect = collection => {
    const url = lh.link("backendProjectCollection", collection.id);
    this.props.history.push(url);
  };

  // TODO: Authorize buttons; Add settings icon
  renderUtility() {
    const id = this.props.match.params.id;

    return (
      <div>
        <Link
          to={lh.link("backendProjectCollectionSettings", id)}
          className="button-bare-primary"
        >
          <i className="manicon manicon-stack" aria-hidden="true" />
          Settings
        </Link>
        <Link
          to={lh.link("backendProjectCollectionManageProjects", id)}
          className="button-bare-primary"
        >
          <i className="manicon manicon-stack" aria-hidden="true" />
          Manage Projects
        </Link>
      </div>
    );
  }

  // TODO: Add icons
  renderHeader() {
    const activeProjectCollection = this.activeProjectCollection();
    if (!activeProjectCollection) return null;
    const iconName = activeProjectCollection.attributes.smart
      ? `project-placeholder`
      : `project-placeholder`;

    return (
      <Navigation.DetailHeader
        iconName={iconName}
        title={activeProjectCollection.attributes.title}
        utility={this.renderUtility(activeProjectCollection)}
      />
    );
  }

  render() {
    const { match } = this.props;
    const activeId = match.params.id;

    if (!this.props.projectCollections) return <ProjectCollection.Placeholder />;

    return (
      <section className="backend-panel">
        {this.renderHeader()}
        <div className="container">
          <aside className="aside-wide project-collection-list">
            <List.Orderable
              entities={this.props.projectCollections}
              entityComponent={ProjectCollection.ListItem}
              entityComponentProps={{
                active: activeId,
                clickHandler: this.handleCollectionSelect
              }}
              match={this.props.match}
              orderChangeHandler={this.handleCollectionOrderChange}
              name="project-collections"
            />
            <div className="actions">
              <button className="button-icon-secondary">
                <i className="manicon manicon-plus" />
                  Create New Collection
              </button>
            </div>
            <p className="instructional-copy">
              Drag Collections to reorder how they’ll appear in your Library. Select a Collection to edit its settings, visibility, and contents.
            </p>
          </aside>
          <div className="panel-narrow">
            {childRoutes(this.props.route)}
          </div>
        </div>
      </section>
    );
  }
}

export default connectAndFetch(ProjectCollectionWrapperContainer);
