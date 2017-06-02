import React, { PureComponent, PropTypes } from 'react';
import connectAndFetch from 'utils/connectAndFetch';
import { Ingestion } from 'components/backend';
import { renderRoutes } from 'helpers/routing';
import { entityStoreActions } from 'actions';
import { ingestionsAPI, requests } from 'api';
import { select, isLoaded } from 'utils/entityUtils';
const { request } = entityStoreActions;
import lh from 'helpers/linkHandler';

export class IngestionEdit extends PureComponent {

  static displayName = "ProjectDetail.Text.Ingestion.Edit";

  static fetchData(getState, dispatch, location, match) {
    if (isLoaded(requests.beIngestionShow, getState())) return;
    const call = ingestionsAPI.show(match.params.ingestionId);
    const ingestion = request(call, requests.beIngestionShow);
    return dispatch(ingestion);
  }

  static mapStateToProps(state) {
    return {
      ingestion: select(requests.beIngestionShow, state.entityStore),
    };
  }

  static propTypes = {
    project: PropTypes.object.isRequired,
    text: PropTypes.object,
    history: PropTypes.object
  };

  handleSuccess = () => {
    this.redirectToIngestion(this.props.ingestion.id);
  };

  redirectToIngestion(ingestionId) {
    const path = lh.link(
      'backendProjectTextsIngestionIngest',
      this.projectId,
      ingestionId
    );
    this.props.history.push(path);
  }

  get projectId() {
    return this.props.project.id;
  }

  render() {
    return (
      <div>
        <Ingestion.Form.Wrapper
          ingestion={this.props.ingestion}
          location={this.props.location}
          history={this.props.history}
          name={requests.beIngestionCreate}
          project={this.props.project}
          onSuccess={this.handleSuccess}
        />
      </div>
    );
  }
}

export default connectAndFetch(IngestionEdit);