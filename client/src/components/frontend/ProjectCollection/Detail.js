import React, { Component } from "react";
import PropTypes from "prop-types";
import { ProjectList, ProjectCollection } from "components/frontend";
import { Utility } from "components/global";
import get from "lodash/get";

export default class ProjectCollectionDetail extends Component {
  static displayName = "ProjectCollectionDetail";

  static propTypes = {
    projectCollection: PropTypes.object,
    authentication: PropTypes.object,
    pagination: PropTypes.object,
    paginationClickHandler: PropTypes.func,
    projects: PropTypes.array,
    filterChangeHandler: PropTypes.func,
    initialState: PropTypes.object
  };

  render() {
    const projectCollection = this.props.projectCollection;
    if (!projectCollection) return null;

    return (
      <section key={projectCollection.id} className="bg-neutral05">
        <div className="container project-collection-detail">
          <div className="section-heading">
            <div className="main">
              <i className={`manicon manicon-${projectCollection.attributes.icon}`} aria-hidden="true" />
              <div className="body">
                <h4 className="title">{projectCollection.attributes.title}</h4>
              </div>
            </div>
            <ProjectCollection.Filters
              filterChangeHandler={this.props.filterChangeHandler}
              initialState={this.props.initialState}
            />
          </div>
          <div className="details">
            <div className="description" dangerouslySetInnerHTML={{ __html: projectCollection.attributes.description }} />
            <Utility.EntityCount
              pagination={this.props.pagination}
              singularUnit="project"
              pluralUnit="projects"
              countOnly
            />
          </div>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            projects={this.props.projects}
            dispatch={this.props.dispatch}
            paginationClickHandler={this.props.paginationClickHandler}
            pagination={this.props.pagination}
          />
        </div>
      </section>
    );
  }
}
