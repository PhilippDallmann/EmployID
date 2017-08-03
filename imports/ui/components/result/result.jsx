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

let Tabs = require("react-bootstrap").Tabs;
let Tab = require("react-bootstrap").Tab;
let Grid = require('react-bootstrap').Grid;
let Row = require('react-bootstrap').Row;
let Col = require('react-bootstrap').Col;

class Result extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    document.title = TAPi18n.__("meeting.documentTitle");
  }
  render() {
    return (
      <div>
        <Col sm={12} md={3} lg={4}>
          <div/>
        </Col>
        <Col sm={12} md={9} lg={8}>
          <ResultEditor/>
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