import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { List, ProjectCollection } from "components/backend";
import { Project } from "components/frontend";
import { entityStoreActions } from "actions";
import { select, grab, meta, isEntityLoaded } from "utils/entityUtils";
import { projectCollectionsAPI, requests } from "api";
import { childRoutes, RedirectToFirstMatch } from "helpers/router";

export class ProjectCollectionManageProjects extends PureComponent {
  static displayName = "ProjectCollection.ManageProjects";

  static propTypes = {
  };

  render() {
    return (
      <div>
        Manage Projects
      </div>
    );
  }
}

export default connectAndFetch(ProjectCollectionManageProjects);
