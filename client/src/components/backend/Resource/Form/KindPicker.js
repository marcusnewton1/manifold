import React, { PureComponent, PropTypes } from 'react';
import classNames from 'classnames';
import { Resource } from 'components/frontend';

export default class KindPicker extends PureComponent {

  static displayName = "Resource.KindPicker";

  static propTypes = {
    kind: PropTypes.string,
    setKind: PropTypes.func,
    includeButtons: PropTypes.bool
  };

  renderKindPickerButtons(kindList) {
    if (!kindList) return null;
    return (
      <ul>
        {kindList.map((kind) => {
          const safeKind = kind.toLowerCase();
          const buttonClass = classNames({
            button: true,
            active: safeKind === this.props.kind
          });
          return (
            <li key={safeKind}>
              <div
                onClick={() => { this.props.setKind(safeKind); }}
                className={buttonClass}
              >
                <figure>
                  <figcaption>
                    {kind}
                  </figcaption>
                  <div className={`resource-icon ${safeKind}`}>
                    <Resource.Icon.Composer kind={safeKind}/>
                  </div>
                </figure>
              </div>
            </li>
          );
        })}
      </ul>
    );
  }

  render() {
    const kindList = [
      'Image',
      'Video',
      'Audio',
      'File',
      'Link',
      'PDF',
      'Document',
      'Spreadsheet',
      'Presentation',
      'Interactive',
    ];

    const selectClass = classNames({
      'picker-select': true,
      'select-only': !this.props.includeButtons
    });

    return (
      <div className="resource-kind-picker form-secondary">
        <div className="form-input">
        <label>
          Kind
        </label>
          <div className={selectClass}>
            <div className="form-select">
              <i className="manicon manicon-caret-down"></i>
                <select
                  onChange={(event) => {
                    this.props.setKind(event.target.value);
                  }}
                  value={this.props.kind.toLowerCase()}
                >
                  {kindList.map((kind) => {
                    const safeKind = kind.toLowerCase();

                    return (
                      <option key={safeKind} value={safeKind} id={safeKind}>
                        {kind}
                      </option>
                    );
                  })}
                </select>
            </div>
          </div>
          {this.props.includeButtons ? this.renderKindPickerButtons(kindList) : null}
        </div>
      </div>
    );
  }

}
