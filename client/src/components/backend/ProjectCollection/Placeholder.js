import React, { Component } from "react";
import { SVG } from "components/global";
import { Link } from "react-router-dom";
import { HigherOrder } from "containers/global";
import lh from "helpers/linkHandler";

const helpLink = "https://manifoldapp.org/docs/";

export default class ProjectCollectionPlaceholder extends Component {
  static displayName = "ProjectCollection.Placeholder";

  render() {
    return (
      <section>
        <div className="container">
          <div className="project-collection-placeholder">
            <header className="section-heading">
              <SVG.BooksOnShelf />
              <div className="main">
                <div className="body">
                  <h4 className="title">
                    {"Ready to create a Project Collection?"}
                  </h4>
                </div>
              </div>
            </header>
            <div className="centered-message">
              With Project Collections, you can take control of what appears on your Manifold Library homepage. Create custom groupings of Projects and change their order and visibility. You can handpick your collections and order them manually, or you can create Smart Collections that automatically update based on your filtering criteria.
            </div>
            <div className="button">
              <Link to={lh.link("backend")} className="button-icon-primary">
                <i className="manicon manicon-plus" />
                <span>{"Create a Collection"}</span>
              </Link>
            </div>
            <div className="documentation-link">
              <Link to={helpLink}>
                Visit our documentation
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
