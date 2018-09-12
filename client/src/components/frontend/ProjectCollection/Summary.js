import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { ProjectList } from "components/frontend";
import get from "lodash/get";
import classnames from "classnames";
import lh from "helpers/linkHandler";

export default class ProjectCollectionSummary extends Component {
  static displayName = "ProjectCollectionSummary";

  static propTypes = {
    collection: PropTypes.object.isRequired,
    limit: PropTypes.number,
    dispatch: PropTypes.func,
    authentication: PropTypes.object,
    moreLabel: PropTypes.string
  };

  static defaultProps = {
    limit: 8,
    moreLabel: "View all projects in this collection"
  };

  renderMoreButton(props) {
    if (props.collection.relationships.projects.length <= props.limit) return null;

    return (
      <div className="utility">
        <Link to={lh.link("frontendProjectCollection", props.collection.attributes.slug)}>
          {this.props.moreLabel}
          <i className="manicon manicon-arrow-long-right" />
        </Link>
      </div>
    );
  }

  render() {
    const collection = this.props.collection;
    if (!collection) return null;

    const backgroundClasses = classnames({
      "project-collection-summary": true,
      "bg-neutral05": collection.attributes.position % 2 !== 0
    });

    return (
      <section key={collection.id} className={backgroundClasses}>
        <div className="container">
          <a className="section-heading" href={lh.link("frontendProjectCollection", collection.attributes.slug)}>
            <div className="main">
              <i className={`manicon manicon-${collection.attributes.icon}`} aria-hidden="true" />
              <div className="body">
                <h4 className="title">{collection.attributes.title}</h4>
              </div>
            </div>
          </a>
          <ProjectList.Grid
            authenticated={this.props.authentication.authenticated}
            favorites={get(this.props.authentication, "currentUser.favorites")}
            projects={collection.relationships.projects}
            dispatch={this.props.dispatch}
            limit={this.props.limit}
          />
          {this.renderMoreButton(this.props)}
        </div>
      </section>
    );
  }
}
