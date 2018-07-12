import React, { PureComponent } from "react";
import PropTypes from "prop-types";

export default class ListOrderable extends PureComponent {

  static propTypes = {
    entities: PropTypes.array,
    entityComponent: PropTypes.func,
    entityComponentProps: PropTypes.object,
    orderChangeHandler: PropTypes.func.isRequired,
    classNames: PropTypes.string
  };

  static defaultProps = {
    classNames: "list-orderable"
  };

  // This component will have the drag and drop interface
  // and will trigger this.props.orderChangeHandler.

  renderEntity = entity => {
    const props = Object.assign({}, this.props.entityComponentProps);
    props.entity = entity;
    return React.createElement(this.props.entityComponent, props);
  };

  render() {
    if (!this.props.entities) return null;

    return (
      <ul className={this.props.classNames}>
        {this.props.entities.map(entity => {
          return this.renderEntity(entity);
        })}
      </ul>
    );
  }
}
