import React, { Component } from "react";
import PropTypes from "prop-types";
import { Project } from "containers/backend";
import { HigherOrder } from "containers/global";
import { childRoutes } from "helpers/router";
import lh from "helpers/linkHandler";

export default class ProjectSocialWrapperContainer extends Component {
  static displayName = "Project.Social.Wrapper";

  static propTypes = {
    project: PropTypes.object,
    route: PropTypes.object,
    history: PropTypes.object,
    match: PropTypes.object
  };

  render() {
    const project = this.props.project;
    const closeUrl = lh.link("backendProjectSocial", project.id);

    return (
      <HigherOrder.Authorize
        entity={project}
        ability="manageSocials"
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          {childRoutes(this.props.route, {
            drawer: true,
            drawerProps: { closeUrl }
          })}
          <Project.Social.TwitterQueries
            project={project}
            match={this.props.match}
          />
        </section>
      </HigherOrder.Authorize>
    );
  }
}
