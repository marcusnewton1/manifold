import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { List, Project, ProjectCollection } from "components/backend";

export default class ProjectCollectionWrapperContainer extends PureComponent {

  static propTypes = {
    projectCollections: PropTypes.array,
    collectionProjects: PropTypes.array
  };

  // Example data, this will come from API/store
  static defaultProps = {
    projectCollections: [
      { id: "c-1",
        attributes: { title: "Collection 1" } },
      { id: "c-2",
        attributes: { title: "Collection 2" } },
      { id: "c-3",
        attributes: { title: "Collection 3" } }
    ],
    collectionProjects: [
      { id: "p-1",
        attributes: { title: "Project 1", abilities: {}, coverStyles: {}, avatarStyles: {} },
        relationships: {} },
      { id: "p-2",
        attributes: { title: "Project 2", abilities: {}, coverStyles: {}, avatarStyles: {} },
        relationships: {} },
      { id: "p-3",
        attributes: { title: "Project 3", abilities: {}, coverStyles: {}, avatarStyles: {} },
        relationships: {} }
    ]
  };

  constructor(props) {
    super(props);
    this.state = { currentCollection: null };
  }

  handleCollectionOrderChange = () => {
    // Make an API request to update the order of the collections
  };

  handleProjectOrderChange = () => {
    // Make an API request to update the order of projects
    // in the current collection
  };

  handleProjectsSortChange = () => {
    // Make an API request to change collection sortBy attribute
  };

  handleCollectionKindChange = () => {
    // Make an API request to change collection kind attribute
  };

  handleCollectionSelect = collection => {
    // Make API request to fetch collection's projects
    this.setState({ currentCollection: collection });
  };

  renderCurrentCollection(collection) {
    if (!collection) return null; // Render empty collections component

    return (
      <React.Fragment>
        <ProjectCollection.SortBy
          collection={this.state.currentCollection}
          sortChangeHandler={this.handleProjectsSortChange}
          kindChangeHandler={this.handleCollectionKindChange}
        />
        <List.Orderable
          entities={this.props.collectionProjects}
          entityComponent={Project.ListItem}
          orderChangeHandler={this.handleProjectOrderChange}
          classNames={"grid-project"}
          styles={
            { display: "flex",
              justifyContent: "space-between",
              alignContent: "center",
              listStyle: "none",
              margin: "0",
              border: "2px solid deepskyblue" }
          }
        />
      </React.Fragment>
    )
  }

  render() {
    return (
      <section className="backend-panel" style={{ border: "2px solid red" }}>
        <div className="container">
          <aside className="aside" style={{ padding: "10px 20px", border: "2px solid hotpink" }}>
            <List.Orderable
              entities={this.props.projectCollections}
              entityComponent={ProjectCollection.ListItem}
              entityComponentProps={{
                active: this.state.currentCollection ? this.state.currentCollection.id : null,
                clickHandler: this.handleCollectionSelect
              }}
              orderChangeHandler={this.handleCollectionOrderChange}
            />
            <div>
              <button className="button-icon-secondary">
                <i className="manicon manicon-plus" />
                  New
              </button>
              <p>
                Drag Collections to reorder how they’ll appear in your Library. Select a Collection to edit its settings, visibility, and contents.
              </p>
            </div>
          </aside>
          <div className="panel">
            {this.renderCurrentCollection(this.state.currentCollection)}
            {/* Render child routes in drawer */}
          </div>
        </div>
      </section>
    );
  }
}
