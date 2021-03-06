import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import Share from "./";
import Selection from "../Selection";

export default class AnnotationShareWrapper extends PureComponent {
  static displayName = "Annotation.Share.Wrapper";

  static propTypes = {
    subject: PropTypes.string,
    startNode: PropTypes.string,
    startChar: PropTypes.number,
    endNode: PropTypes.string,
    endChar: PropTypes.number,
    closeOnSave: PropTypes.bool,
    addsTo: PropTypes.string,
    text: PropTypes.object,
    annotating: PropTypes.bool,
    closeDrawer: PropTypes.func,
    truncate: PropTypes.number,
    shareType: PropTypes.string
  };

  static defaultProps = {
    closeOnSave: true
  };

  constructor(props) {
    super(props);

    this.state = {
      editorOpen: this.props.annotating
    };
  }

  handleCloseEditor = () => {
    this.setState({
      editorOpen: false
    });
  };

  maybeTruncateSelection() {
    if (
      this.props.truncate &&
      this.props.subject.length > this.props.truncate
    ) {
      return (
        <Selection.Truncated
          selection={this.props.subject}
          truncate={this.props.truncate}
        />
      );
    }

    return this.props.subject;
  }

  renderShareEditor(type) {
    if (!type) return null;
    const cancelFunction = this.props.closeDrawer
      ? this.props.closeDrawer
      : this.handleCloseEditor;

    /* eslint-disable no-unreachable */
    switch (type) {
      case "citation":
        return <Share.Citation {...this.props} cancel={cancelFunction} />;
        break;
      // Email will go here, when the time is right...
      default:
        return null;
        break;
    }
  }
  /* eslint-enable no-unreachable */

  render() {
    return (
      <div className="annotation-selection">
        <div className="selection-text">
          <div className="container">
            <i className="manicon manicon-quote" aria-hidden="true" />
            {this.maybeTruncateSelection()}
          </div>
        </div>
        {this.state.editorOpen
          ? this.renderShareEditor(this.props.shareType)
          : null}
      </div>
    );
  }
}
