import React, { Component } from "react";
import PropTypes from "prop-types";
import { Form, Dialog } from "components/backend";
import ColorPicker from "./ColorPicker";
import { Project } from "components/global";
import setter from "components/backend/Form/setter";
import classNames from "classnames";

class AvatarBuilder extends Component {
  static displayName = "Project.Form.AvatarBuilder";

  static propTypes = {
    project: PropTypes.object,
    getModelValue: PropTypes.func,
    setOther: PropTypes.func,
    wide: PropTypes.bool
  };

  static defaultProps = {};

  constructor(props) {
    super(props);
    this.state = {
      confirmation: null
    };
  }

  onColorChange = color => {
    if (
      this.props.getModelValue("attributes[avatar][data]") ||
      this.props.getModelValue("attributes[avatarStyles][smallSquare]")
    ) {
      return this.handleColorChange(color);
    }
    this.setAvatarColor(color);
  };

  onUploadChange = image => {
    if (!image) return this.removeAvatar();
    this.setAvatarImage(image);
  };

  setAvatarImage(image) {
    if (!image) return null;
    this.props.setOther(false, "attributes[removeAvatar]");
    this.props.setOther(image, "attributes[avatar]");
  }

  setAvatarColor(color) {
    if (!color) return null;
    this.props.setOther(color.value, "attributes[avatarColor]");
  }

  handleColorChange = color => {
    const heading =
      "Changing this will remove the project's current avatar image";
    const message = "Do you wish to proceed?";
    new Promise((resolve, reject) => {
      this.setState({
        confirmation: { resolve, reject, heading, message }
      });
    }).then(
      () => {
        this.removeAvatar();
        this.setAvatarColor(color);
        this.closeDialog();
      },
      () => {
        this.closeDialog();
      }
    );
  };

  removeAvatar() {
    this.props.setOther(true, "attributes[removeAvatar]");
    this.props.setOther(null, "attributes[avatarStyles][smallSquare]");
    this.props.setOther(null, "attributes[avatar]");
  }

  closeDialog() {
    this.setState({ confirmation: null });
  }

  renderCoverImage(image) {
    if (!image) return null;
    return (
      <div className="preview" style={{ backgroundImage: `url(${image})` }} />
    );
  }

  renderPlaceholderImage() {
    if (!this.props.getModelValue("attributes[avatarColor]")) return null;
    return (
      <div className="preview">
        <Project.Placeholder
          color={this.props.getModelValue("attributes[avatarColor]")}
        />
        <span className="screen-reader-text">Default Project Thumbnail</span>
      </div>
    );
  }

  render() {
    const image =
      this.props.getModelValue("attributes[avatar][data]") ||
      this.props.getModelValue("attributes[avatarStyles][smallSquare]");
    const inputClasses = classNames({
      "form-input avatar-builder": true,
      wide: this.props.wide
    });
    const uploadClasses = classNames({
      section: true,
      upload: true,
      active: image
    });
    const pickerClasses = classNames({
      section: true,
      color: true,
      active: !image
    });

    return (
      <div className={inputClasses}>
        {this.state.confirmation ? (
          <Dialog.Confirm {...this.state.confirmation} />
        ) : null}
        <h4 className="form-input-heading">Project Thumbnail</h4>
        <div className="grid">
          <div className="section current">
            <span className="label" aria-hidden="true">
              Current
            </span>
            <span className="label screen-reader-text">
              Current Project Thumbnail
            </span>
            {image
              ? this.renderCoverImage(image)
              : this.renderPlaceholderImage()}
          </div>
          <div className={pickerClasses}>
            <span className="label" aria-hidden="true">
              Default
            </span>
            <span className="screen-reader-text">
              Select a background color for the default thumbnail
            </span>
            <ColorPicker
              onChange={this.onColorChange}
              value={this.props.getModelValue("attributes[avatarColor]")}
              {...this.props}
            />
          </div>
          <div className={uploadClasses}>
            <span className="label" aria-hidden="true">
              Custom
            </span>
            <span className="screen-reader-text">
              Add a Custom Thumbnail Image
            </span>
            <Form.Upload
              set={this.onUploadChange}
              initialValue={this.props.getModelValue(
                "attributes[avatarStyles][smallSquare]"
              )}
              value={this.props.getModelValue("attributes[avatar]")}
              placeholder="cover"
              accepts="images"
            />
          </div>
        </div>
      </div>
    );
  }
}

export default setter(AvatarBuilder);
