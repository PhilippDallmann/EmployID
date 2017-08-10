import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';

import MeetingCollection from "../../../api/meetings/meetings";

import InnerTab from "./innerTab/innerTab";

import MeetingTimeActions from '../../../reflux/actions/meetingTimeActions';

let Tabs = require("react-bootstrap").Tabs;
let Tab = require("react-bootstrap").Tab;

class Meeting extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
      document.title = TAPi18n.__("meeting.documentTitle");
  }
  render() {
      return (
          <div className="topic">
              <div className="general-info pull-right">
              </div>

              <Tabs className="my-tabs" activeKey={this.props.currentMeeting && this.props.currentMeeting.active_stage_id}>
                  <Tab eventKey={0} title={<div>{TAPi18n.__("meeting.phase1")}</div>}/>
                  <Tab eventKey={1} title={<div>{TAPi18n.__("meeting.phase2")}</div>}/>
                  <Tab eventKey={2} title={<div>{TAPi18n.__("meeting.phase3")}</div>}/>
                  <Tab eventKey={3} title={<div>{TAPi18n.__("meeting.phase4")}</div>}/>
                  <Tab eventKey={4} title={<div>{TAPi18n.__("meeting.phase5")}</div>}/>
                  <Tab eventKey={5} title={<div>{TAPi18n.__("meeting.phase6")}</div>}/>
                  <Tab eventKey={6} title={<div>{TAPi18n.__("meeting.phase7")}</div>}/>
              </Tabs>
              <InnerTab stageId={this.props.currentMeeting && this.props.currentMeeting.active_stage_id}/>
          </div>
      );
  }
}

Meeting.propTypes = {
  currentMeeting: PropTypes.object
};

export default createContainer(() => {
  //subscriptions
  Meteor.subscribe("currentMeeting", FlowRouter.getParam('meetingId'));

  var currentMeeting = MeetingCollection.find().fetch()[0];

  // #hack if current meeting changes, getMeteorData is called
  // so we can trigger timer
  MeetingTimeActions.meetingDataHasChanged(currentMeeting);

  return {
    currentMeeting: currentMeeting
  };
},Meeting);