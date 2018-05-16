import React, { Component } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";

export default class UserMenuBody extends Component {
  static propTypes = {
    hideUserMenu: PropTypes.func.isRequired,
    startLogout: PropTypes.func.isRequired,
    showLoginOverlay: PropTypes.func.isRequired,
    visible: PropTypes.bool
  };

  logout = () => {
    this.props.startLogout();
    this.props.hideUserMenu();
  };

  handleProfileClick = event => {
    event.preventDefault();
    this.props.hideUserMenu();
    this.props.showLoginOverlay();
  };

  render() {
    const menuClass = classNames({
      "user-menu": true,
      "menu-hidden": !this.props.visible,
      "menu-visible": this.props.visible
    });

    return (
      <nav className={menuClass}>
        <i className="tail" />
        <ul>
          <li>
            <button onClick={this.handleProfileClick}>
              <i
                className="manicon manicon-person-pencil-simple"
                aria-hidden="true"
              />
              {"Edit Profile"}
            </button>
          </li>
          <li>
            <button onClick={this.logout}>
              <i
                className="manicon manicon-circle-arrow-out-right"
                aria-hidden="true"
              />
              {"Logout"}
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}
