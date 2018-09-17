import React, { Component } from "react";
import PropTypes from "prop-types";
import setter from "./setter";
import { Form as GlobalForm } from "components/global";
import classnames from "classnames";
import isString from "lodash/isString";
import uniqueId from "lodash/uniqueId";
import Instructions from "./Instructions";

class FormTagList extends Component {
  static displayName = "Form.TagList";

  static propTypes = {
    focusOnMount: PropTypes.bool,
    placeholder: PropTypes.string,
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
    instructions: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    set: PropTypes.func.isRequired,
    wide: PropTypes.bool,
    id: PropTypes.string,
    errors: PropTypes.array,
    name: PropTypes.string,
    idForError: PropTypes.string
  };

  static defaultProps = {
    id: uniqueId("tag-list-"),
    idForError: uniqueId("tag-list-error-")
  };

  constructor() {
    super();
    this.state = { value: "" };
  }

  componentDidMount() {
    if (this.props.focusOnMount === true && this.inputElement) {
      this.inputElement.focus();
    }
  }

  arrayEntities(value) {
    if (!value) return [];
    return isString(value) ? value.split(",").map(tag => tag.trim()) : value;
  }

  handleKeyPress = event => {
    if (event.charCode !== 13) return null;
    event.preventDefault();

    this.handleAdd();
  };

  handleAdd = () => {
    if (!this.state.value) return null;
    const entities = this.arrayEntities(this.props.value);
    entities.push(this.state.value);

    this.props.set(entities.join(","));
    this.setState({ value: "" });
  };

  handleInputChange = event => {
    event.preventDefault();
    this.setState({ value: event.target.value });
  };

  handleRemove = tag => {
    const entities = this.arrayEntities(this.props.value);
    const newEntities = entities.filter(compare => {
      return compare !== tag;
    });

    this.props.set(newEntities.join(","));
  };

  renderList(value) {
    const tags = this.arrayEntities(value);
    const hasTags = tags.length > 0;
    const bucketClasses = classnames({
      bucket: true,
      empty: !hasTags
    });

    return (
      <ul className={bucketClasses}>
        {hasTags ? (
          tags.map(tag => {
            return (
              <li key={tag}>
                <h4 className="association-name">{tag}</h4>
                <div className="utility">
                  <button
                    onClick={() => this.handleRemove(tag)}
                    className="manicon manicon-x"
                  >
                    <span className="screen-reader-text">
                      Remove {tag} from the {this.props.label} list.
                    </span>
                  </button>
                </div>
              </li>
            );
          })
        ) : (
          <div className="placeholder">No {this.props.label} added</div>
        )}
      </ul>
    );
  }

  render() {
    const labelClass = classnames({
      "has-instructions": isString(this.props.instructions)
    });
    const inputClasses = classnames({
      "form-input": true,
      wide: this.props.wide
    });
    const id = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;
    const errorId = this.props.name
      ? this.props.name + "-" + this.props.id
      : this.props.id;

    return (
      <GlobalForm.Errorable
        className={inputClasses}
        name={this.props.name}
        errors={this.props.errors}
        label={this.props.label}
        idForError={errorId}
      >
        <label htmlFor={id} className={labelClass}>
          {this.props.label}
        </label>
        <div className="input-predictive">
          <div className="input">
            <i
              className="manicon manicon-plus"
              aria-hidden="true"
              onClick={this.handleAdd}
            />
            <input
              ref={input => {
                this.inputElement = input;
              }}
              id={id}
              type="text"
              placeholder={this.props.placeholder}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
              value={this.state.value}
              aria-describedby={errorId}
            />
          </div>
        </div>
        <Instructions instructions={this.props.instructions} />
        <div className="has-many-list">{this.renderList(this.props.value)}</div>
      </GlobalForm.Errorable>
    );
  }
}

export default setter(FormTagList);
