import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { HigherOrder } from "containers/global";

export default class ProjectCollectionSortBy extends PureComponent {

  static propTypes = {
    collection: PropTypes.object,
    sortChangeHandler: PropTypes.func.isRequired,
    kindChangeHandler:PropTypes.func.isRequired
  };

  renderDropdown(collection) {
    return (
      <div>A dropdown</div>
    );
  }

  renderToggle(collection) {
    if (collection.attributes.kind !== "manual") return null;
    return (
      <div>A toggle</div>
    );
  }

  render() {
    if (!this.props.collection) return null;

    return (
      <div style={{ padding: "15px", border: "2px solid yellow" }}>
        {this.renderDropdown(this.props.collection)}
        {this.renderToggle(this.props.collection)}
      </div>
    )
  }
}
