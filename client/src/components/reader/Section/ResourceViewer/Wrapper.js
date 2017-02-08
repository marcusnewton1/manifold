import React, { PureComponent, PropTypes } from 'react';
import Viewer from './Viewer';
import throttle from 'lodash/throttle';

export default class ResourceViewerWrapper extends PureComponent {

  static displayName = "ResourceViewer.Wrapper";

  static propTypes = {
    resources: PropTypes.array,
    annotations: PropTypes.array,
    containerSize: PropTypes.number,
    body: PropTypes.object
  };

  constructor() {
    super();
    this.resourceMarkers = this.resourceMarkers.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.updates !== nextProps.updates) return true;
    if (this.props.annotations !== nextProps.annotations) return true;
    if (this.props.resources !== nextProps.resources) return true;
    if (this.props.body !== nextProps.body) return true;
    if (this.props.containerSize !== nextProps.containerSize) return true;
    return false;
  }

  resourceMarkers() {
    const markers = [];
    if (!this.props.body) return markers;
    const markerNodes = this.props.body.querySelectorAll('[data-resource]');
    [...markerNodes].forEach((markerNode) => {
      const id = markerNode.getAttribute('data-resource');
      const rect = markerNode.getBoundingClientRect();
      markers.push({
        id,
        rect: {
          top: rect.top + document.body.scrollTop
        }
      });
    });
    return markers;
  }

  render() {
    if (!this.props.resources) return null;
    return (
      <Viewer
        resources={this.props.resources}
        resourceMarkers={this.resourceMarkers()}
        containerSize={this.props.containerSize}
      />
    );
  }
}