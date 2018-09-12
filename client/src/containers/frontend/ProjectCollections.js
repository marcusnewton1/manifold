import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectCollection, Utility } from "components/frontend";
import connectAndFetch from "utils/connectAndFetch";
import { commonActions } from "actions/helpers";
import { entityStoreActions } from "actions";
import { select, meta } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import lh from "helpers/linkHandler";
import queryString from "query-string";

const { request } = entityStoreActions;
const perPage = 20;

export class ProjectsCollectionsContainer extends Component {
  static fetchData = (dispatch, location) => {
    const query = queryString.parse(location.search);
    const pagination = {
      number: query.page || 1,
      size: perPage
    };
    const collectionsRequest = request(
      projectCollectionsAPI.index({ withProjects: true }, pagination),
      requests.feProjectCollections
    );
    return dispatch(collectionsRequest);
  };

  static mapStateToProps = state => {
    return {
      projectCollections: select(requests.feProjectCollections, state.entityStore),
      meta: meta(requests.feProjectCollections, state.entityStore),
      authentication: state.authentication
    };
  };

  static propTypes = {
    authentication: PropTypes.object,
    projectCollections: PropTypes.array,
    location: PropTypes.object,
    history: PropTypes.object,
    dispatch: PropTypes.func,
    fetchData: PropTypes.func.isRequired,
    meta: PropTypes.object
  };

  static defaultProps = {
    location: {}
  };

  constructor(props) {
    super(props);
    this.commonActions = commonActions(props.dispatch);
  }

  componentDidMount() {
    ProjectsCollectionsContainer.fetchData(this.props.dispatch, this.props.location);
  }

  currentQuery() {
    return queryString.parse(this.props.location.search);
  }

  handlePageChange = (event, page) => {
    event.preventDefault();
    const query = Object.assign({}, this.currentQuery(), { page });
    this.doQuery(query);
  };

  doQuery(query) {
    const url = lh.link("frontendProjectCollections", query);
    this.props.history.push(url);
  }

  pageChangeHandlerCreator = page => {
    return event => {
      this.handlePageChange(event, page);
    };
  };

  showPlaceholder() {
    const { location, projectCollections } = this.props;
    if (location.search) return false; // There are search filters applied, skip the check
    if (!projectCollections || projectCollections.length === 0) return true;
  }

  renderProjectCollections() {
    if (this.showPlaceholder()) return <ProjectCollection.Placeholder />;

    return this.props.projectCollections.map(collection => {
      return <ProjectCollection.Summary
        key={collection.id}
        authentication={this.props.authentication}
        collection={collection}
        dispatch={this.props.dispatch}
        moreLabel={"See the full collection"}
        limit={4}
      />;
    });
  }

  render() {
    return (
      <div style={{ overflowX: "hidden" }}>
        <Utility.BackLinkPrimary
          link={lh.link("frontendProjects")}
          backText={"Back to projects"}
        />
        {this.renderProjectCollections()}
      </div>
    );
  }
}

export default connectAndFetch(ProjectsCollectionsContainer);
