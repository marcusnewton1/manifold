import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import { Droppable, DragDropContext, Draggable } from "react-beautiful-dnd";
import sortBy from "lodash/sortBy";
import isEqual from "lodash/isEqual";
import { SortableContainer, SortableElement } from 'react-sortable-hoc';

export default class ListOrderable extends PureComponent {

  static propTypes = {
    entities: PropTypes.array,
    entityComponent: PropTypes.func.isRequired,
    entityComponentProps: PropTypes.object,
    grid: PropTypes.bool,
    name: PropTypes.string.isRequired,
    orderChangeHandler: PropTypes.func.isRequired,
    classNames: PropTypes.string
  };

  static defaultProps = {
    classNames: "list-orderable",
    grid: false
  };

  constructor(props) {
    super(props);
    this.state = this.initialState(props);
  }

  initialState(props) {
    let orderedEntities = [];

    if (props.entities) {
      orderedEntities = Array.from(sortBy(props.entities, entity => entity.attributes.position));
    }

    return { orderedEntities }
  }

  handleListOrderChange = result => {
    if (!result.destination) return null;
    this.setState({ orderedEntities: this.setOrderByChange(result.source.index, result.destination.index) }, () => {
      const position = result.destination.index;
      const adjustedPosition = this.getAdjustedPosition(position);

      return this.props.orderChangeHandler({ id: result.draggableId, position: adjustedPosition});
    });
  };

  handleGridOrderChange = (result) => {
    if (!result) return null;

    const entity = this.state.orderedEntities[result.oldIndex];
    if (!entity) return null;

    this.setState({ orderedEntities: this.setOrderByChange(result.oldIndex, result.newIndex) }, () => {
      const adjustedPosition = this.getAdjustedPosition(result.newIndex);

      return this.props.orderChangeHandler({ id: entity.id, position: adjustedPosition});
    });
  };

  componentDidUpdate(prevProps, prevStateIgnored) {
    const prevEntities = prevProps.entities || [];
    const currentEntities = this.props.entities || [];

    if (!isEqual(prevEntities.sort().map(e => e.id), currentEntities.sort().map(e => e.id))) {
      return this.setOrderByPosition(this.props.entities);
    }
  }

  getAdjustedPosition(position) {
    const entityCount = this.state.orderedEntities.length;

    if (position <= 0) return "top";
    if (position >= entityCount) return "bottom";
    return position + 1;
  }

  setOrderByChange(oldPos, newPos) {
    const ordered = Array.from(this.state.orderedEntities);
    const [removed] = ordered.splice(oldPos, 1);
    ordered.splice(newPos, 0, removed);

    return ordered;
  }

  setOrderByPosition(entities) {
    const orderedEntities = Array.from(sortBy(entities, entity => entity.attributes.position));
    return this.setState({ orderedEntities });
  }

  renderGridEntity = (entity, index) => {
    const Component = this.props.entityComponent;

    const GridItem = SortableElement(({ entity }) => {
      return (
        <li className="orderable-list-item" >
          <Component
            entity={entity}
            {...this.props.entityComponentProps}
          />
        </li>
      );
    });

    return <GridItem key={entity.id} entity={entity} index={index} />
  };

  renderGrid(entities) {
    const Grid = SortableContainer(({ entities }) => {
      return (
        <ul className={this.props.classNames}>
          {entities.map((entity, index) => {
            return this.renderGridEntity(entity, index);
          })}
        </ul>
      )
    });

    return <Grid entities={entities} helperClass="dragging" onSortEnd={this.handleGridOrderChange} axis={"xy"} />
  }

  renderListEntity = (entity, index) => {
    const Component = this.props.entityComponent;

    return (
      <Draggable draggableId={entity.id} key={`draggable-${entity.id}`} index={index}>
        {(provided, snapshot) => (
          <div ref={provided.innerRef}
               {...provided.draggableProps}
               className="orderable-list-item"
          >
            <Component
              entity={entity}
              dragHandleProps={provided.dragHandleProps}
              {...this.props.entityComponentProps}
            />
          </div>
        )}
      </Draggable>
    )
  };

  renderList(entities) {
    return (
      <DragDropContext onDragEnd={this.handleListOrderChange}>
        <Droppable droppableId={`${this.props.name}-0`}>
          {(provided, snapshot) => (
            <div className={this.props.classNames}
                 ref={provided.innerRef}
            >
              {entities.map((entity, index) => {
                return this.renderListEntity(entity, index);
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render() {
    if (!this.state.orderedEntities) return null;

    if (this.props.grid) return this.renderGrid(this.state.orderedEntities);

    return this.renderList(this.state.orderedEntities);
  }
}
