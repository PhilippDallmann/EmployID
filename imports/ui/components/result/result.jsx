import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';

import MeetingCollection from '../../../api/meetings/meetings';
import ResultCollection from '../../../api/results/results';
import ResultEditor from '../meeting/innerTab/resultEditor';

import MeetingTimeActions from '../../../reflux/actions/meetingTimeActions';
import MeetingTimeStore from '../../../reflux/stores/meetingTimeStore';
import MeetingActions from "../../../reflux/actions/meetingActions";
import MeetingStore from "../../../reflux/stores/meetingStore";

let FormGroup = require("react-bootstrap").FormGroup;
let FormControl = require("react-bootstrap").FormControl;
let ControlLabel = require("react-bootstrap").ControlLabel;
let Radio = require('react-bootstrap').Radio;
let Well = require("react-bootstrap").Well;
let Panel = require('react-bootstrap').Panel;
let Row = require('react-bootstrap').Row;
let Col = require('react-bootstrap').Col;

class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      shareValue: this.props.currentResult && this.props.currentResult.sharing,
      topic: this.props.currentMeeting && this.props.currentMeeting.topic,
      description: this.props.currentMeeting && this.props.currentMeeting.description
    };

    this.onSharingChange = this.onSharingChange.bind(this);
    this.onTopicChange = this.onTopicChange.bind(this);
    this.onDescriptionChange = this.onDescriptionChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      shareValue: nextProps.currentResult && nextProps.currentResult.sharing,
      topic: nextProps.currentMeeting && nextProps.currentMeeting.topic,
      description: nextProps.currentMeeting && nextProps.currentMeeting.description
    });
  }
  componentWillMount() {
    document.title = TAPi18n.__("meeting.documentTitle");
  }
  onSharingChange(event) {
    this.setState({
      shareValue: event.target.value
    });
  }
  onTopicChange(event) {
    this.setState({
      topic: event.target.value
    });
  }
  onDescriptionChange(event) {
    this.setState({
      description: event.target.value
    });
  }
  render() {
    return (
      <div className="result-page">
        <Col sm={12} md={3} lg={4}>
          <Panel className="result-settings-panel" header={TAPi18n.__("result.settingsHeader")}>
            <div className='result-settings-panel-body'>
              <Well>
                <FormGroup controlId="formInlineName">
                  <ControlLabel>{TAPi18n.__('createMeetingModal.topic')}</ControlLabel>
                  <FormControl type="text" value={this.state.topic} onChange={this.onTopicChange}/>
                  <ControlLabel>{TAPi18n.__('createMeetingModal.description')}</ControlLabel>
                  <FormControl type="text" value={this.state.description} onChange={this.onDescriptionChange}/>
                </FormGroup>
              </Well>
              <Well>
                <label className="control-label">{TAPi18n.__("result.sharingSettings")}</label>
                <FormGroup onChange={this.onSharingChange}>
                  <Radio name="radioGroup" value='public' checked={this.state.shareValue==='public'}>
                    {TAPi18n.__("result.share1")}
                  </Radio>
                  <Radio name="radioGroup" value='group' checked={this.state.shareValue==='group'}>
                    {TAPi18n.__("result.share2")}
                  </Radio>
                  <Radio name="radioGroup" value='self' checked={this.state.shareValue==='self'}>
                    {TAPi18n.__("result.share4")}
                  </Radio>
                  <Radio name="radioGroup" value='delete' checked={this.state.shareValue==='delete'}>
                    {TAPi18n.__("result.share3")}
                  </Radio>
                </FormGroup>
              </Well>
            </div>
          </Panel>
        </Col>
        <Col className="" sm={12} md={9} lg={8}>
          <ResultEditor facilitator={this.props.currentMeeting ? this.props.currentMeeting.facilitator : null}
                        meetingId={this.props.currentMeeting? this.props.currentMeeting._id : null}
                        resultId={this.props.currentMeeting? this.props.currentMeeting.result_id : null}
                        result={this.props.currentResult? this.props.currentResult.text : null}/>
        </Col>
      </div>
    );
  }
}

Result.propTypes = {
  currentMeeting: PropTypes.object,
  currentResult: PropTypes.object
};

export default createContainer(() => {
    //subscriptions
  Meteor.subscribe("currentMeeting", FlowRouter.getParam('meetingId'));
  Meteor.subscribe('currentResult', FlowRouter.getParam('meetingId'));

  return {
    currentMeeting: MeetingCollection.find().fetch()[0],
    currentResult: ResultCollection.find().fetch()[0]
  };
},Result);