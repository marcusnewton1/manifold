import React, {PureComponent} from "react";
import PropTypes from "prop-types";
import classnames from "classnames";

export default class ProjectCollectionListItem extends PureComponent {

  static propTypes = {
    entity: PropTypes.object,
    dragHandleProps: PropTypes.object,
    onClick: PropTypes.func,
    active: PropTypes.string
  };

  handleClick = () => {
    return this.props.clickHandler(this.props.entity);
  };

  render() {
    const entity = this.props.entity;
    if (!entity) return null;

    // This should be an active class, for real
    const active = this.props.active === this.props.entity.id;
    const itemClass = classnames({
      "project-collection-list-item": true,
      selected: active
    });
    const visibleClass = entity.attributes.visible ? "manicon-eye-outline" : "manicon-eye-slash";

    return (
      <div className={itemClass} onClick={this.handleClick}>
        <span className="item-text">{this.props.entity.attributes.title}</span>
        <div className="icon-group">
          <span className="item-text">{entity.attributes.projectCount}</span>
          <span className={`manicon ${visibleClass}`}>
            <span className="screen-reader-text">{`Collection is ${entity.attributes.visible ? "visible" : "not visible"}`}</span>
          </span>
          <div className="manicon manicon-bars-parallel-horizontal" {...this.props.dragHandleProps}>
            <span className="screen-reader-text">
            Change the order of this collection.
            </span>
          </div>
        </div>
      </div>
    )
  }
}
