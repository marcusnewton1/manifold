import React, { PureComponent, PropTypes } from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';

export default class AnnotationSelectionEditor extends PureComponent {

  static displayName = "Annotation.Selection.Editor";

  static propTypes = {
    subject: PropTypes.string.isRequired,
    startNode: PropTypes.string.isRequired,
    startChar: PropTypes.number.isRequired,
    endNode: PropTypes.string.isRequired,
    endChar: PropTypes.number.isRequired,
    cancel: PropTypes.func.isRequired,
    createHandler: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.handleBodyChange = this.handleBodyChange.bind(this);
    this.handlePrivacyChange = this.handlePrivacyChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.state = {
      body: "",
      isPrivate: false
    };
  }

  handleSubmit(event) {
    event.preventDefault();
    const { subject, startNode, startChar, endNode, endChar } = this.props;
    const { body, isPrivate } = this.state;
    const annotation = {
      subject,
      startNode,
      startChar,
      endNode,
      endChar,
      body,
      isPrivate,
      format: "annotation"
    };
    this.props.createHandler(annotation);
  }

  handleBodyChange(event) {
    this.setState({ body: event.target.value });
  }

  handlePrivacyChange(event) {
    const value = !this.state.isPrivate;
    this.setState({ isPrivate: value });
  }

  render() {

    const checkClass = classNames(
      'form-toggle',
      'checkbox',
      { checked: this.state.isPrivate }
    );

    return (
      <div className="annotation-editor">
        <form onSubmit={this.handleSubmit}>
        <textarea
          style={{ width: "100%" }}
          placeholder={'Annotate this passage...'}
          onChange={this.handleBodyChange}
          value={this.state.body}
        />
          <div className="utility">
            <div className="form-input">
              <label className={checkClass} >
                <input
                  type="checkbox"
                  name="isPrivate"
                  value="1"
                  checked={this.state.isPrivate}
                  onChange={this.handlePrivacyChange}
                />
                <span className="toggle-indicator">
                <i className="manicon manicon-check-bold"></i>
              </span>
                <span className="toggle-label">This Annotation is Private</span>
              </label>
            </div>
            <div className="buttons">
              <button
                onClick={this.props.cancel}
                className="button-primary dull"
              >
                Cancel
              </button>
              <button
                className="button-secondary"
                disabled={!this.state.body}
              >
                Save
              </button>
            </div>
          </div>

        </form>
      </div>
    );
  }

}
