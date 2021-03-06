import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Resource from "./Resource";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";

export default class ProjectResourcesContainer extends PureComponent {
  static displayName = "Project.ResourcesContainer";

  static propTypes = {
    project: PropTypes.object
  };

  render() {
    const project = this.props.project;
    if (!project) return null;

    return (
      <HigherOrder.Authorize
        entity={project}
        ability={"manageResources"}
        failureNotification
        failureRedirect={lh.link("backendProject", project.id)}
      >
        <section>
          <Resource.ResourcesList project={project} />
        </section>
      </HigherOrder.Authorize>
    );
  }
}
