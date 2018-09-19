import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form, ProjectCollection, Dialog } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { HigherOrder } from "containers/global";
import { projectCollectionsAPI, requests } from "api";
import { entityStoreActions } from "actions";
import { connect } from "react-redux";
import lh from "helpers/linkHandler";

export class ProjectCollectionNew extends PureComponent {
  static displayName = "ProjectCollection.New";

  static propTypes = {
    dispatch: PropTypes.func.isRequired
  };

  constructor() {
    super();
    this.state = { confirmation: false };
    this.model = this.defaultModel();
  }

  defaultModel() {
    return {
      attributes: {
        numberOfProjects: 0
      },
      relationships: {
        subjects: []
      }
    }
  }

  render() {
    return (
      <HigherOrder.Authorize
        entity="projectCollection"
        ability="create"
        failureNotification
        failureRedirect={lh.link("backendProjectCollections")}
      >
        <section>
          <FormContainer.Form
            model={this.model}
            name="backend-project-collection-create"
            update={projectCollectionsAPI.update}
            create={projectCollectionsAPI.create}
            className="form-secondary project-collection-form"
          >
            <div className="drawer-header">
              <Form.TextInput
                wide
                label="Collection Title:"
                name="attributes[title]"
                placeholder="Enter collection name"
              />
            </div>
            <ProjectCollection.Form.KindPicker
              {...this.props}
            />
            <Form.Switch
              className="form-toggle-secondary"
              label="Visible:"
              name="attributes[visible]"
            />
            <Form.Switch
              className="form-toggle-secondary"
              label="Show on homepage:"
              name="attributes[homepage]"
            />
            <ProjectCollection.Form.IconPicker
              {...this.props}
            />
            <ProjectCollection.Form.SmartAttributes
              {...this.props}
            />
            <Form.Save text="Save Project Collection" />
          </FormContainer.Form>
        </section>
      </HigherOrder.Authorize>
    );
  }
}

export default connect(ProjectCollectionNew.mapStateToProps)(
  ProjectCollectionNew
);
