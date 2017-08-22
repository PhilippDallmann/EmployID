import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import _ from 'lodash';

import MeetingCollection from '../../../api/meetings/meetings';
import GroupCollection from '../../../api/groups/groups';
import NotificationCollection from '../../../api/notifications/notifications';
import HomeActions from '../../../reflux/actions/homeActions';
import HomeStore from '../../../reflux/stores/homeStore';

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Panel = require('react-bootstrap').Panel;
const Button = require('react-bootstrap').Button;
const Tabs = require('react-bootstrap').Tabs;
const Tab = require('react-bootstrap').Tab;
const DropdownButton = require('react-bootstrap').DropdownButton;
const MenuItem = require('react-bootstrap').MenuItem;

const MeetingListItem = React.createClass({
  formatDate(dateString) {
    const date = new Date(dateString);
    return (`${(`0${date.getHours()}`).slice(-2)
    }:${(`0${date.getMinutes()}`).slice(-2)} ${(`0${date.getDate()}`).slice(-2)}.${(`0${date.getMonth() + 1}`).slice(-2)
    }.${date.getFullYear()}`);
  },
  isOwner() {
    return this.props.meeting.owner == Meteor.userId();
  },
  getGroupName(groupId) {
    const res = GroupCollection.findOne(groupId);
    if (res) {
      return res.name;
    }
  },
  handleOptionsDropdown(e) {
    e.preventDefault();
    e.stopPropagation();
  },
  openMeeting(meetingId) {
    const url = `meeting/${meetingId}`;
    const path = FlowRouter.path('/meeting/:meeting', { meeting: meetingId });
    FlowRouter.go(path);
  },
  openEditMeeting() {
    HomeActions.openEditMeeting(this.props.meeting);
  },
  render() {
    const monthNames = ['jan', 'feb', 'mar', 'apr', 'may', 'jun',
      'jul', 'aug', 'sep', 'oct', 'nov', 'dec',
    ];
    const meeting = this.props.meeting;
    const date = new Date(meeting.start_date);
    const me = this;
    return (
      <div onClick={function () { me.openMeeting(meeting._id); }}>
        <li key={meeting._id} className="meeting-item">
          <Row>
            <Col md={2} className="clearfix">
              <span className="day">{date.getDate()}</span>
              <span className="month">{monthNames[date.getMonth()]}</span>
            </Col>
            <Col md={10}>
              <span className="topic">{meeting.topic}</span>
              <p>{meeting.description}</p>
              <div className="group">
                <span className="glyphicon glyphicon-user" />
                <span>{this.getGroupName(meeting.group)}</span>
              </div>
              <div className="time">
                <span className="glyphicon glyphicon-time" />
                <span>{date.toString()}</span>
              </div>
            </Col>
          </Row>
          <div className="dropdown-wrapper" onClick={function (e) { me.handleOptionsDropdown(e); }}>
            <DropdownButton id="optionsDropdown" noCaret pullRight title={<span className="glyphicon glyphicon-option-vertical" />}>
              {this.isOwner() ? <MenuItem eventKey="1" onClick={this.openEditMeeting}>{TAPi18n.__('home.editMeeting')}</MenuItem> : null}
            </DropdownButton>
          </div>
        </li>
      </div>
    );
  },
});

const GroupTab = React.createClass({
  render() {
    return (
      <div className="" />
    );
  },
});

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createMeetingModal: null,
      createGroupModal: null,
      showCurrentMeetings: true,
      showPastMeetings: false,
    };
    this.togglePastMeetings = this.togglePastMeetings.bind(this);
    this.toggleCurrentMeetings = this.toggleCurrentMeetings.bind(this);
  }
  componentWillMount() {
    document.title = TAPi18n.__('home.documentTitle');
  }
  openCreateMeeting() {
    HomeActions.openCreateMeeting();
  }
  openCreateGroup() {
    HomeActions.openCreateGroup();
  }
  toggleCurrentMeetings() {
    this.setState({
      showCurrentMeetings: true,
      showPastMeetings: false,
    });
  }
  togglePastMeetings() {
    this.setState({
      showCurrentMeetings: false,
      showPastMeetings: true,
    });
  }
  formatDate(dateString) {
    const date = new Date(dateString);
    return (`${(`0${date.getDate()}`).slice(-2)}.${(`0${date.getMonth() + 1}`).slice(-2)
    }.${date.getFullYear()} ${(`0${date.getHours()}`).slice(-2)
    }:${(`0${date.getMinutes()}`).slice(-2)}`);
  }
  getGroupName(groupId) {
    const res = GroupCollection.findOne(groupId);
    if (res) {
      return res.name;
    }
  }
  openEditGroup(group) {
    HomeActions.openEditGroup(group);
  }
  confirmUser(notificationId) {
    Meteor.call('addConfirmation', notificationId, Meteor.userId());
  }
  declineInvitation(groupId) {
    Meteor.call('removeUserFromGroup', groupId, Meteor.userId());
  }
  render() {
    const meetingPanelHeading = (
      <Row>
        <div className="title-panel pull-left">{TAPi18n.__('home.meetings')}</div>
        <div className="pull-right">
          <DropdownButton id="sortDropdown" title={TAPi18n.__('home.sort')}>
            <MenuItem eventKey="1" onClick={this.toggleCurrentMeetings}>{TAPi18n.__('home.upcomingMeetings')}</MenuItem>
            <MenuItem eventKey="2" onClick={this.togglePastMeetings}>{TAPi18n.__('home.pastMeetings')}</MenuItem>
          </DropdownButton>
          <Button className="pull-right" onClick={this.openCreateMeeting}><span className="glyph glyphicon glyphicon-plus-sign" /></Button>
        </div>

      </Row>
    );
    const groupPanelHeading = (
      <Row>
        <div className="title-panel pull-left">{TAPi18n.__('home.groups')}</div>
        <div className="pull-right">
          <Button className="pull-right" onClick={this.openCreateGroup}><span className="glyph glyphicon glyphicon-plus-sign" /></Button>
        </div>
      </Row>
    );
    return (
      <div className="home">
        <Grid fluid>
          <Row>
            <Col sm={12} md={7} lg={7}>
              <Panel className="meeting-panel" header={meetingPanelHeading}>
                <ul className="meeting-list">
                  {!this.state.showPastMeetings ? this.props.upcomingMeetings.map(meeting => (
                    <MeetingListItem meeting={meeting} />
                  )) : this.props.pastMeetings.map(meeting => (
                    <MeetingListItem meeting={meeting} />
                  ))}
                </ul>
              </Panel>
            </Col>
            <Col sm={12} md={5} lg={5}>
              <Panel className="group-panel" header={groupPanelHeading}>
                <Tabs id="groupOverview" defaultActiveKey={0}>
                  <Tab eventKey={0} title={TAPi18n.__('home.groupOverview')}>
                    <ul>
                      {this.props.notifications.map((n, index) => {
                        let date = new Date(n.timestamp);
                        date = date.toLocaleString();
                        if (n.needs_confirmation && !_.includes(n.confirmed_by, Meteor.userId())) {
                          return (
                            <li className="list-group-item">
                              <span className="notification-date">{date}</span>
                              <span className="notification-owner" onClick={() => FlowRouter.go(`/users/${n.owner.username}`)}>{`${n.owner.username} `}</span>
                              {n.text}
                              <button onClick={this.confirmUser.bind(this, n._id)}>{TAPi18n.__('notifications.accept')}</button>
                              <button onClick={this.declineInvitation.bind(this, n.group_id)} >{TAPi18n.__('notifications.decline')}</button>
                            </li>
                          );
                        }
                        return (
                          <li className="list-group-item">
                            <span className="notification-date">{date}</span>
                            <span className="notification-owner" onClick={() => FlowRouter.go(`/users/${n.owner.username}`)}>{`${n.owner.username} `}</span>
                            {n.text}
                          </li>
                        );
                      })}
                    </ul>
                  </Tab>
                  {this.props.groupsOfUser.map((group, index) => (
                    <Tab eventKey={index + 1} title={Meteor.userId() == group.owner ? <div>{group.name} <Button onClick={this.openEditGroup.bind(null, group)} className="glyph glyphicon glyphicon-edit" /></div> : <div>{group.name}</div>}><GroupTab /></Tab>
                  ))}
                </Tabs>
              </Panel>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

Home.propTypes = {
  upcomingMeetings: PropTypes.array.isRequired,
  pastMeetings: PropTypes.array.isRequired,
  groupsOfUser: PropTypes.array.isRequired,
  notifications: PropTypes.array.isRequired,
};

export default createContainer(() => {
  let date = new Date();
  date = date.setHours(date.getHours() - 1);
  date = new Date(date);
  return {
    upcomingMeetings: MeetingCollection.find({ start_date: { $gte: date.toISOString() } }, { sort: ['start_date', 'asc'] }).fetch(),
    pastMeetings: MeetingCollection.find({ start_date: { $lte: date.toISOString() } }, { sort: ['start_date', 'desc'] }).fetch(),
    groupsOfUser: GroupCollection.find().fetch(),
    notifications: NotificationCollection.find({}, { sort: { timestamp: -1 } }).fetch(),
  };
}, Home);
