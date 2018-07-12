import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { HigherOrder } from "containers/global";
import { Form } from "components/backend";
import uniqueId from "lodash/uniqueId";

export default class ProjectCollectionSortBy extends PureComponent {

  static displayName = "ProjectCollection.SortBy";

  static propTypes = {
    collection: PropTypes.object,
    sortChangeHandler: PropTypes.func.isRequired,
    kindChangeHandler: PropTypes.func.isRequired,
    sortId: PropTypes.string
  };

  static defaultProps = {
    sortId: uniqueId("collection-sort-")
  };

  constructor(props) {
    super(props);

    this.state = { toggle: false };
  }

  handleClick = event => {
    event.preventDefault();
    this.setState({ toggle: !this.state.toggle });
  };

  handleSubmit = event => {
    event.preventDefault();
  };

  renderSortList() {
    return (
      <div className="select-group">
        <label htmlFor={this.props.sortId}>Order Collection By:</label>
          <div className="select" key="filter[order]">
            <select
              id={this.props.sortId}
              onChange={console.log("Filter changed.")}
              value=""
              data-id={"filter"}
            >
              <option value="">Default</option>
              <option key="recent" value="recently updated">
                Recently Updated
              </option>
              <option key="title ASC" value="title asc">
                title A to Z
              </option>
              <option key="title DESC" value="title desc">
                title Z to A
              </option>
            </select>
            <i className="manicon manicon-caret-down" aria-hidden="true" />
          </div>
      </div>
    );
  }

  renderDropdown(collection) {
    return (
      <form className="form-search-filter" onSubmit={this.handleSubmit}>
        <div className="form-list-filter">
          {this.renderSortList()}
        </div>
      </form>
    );
  }

  renderToggle(collection) {
    // if (collection.attributes.kind !== "manual") return null;

    const classes = classnames({
      "boolean-primary": true,
      checked: this.state.toggle
    });

    return (
      <form className="form-secondary">
        <div className="form-input">
          <h4 className="form-input-heading">Order Manually</h4>
          <div className="toggle-indicator">
            <div
              onClick={this.handleClick}
              className={classes}
              role="button"
              tabIndex="0"
              aria-pressed={this.state.toggle}
            >
              <span className="screen-reader-text">
                Order collection manually
              </span>
            </div>
          </div>
        </div>
      </form>
    );
  }

  render() {
    if (!this.props.collection) return null;

    return (
      <div className="project-collection-sort">
        {this.renderDropdown(this.props.collection)}
        {this.renderToggle(this.props.collection)}
      </div>
    )
  }
}
