import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { Resource } from "components/backend";
import { resourcesAPI } from "api";
import { connect } from "react-redux";

export class ResourceVariantsContainer extends PureComponent {
  static displayName = "Resource.Variants";

  static propTypes = {
    resource: PropTypes.object,
    params: PropTypes.object
  };

  render() {
    return (
      <section>
        <FormContainer.Form
          model={this.props.resource}
          name="backend-resource-update"
          update={resourcesAPI.update}
          create={model =>
            resourcesAPI.create(this.props.params.projectId, model)
          }
          className="form-secondary"
        >
          <Resource.Form.Kind.Variants
            kind={this.props.resource.attributes.kind}
            {...this.props}
          />
          <Form.Save text="Save Resource" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connect(ResourceVariantsContainer.mapStateToProps)(
  ResourceVariantsContainer
);
