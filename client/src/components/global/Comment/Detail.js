import React, { PureComponent, PropTypes } from 'react';
import { Utility } from 'components/frontend';
import { Comment as CommentContainer } from 'containers/global';
import { Link } from 'react-router';
import classNames from 'classnames';
import { FormattedDate } from 'components/global';
import isObject from 'lodash/isObject';

export default class CommentDetail extends PureComponent {

  static displayName = "Comment.Detail";

  static propTypes = {
    subject: PropTypes.object.isRequired,
    handleDelete: PropTypes.func.isRequired,
    handleDestroy: PropTypes.func.isRequired,
    handleRestore: PropTypes.func.isRequired,
    handleFlag: PropTypes.func.isRequired,
    comment: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      editor: null
    };

    this.handleDelete = this.handleDelete.bind(this);
    this.handleRestore = this.handleRestore.bind(this);
    this.handleDestroy = this.handleDestroy.bind(this);
    this.startEdit = this.startEdit.bind(this);
    this.startReply = this.startReply.bind(this);
    this.closeEditor = this.closeEditor.bind(this);
    this.handleFlag = this.handleFlag.bind(this);
    this.handleUnflag = this.handleUnflag.bind(this);
  }

  handleFlag(event) {
    this.props.handleFlag(event, this.props.comment);
  }

  handleUnflag(event) {
    this.props.handleUnflag(event, this.props.comment);
  }

  handleDelete(event) {
    this.props.handleDelete(event, this.props.comment);
  }

  handleRestore(event) {
    this.props.handleRestore(event, this.props.comment);
  }

  handleDestroy(event) {
    this.props.handleDestroy(event, this.props.comment);
  }

  startEdit() {
    this.setState({
      editor: null
    }, () => {
      this.setState({
        editor: "edit"
      });
    });
  }

  startReply() {
    this.setState({
      editor: null
    }, () => {
      this.setState({
        editor: "reply"
      });
    });
  }

  closeEditor() {
    this.setState({
      editor: null
    });
  }

  renderDeletedComment() {
    const { comment } = this.props;
    return (
      <li className="annotation-comment">
        <section className="meta">
          <div>
            <figure className="author-avatar dull">
              <div className="no-image">
                <i className="manicon manicon-person"></i>
              </div>
            </figure>
            <h4 className="deleted-notification">
              This comment was deleted.
            </h4>
          </div>
        </section>
        <CommentContainer.Thread
          subject={this.props.subject}
          parentId={comment.id}
        />
      </li>
    );
  }

  renderEditor() {
    if (!this.state.editor) return null;
    if (this.state.editor === "reply") return this.renderReplyEditor();
    if (this.state.editor === "edit") return this.renderEditEditor();
    return null;
  }

  renderReplyEditor() {
    return (
      <CommentContainer.Editor
        subject={this.props.subject}
        parentId={this.props.comment.id}
        cancel={this.closeEditor}
      />
    );
  }

  renderEditEditor() {
    return (
      <CommentContainer.Editor
        comment={this.props.comment}
        subject={this.props.subject}
        cancel={this.closeEditor}
      />
    );
  }

  renderComment() {
    const replyButtonClass = classNames({
      active: this.state.replying
    });
    const { comment, parent } = this.props;
    const { creator } = comment.relationships;
    return (
      <li className="annotation-comment">
        <section className="meta">
          <div>
            <figure className="author-avatar dull">
              { creator.attributes.avatarStyles.smallSquare ?
                <img src={creator.attributes.avatarStyles.smallSquare} /> :
                <div className="no-image">
                  <i className="manicon manicon-person"></i>
                </div>
              }
            </figure>
            <h4 className="author-name">
              {creator.attributes.fullName}
              {isObject(parent) ?
                <span className="reply-to">
                  <i className="manicon manicon-arrow-curved-right"></i>
                  Reply to {parent.relationships.creator.attributes.fullName}
                </span>
              : null}
            </h4>
            <datetime>
              <FormattedDate
                format="distanceInWords"
                date={comment.attributes.createdAt}
              /> ago
            </datetime>
          </div>
          {comment.attributes.flagsCount > 0 ?
            <div className="marker">
              {comment.attributes.flagsCount}
              {comment.attributes.flagsCount === 1 ? " flag" : " flags" }
            </div>
            : null}
          {comment.attributes.deleted ?
            <div className="marker">
              Deleted
            </div>
          : null}
        </section>
        <section className="body">
          {comment.attributes.body}
        </section>
        <nav className="utility">
          <ul>
            <li>
              <button
                className={replyButtonClass}
                onClick={this.startReply}
              >
                {'Reply'}
              </button>
            </li>
            {comment.attributes.canUpdateObject ?
              <li>
                <button onClick={this.startEdit}>{'Edit'}</button>
              </li>
              : null}
            {comment.attributes.canDeleteObject && !comment.attributes.deleted ?
              <li>
                <button onClick={this.handleDelete}>{'Delete'}</button>
              </li>
            : null}
            {comment.attributes.deleted ?
              <li>
                <button onClick={this.handleRestore}>{'Restore'}</button>
              </li>
            : null}
            {comment.attributes.deleted ?
              <li>
                <button onClick={this.handleDestroy}>{'Destroy'}</button>
              </li>
            : null}
            {comment.attributes.flagged ?
              <li>
                <button onClick={this.handleUnflag}>{'Unflag'}</button>
              </li>
            :
              <li>
                <button onClick={this.handleFlag}>{'Flag'}</button>
              </li>
            }
          </ul>
          {this.renderEditor()}
        </nav>
        <CommentContainer.Thread
          subject={this.props.subject}
          parent={this.props.comment}
          parentId={comment.id}
        />
      </li>
    );
  }

  render() {
    const { comment } = this.props;
    const { attributes } = comment;
    if (attributes.deleted && !attributes.canReadDeleted) {
      return this.renderDeletedComment();
    }
    return this.renderComment();
  }

}
