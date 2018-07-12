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
    const itemClass = classnames("", {
      selected: active
    });

    return (
      <li onClick={this.handleClick}
          key={this.props.entity.id}
          className={itemClass}
      >
        <span className="item-text">{this.props.entity.attributes.title}</span>
        <div className="icon-group">
          <span className="item-text">7</span>
          <span className="manicon manicon-eye-outline">
            <span className="screen-reader-text">Collection is visible</span>
          </span>
          <button className="manicon manicon-grabber">
            <span className="screen-reader-text">
              Change the order of this collection.
            </span>
          </button>
        </div>
      </li>
    )
  }
}
