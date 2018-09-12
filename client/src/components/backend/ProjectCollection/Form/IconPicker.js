import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Dialog } from "components/backend";
import { Project } from "components/global";
import setter from "components/backend/Form/setter";
import classNames from "classnames";

class IconPicker extends Component {
  static displayName = "ProjectCollection.Form.IconPicker";

  static propTypes = {
    projectCollection: PropTypes.object,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool
  };

  selected() {
    return this.props.getModelValue("attributes[icon]");
  }

  icons() {
    return [
      "books-with-glasses", "lamp", "new-round", "books-on-shelf"
    ];
  }

  renderIconList() {
    return (
      <ul className="icon-row">
        {this.icons().map(icon => {
          return this.renderIcon(icon);
        })}
      </ul>
    )
  }

  renderIcon(icon) {
    const selected = this.selected();
    const iconClasses = classNames(
      `manicon-${icon}`,
      { manicon: true, selected: selected === icon }
    );
    return <li key={icon} className={iconClasses} onClick={() => this.handleIconChange(icon)} />;
  }

  handleIconChange = icon => {
    this.props.setOther(icon, "attributes[icon]");
  };

  render() {
    const inputClasses = classNames({
      "form-input icon-picker": true,
      wide: this.props.wide
    });

    return (
      <div className={inputClasses}>
        <h4 className="form-input-heading">Collection Icon:</h4>
        <div>
          <span className="screen-reader-text">
            Select an icon for the project collection.
          </span>
          {this.renderIconList()}
        </div>
      </div>
    );
  }
}

export default setter(IconPicker);
