import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import connectAndFetch from "utils/connectAndFetch";
import { Form } from "components/backend";
import { Form as FormContainer } from "containers/backend";
import { usersAPI } from "api";
import lh from "helpers/linkHandler";

export class UsersNewContainer extends PureComponent {
  static displayName = "Users.New";

  static propTypes = {
    history: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.defaultUser = { attributes: { role: "reader" } };
  }

  redirectToUser(user) {
    const path = lh.link("backendPeopleUser", user.id);
    this.props.history.push(path);
  }

  createUser(user) {
    const meta = { createdByAdmin: true };
    return usersAPI.create(Object.assign({}, user, { meta }));
  }

  handleSuccess(user) {
    this.redirectToUser(user);
  }

  render() {
    return (
      <section>
        <header className="drawer-header">
          <h2 className="heading-quaternary">New User</h2>
        </header>
        <FormContainer.Form
          model={this.defaultUser}
          name="backend-create-user"
          update={usersAPI.update}
          create={this.createUser}
          onSuccess={this.handleSuccess}
          className="form-secondary"
        >
          <Form.TextInput
            focusOnMount
            label="Email"
            name="attributes[email]"
            placeholder="Email"
          />
          <Form.Select
            label="Role"
            name="attributes[role]"
            options={[
              { label: "Admin", value: "admin" },
              { label: "Author", value: "author" },
              { label: "Reader", value: "reader" }
            ]}
          />
          <Form.TextInput
            label="First Name"
            name="attributes[firstName]"
            placeholder="First Name"
          />
          <Form.TextInput
            label="Last Name"
            name="attributes[lastName]"
            placeholder="Last Name"
          />
          <Form.GeneratedPasswordInput name="attributes[password]" />
          <Form.Save text="Save User" />
        </FormContainer.Form>
      </section>
    );
  }
}

export default connectAndFetch(UsersNewContainer);