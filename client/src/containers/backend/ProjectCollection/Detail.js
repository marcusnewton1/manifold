import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { List, ProjectCollection, Project } from "components/backend";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";
import lh from "helpers/linkHandler";

const { request, flush } = entityStoreActions;
const page = 1;
const perPage = 12;

export class ProjectCollectionDetail extends PureComponent {
  static displayName = "ProjectCollection.Detail";
  static fetchData = (getState, dispatch, location, match) => {
    const state = getState();
    const promises = [];

    if (!isEntityLoaded("projectCollections", match.params.id, state)) {
      const p = projectCollectionsAPI.show(match.params.id);
      const { promise: one } = dispatch(request(p, requests.beProjectCollection));
      promises.push(one);
    }

    const call = projectCollectionsAPI.collectionProjects(match.params.id);
    const { promise: two } = dispatch(request(call, requests.beCollectionProjects));
    promises.push(two);

    return Promise.all(promises);
  };

  static mapStateToProps = (state, ownProps) => {
    return {
      projectCollection: grab("projectCollections", ownProps.match.params.id, state.entityStore),
      collectionProjects: select(requests.beCollectionProjects, state.entityStore),
      collectionProjectsMeta: meta(requests.beCollectionProjects, state.entityStore),
    };
  };

  static propTypes = {
    projectCollection: PropTypes.object,
    dispatch: PropTypes.func,
    match: PropTypes.object,
    history: PropTypes.object,
    route: PropTypes.object,
    location: PropTypes.object
  };

  handleProjectOrderChange = result => {
    const changes = { attributes: { position: result.position } };
    const call = projectCollectionsAPI.updateCollectionProject(this.props.projectCollection.id, result.id, changes);
    const projectCollectionRequest = request(call, "backend-collection-project-reorder");

    this.props.dispatch(projectCollectionRequest).promise.then(() => {
      const call = projectCollectionsAPI.collectionProjects(this.props.projectCollection.id);
      this.props.dispatch(request(call, requests.beCollectionProjects));
    });
  };

  draggableProjectCover = props => {
    const entity = props.entity;
    if (!entity) return null;

    return <Project.ListItem wrapper={false} entity={entity.relationships.project} />
  };

  drawerProps(props) {
    return {
      lockScroll: "always",
      wide: true,
      closeUrl: lh.link("backendProjectCollection", props.projectCollection.id)
    };
  }

  render() {
    const { projectCollection, collectionProjects } = this.props;
    if (!projectCollection) return null;

    return (
      <div>
        <List.Orderable
          entities={collectionProjects}
          entityComponent={this.draggableProjectCover}
          orderChangeHandler={this.handleProjectOrderChange}
          name="collection-projects"
          classNames={"project-grid grid-list"}
          grid
        />
        {childRoutes(this.props.route, { childProps: { projectCollection }, drawer: true, drawerProps: this.drawerProps(this.props) })}
      </div>
    );
  }
}

export default connectAndFetch(ProjectCollectionDetail);
