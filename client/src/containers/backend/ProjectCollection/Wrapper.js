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

  activeProjectCollection() {
    const { match, projectCollections } = this.props;
    return projectCollections.find(pc => pc.id === match.params.id) || projectCollections[0];
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
  renderHeader(projectCollection) {
    if (!projectCollection) return null;
    const iconName = projectCollection.attributes.smart
      ? `project-placeholder`
      : `project-placeholder`;

    return (
      <Navigation.DetailHeader
        iconName={iconName}
        title={projectCollection.attributes.title}
        utility={this.renderUtility(projectCollection)}
      />
    );
  }

  render() {
    const projectCollection = this.activeProjectCollection();
    if (!this.props.projectCollections) return <ProjectCollection.Placeholder />;
    const drawerProps = { closeUrl: lh.link("backendProjectCollections") };

    return (
      <section className="backend-panel">
        {this.renderHeader(projectCollection)}
        <div className="container">
          <aside className="aside-wide project-collection-list">
            <List.Orderable
              entities={this.props.projectCollections}
              entityComponent={ProjectCollection.ListItem}
              entityComponentProps={{
                active: projectCollection.id,
                clickHandler: this.handleCollectionSelect
              }}
              match={this.props.match}
              orderChangeHandler={this.handleCollectionOrderChange}
              name="project-collections"
            />
            <div className="actions">
              <Link className="button-icon-secondary" to={lh.link("backendProjectCollectionNew")}>
                <i className="manicon manicon-plus" />
                  Create New Collection
              </Link>
            </div>
            <p className="instructional-copy">
              Drag Collections to reorder how they’ll appear in your Library. Select a Collection to edit its settings, visibility, and contents.
            </p>
          </aside>
          <div className="panel-narrow">
            {childRoutes(this.props.route, { slot: "drawer", drawer: true })}
            {childRoutes(this.props.route, { childProps: { projectCollection, drawerProps } })}
          </div>
        </div>
      </section>
    );
  }
}

export default connectAndFetch(ProjectCollectionWrapperContainer);
