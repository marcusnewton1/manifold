import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ProjectCollectionListItem extends PureComponent {

  static propTypes = {
    entity: PropTypes.object,
    clickHandler: PropTypes.func,
    active: PropTypes.string
  };

  handleClick = event => {
    event.preventDefault();
    this.props.clickHandler(this.props.entity);
  };

  render() {
    if (!this.props.entity) return null;

    // This should be an active class, for real
    const active = this.props.active === this.props.entity.id;
    const styles = { padding: "5px 10px", border: "2px solid coral" };
    active ? styles.backgroundColor = "#52e3ac" : null;

    return (
      <li onClick={this.handleClick}
          key={this.props.entity.id}
          style={styles}
      >
        {this.props.entity.attributes.title}
      </li>
    )
  }
}
