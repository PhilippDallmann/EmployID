import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import ReactEmoji from 'react-emoji';
import { Streamy } from 'meteor/yuukan:streamy';

import MeetingCollection from '../../../../api/meetings/meetings';
import ChatMessageCollection from '../../../../api/chatMessages/chatMessages';
import StageCollection from '../../../../api/stages/stages';
import MaterialCollection from '../../../../api/materials/materials';
import ResultCollection from '../../../../api/results/results';

import MeetingActions from '../../../../reflux/actions/meetingActions';
import MeetingTimeActions from '../../../../reflux/actions/meetingTimeActions';
import MeetingTimeStore from '../../../../reflux/stores/meetingTimeStore';
import UserActions from '../../../../reflux/actions/userActions';
import LoadingActions from '../../../../reflux/actions/loadingActions';

import ChatUserBar from './chat/chatUserBar';
import ResultEditor from './resultEditor';
import MaterialArea from './materialArea';

const Reflux = require('reflux');
const Clipboard = require('clipboard');

const Grid = require('react-bootstrap').Grid;
const Row = require('react-bootstrap').Row;
const Col = require('react-bootstrap').Col;
const Panel = require('react-bootstrap').Panel;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const ControlLabel = require('react-bootstrap').ControlLabel;
const Button = require('react-bootstrap').Button;
const DropdownButton = require('react-bootstrap').DropdownButton;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;
const Popover = require('react-bootstrap').Popover;
const ButtonGroup = require('react-bootstrap').ButtonGroup;
const InputGroup = require('react-bootstrap').InputGroup;
const MenuItem = require('react-bootstrap').MenuItem;

const EMOTICONS = [':smiley:', ':pensive:', ':rage:', ':open_mouth:', ':fearful:', ':blush:', ':worried:', ':stuck_out_tongue_closed_eyes:'];
const emojifyOptions = {
  attributes: { width: '20px', height: '20px' },
};
const emojifyButtonOptions = {
  attributes: { width: '18px', height: '18px' },
};
let messageChangeCount = 0;
let currentMeetingId = null;

class InnerTab extends Reflux.Component {
  constructor(props) {
    super(props);

    const time = new Date();
    this.state = {
      stageId: this.props.stageId,
      time: `${(`0${time.getHours()}`).slice(-2)}:${(`0${time.getMinutes()}`).slice(-2)}`,
    };
    this.time = MeetingTimeStore;

    this.createChatMessage = this.createChatMessage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.onPlayButtonClick = this.onPlayButtonClick.bind(this);
    this.onNextStageButtonClick = this.onNextStageButtonClick.bind(this);
    this.onPauseButtonClick = this.onPauseButtonClick.bind(this);
    this.showOnlyIfFacilitator = this.showOnlyIfFacilitator.bind(this);
    this.isFacilitator = this.isFacilitator.bind(this);
    this.getRole = this.getRole.bind(this);
    this.onRecorderSelect = this.onRecorderSelect.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.currentChatMessages !== this.props.currentChatMessages || nextProps.currentResult !== this.props.currentResult) {
      return true;
    }
    return false;
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      stageId: nextProps.stageId,
    });
  }
  componentDidMount() {
    require('../../../../../node_modules/clipboard/dist/clipboard.js');
    this.updateScroll();
    new Clipboard('.clipboard');
  }
  componentWillUnmount() {
    UserActions.unsetActiveMeeting();
    MeetingTimeActions.killTimer();
    Streamy.leave(currentMeetingId);
  }
  componentDidUpdate() {
    this.updateScroll();
    const time = new Date();
    this.setState({
      time: `${(`0${time.getHours()}`).slice(-2)}:${(`0${time.getMinutes()}`).slice(-2)}`,
    });
  }
  updateScroll() {
    if (document.getElementById('chatDiv')) {
      const element = document.getElementById('chatDiv');
      element.scrollTop = element.scrollHeight;
    }
  }
  createChatMessage() {
    const chatMessageText = document.getElementById('chatMessageTextInput').value;

    const message = {
      userId: Meteor.userId(),
      userName: Meteor.user().username,
      text: chatMessageText,
    };
    MeetingActions.createChatMessage(message, this.props.currentMeeting.chat);

    document.getElementById('chatMessageTextInput').value = '';
  }
  handleChatMessageChange(event) {
    if (messageChangeCount == 0) {
      Streamy.rooms(currentMeetingId).emit('isTyping', { username: Meteor.user().username });
      messageChangeCount = 5;
    } else {
      messageChangeCount -= 1;
    }
  }
  handleKeyPress(event) {
    if (event.key === 'Enter') {
      this.createChatMessage();
    }
  }
  addEmoticon(emoticon, event) {
    let chatMessageText = document.getElementById('chatMessageTextInput').value;

    chatMessageText = chatMessageText ? `${chatMessageText} ${emoticon} ` : ` ${emoticon} `;

    document.getElementById('chatMessageTextInput').value = chatMessageText;
  }
  onPlayButtonClick() {
    if (this.props.currentMeeting.active_stage_id == 0) {
      this.onNextStageButtonClick();
    } else {
      MeetingActions.playMeeting(this.props.currentMeeting);
    }
  }
  onPauseButtonClick() {
    MeetingActions.pauseMeeting(this.props.currentMeeting._id);
  }
  onNextStageButtonClick() {
    const newStageId = this.props.currentMeeting.active_stage_id + 1;

    MeetingActions.updateMeetingStageAndSetStageActive(this.props.currentMeeting, newStageId);
    MeetingActions.createBotChatMessage(newStageId, this.props.currentMeeting.chat);
  }
  onRecorderSelect(event) {
    Meteor.call('updateRecorder', this.props.currentMeeting._id, event.target.value);
    const u = this.props.participants.find(p => p._id === event.target.value);
    const message = {
      userId: Meteor.userId(),
      userName: Meteor.user().username,
      text: `<b>${u.username}</b>${TAPi18n.__('meeting.recorderMessage')}`,
      isBotMessage: true,
    };
    MeetingActions.createChatMessage(message, this.props.currentMeeting.chat);
  }
  showOnlyIfFacilitator() {
    const style = {};
    style.display = (this.props.currentMeeting && this.props.currentMeeting.facilitator == Meteor.userId()) ? null : 'none';
    return style;
  }
  isFacilitator() {
    return this.props.currentMeeting && Meteor.userId() == this.props.currentMeeting.facilitator;
  }
  getRole(userId) {
    if (this.props.currentMeeting && this.props.currentMeeting.facilitator == userId) {
      return ` (${TAPi18n.__('roles.facilitator')})`;
    } else if (this.props.currentMeeting && this.props.currentMeeting.client == userId) {
      return ` (${TAPi18n.__('roles.client')})`;
    }
    return ` (${TAPi18n.__('roles.advisor')})`;
  }
  render() {
    const supportPanelHeading = (
      <Row>
        <div className="title-panel pull-left">
          {TAPi18n.__('meeting.supportPanelHeader')}
        </div>

        <Button
          className="play-button"
          onClick={this.onPlayButtonClick}
          style={this.showOnlyIfFacilitator()}
          disabled={this.props.currentMeeting ? (this.props.currentMeeting.status_code == 1 || (this.props.currentMeeting.current_stage_time_remaining == 0 && this.props.currentMeeting.active_stage_id != 0)) : true}
        >
          <span className="glyph glyphicon glyphicon-play" />
        </Button>

        <Button className="pause-button" onClick={this.onPauseButtonClick} style={this.showOnlyIfFacilitator()} disabled={this.props.currentMeeting ? this.props.currentMeeting.status_code == 0 : true}>
          <span className="glyph glyphicon glyphicon-pause" />
        </Button>

        <Button
          className="nextStage-button"
          onClick={this.onNextStageButtonClick}
          style={this.showOnlyIfFacilitator()}
          disabled={this.props.currentMeeting ? (this.props.currentMeeting.active_stage_id >= 6 || this.props.currentMeeting.active_stage_id == 0) : true}
        >
          <span className="glyph glyphicon glyphicon-forward" />
        </Button>
        <div className="pull-right">
          <FormGroup className="recorder-select form-inline" controlId="formControlsSelect">
            <ControlLabel>{TAPi18n.__('meeting.recorder')}</ControlLabel>
            <FormControl disabled={!this.isFacilitator()} componentClass="select" value={this.props.currentMeeting ? this.props.currentMeeting.recorder : null} onChange={this.onRecorderSelect}>
              {this.props.participants.map((user, index) => (<option value={user._id}>{user.username}</option>))}
            </FormControl>
          </FormGroup>
        </div>
      </Row>
    );
    const regularPage = (
      <div>
        <Panel className="support-panel" header={supportPanelHeading}>
          <MaterialArea stageId={this.state.stageId} chatId={this.props.currentMeeting ? this.props.currentMeeting.chat : null} stage={this.props.currentStage ? this.props.currentStage : null} />
        </Panel>
        <ResultEditor recorder={this.props.currentMeeting ? this.props.currentMeeting.recorder : null} resultId={this.props.currentMeeting ? this.props.currentMeeting.result_id : null} result={this.props.currentResult ? this.props.currentResult.text : null} />
      </div>
    );
    return (
      <div className="inner-tab">
        <Grid fluid>
          <Row>
            <Col
              sm={12}
              md={5}
              lg={6}
            >
              <div className="time-area">
                <h2>{TAPi18n.__('meeting.timeRemaining')} <div id="timer">00:00</div><div id="timerTotal">{TAPi18n.__('meeting.timeRemainingTotal')} {this.state.time}</div></h2>
              </div>
            </Col>
            <Col
              sm={12}
              md={5}
              lg={6}
            >
              <div className="time-area">
                <h2>{this.props.currentMeeting ? TAPi18n.__('meeting.meetingTopic') + this.props.currentMeeting.topic : TAPi18n.__('meeting.meetingTopic')}</h2>
              </div>
            </Col>
          </Row>
          <Row>
            <Col
              sm={12}
              md={5}
              lg={6}
            >
              <Panel className="chat-panel" header={TAPi18n.__('meeting.chatPanelHeader')}>
                <div id="chatDiv" className="chat-div">
                  <div className="chat-text-container">
                    <ul className="message-ul">
                      {this.props.currentChatMessages.map((message) => {
                        let date = new Date(message.timestamp);
                        date = date.toLocaleString();
                        if (message.is_bot_message && message.is_bot_message == true) {
                          var clipTarget = `#${message._id}`;
                          const htmlString = `<div><span class='chat-message-date'>${date}</span><span id=${message._id}>${message.text}</span></div>`;
                          function createMarkup() { return { __html: htmlString }; }
                          return (
                            <div className="bot-message">
                              <li>
                                <OverlayTrigger
                                  trigger="click"
rootClose
placement="right"
overlay={
  <Popover>
            <ButtonGroup vertical block>
                                        <Button className="clipboard" data-clipboard-target={clipTarget} itemID={message._id}>{TAPi18n.__('meeting.addToResult')}</Button>
                                      </ButtonGroup>
          </Popover>
                                  }
                                >
                                  <span className="message-text right" dangerouslySetInnerHTML={createMarkup()} />
                                </OverlayTrigger>
                                <div className="clear" />
                              </li>
                            </div>);
                        } else if (message.user_name === Meteor.user().username) {
                          var clipTarget = `#${message._id}`;
                          return (
                            <div className="message">
                              <li>
                                <OverlayTrigger
                                  trigger="click"
                                  rootClose
                                  placement="left"
                                  overlay={
                                    <Popover>
                                      <ButtonGroup vertical block>
                                        <Button className="clipboard" data-clipboard-target={clipTarget} itemID={message._id}>{TAPi18n.__('meeting.addToResult')}</Button>
                                      </ButtonGroup>
                                    </Popover>
                                  }
                                >
                                  <span className="message-text right"><div><span className="chat-message-date">{date}</span><span id={message._id}>{ReactEmoji.emojify(message.text, emojifyOptions)}</span></div></span>
                                </OverlayTrigger>
                                <div className="clear" />
                              </li>
                            </div>
			                  );
                        }

                        var clipTarget = `#${message._id}`;
                        return (
                          <div className="message">
                            <li>
                              <strong>{`${message.user_name + this.getRole(message.user_id)}:`}</strong>
                              <OverlayTrigger
                                trigger="click"
                                rootClose
                                placement="right"
                                overlay={
                                  <Popover>
                                    <ButtonGroup vertical block>
                                      <Button className="clipboard" data-clipboard-target={clipTarget} itemID={message._id}>{TAPi18n.__('meeting.addToResult')}</Button>
                                    </ButtonGroup>
                                  </Popover>
                                }
                              >
                                <span className="message-text left"><div><span className="chat-message-date">{date}</span><span id={message._id}>{ReactEmoji.emojify(message.text, emojifyOptions)}</span></div></span>
                              </OverlayTrigger>
                              <div className="clear" />
                            </li>
                          </div>
	                  );
                      })}
                      <div className="clear" />
                    </ul>
                  </div>
                </div>
                <ChatUserBar currentMeetingId={this.props.currentMeeting && this.props.currentMeeting._id} />
              </Panel>
              <FormGroup>
                <InputGroup>
                  <InputGroup.Button>
                    <OverlayTrigger
                      trigger="focus"
                      placement="top"
                      onEntered={this.componentDidUpdate}
                      overlay={<Popover id="emojiPopover">
                        {EMOTICONS.map(emo => (
                          <Button key={emo} onClick={event => this.addEmoticon(emo, event)}>
                  <span>{ReactEmoji.emojify(emo, emojifyOptions)}</span>
                </Button>
                        ))}
                      </Popover>}
                    >
                      <Button className="chat-emoticons">
                        <span>{ReactEmoji.emojify(':)', emojifyButtonOptions)}</span>
                      </Button>
                    </OverlayTrigger>
                  </InputGroup.Button>
                  <FormControl
                    id="chatMessageTextInput"
                    onKeyPress={this.handleKeyPress}
                    ref="chatInput"
                    className="chat-input"
                    type="text"
                    placeholder={TAPi18n.__('meeting.chatInputPlaceholder')}
                    onChange={this.handleChatMessageChange}
                  />
                  <InputGroup.Button>
                    <Button onClick={this.createChatMessage}>{TAPi18n.__('meeting.chatInputButton')}</Button>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </Col>
            <Col
              sm={12}
              md={7}
              lg={6}
            >
              {regularPage}
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

InnerTab.propTypes = {
  currentMeeting: PropTypes.object,
  currentChatMessages: PropTypes.array.isRequired,
  currentStage: PropTypes.object,
  roleMaterial: PropTypes.array.isRequired,
  participants: PropTypes.array.isRequired,
};

export default createContainer(({ stageId }) => {
  const meetingId = FlowRouter.getParam('meetingId');

  // subscriptions
  Meteor.subscribe('currentMeeting', meetingId);
  Meteor.subscribe('meetingParticipants', meetingId);
  Meteor.subscribe('currentChatMessages', meetingId);
  const resultHandle = Meteor.subscribe('currentResult', meetingId);
  Meteor.subscribe('stages');
  Meteor.subscribe('stageMessages');

  const currentMeeting = MeetingCollection.find().fetch()[0];
  if (currentMeeting) {
    if (!currentMeetingId) {
      currentMeetingId = currentMeeting._id;
      UserActions.setActiveMeeting(currentMeeting._id);
      Streamy.join(currentMeetingId);
    } else if (currentMeetingId != currentMeeting._id) {
      currentMeetingId = currentMeeting._id;
      UserActions.setActiveMeeting(currentMeeting._id);
      Streamy.join(currentMeetingId);
    }
  }

  if (resultHandle.ready()) {
    LoadingActions.unsetLoading();
  }

  return {
    currentMeeting,
    currentChatMessages: ChatMessageCollection.find().fetch(),
    currentStage: StageCollection.find({ stage_id: stageId }).fetch()[0],
    roleMaterial: MaterialCollection.find().fetch(),
    currentResult: ResultCollection.find().fetch()[0],
    participants: Meteor.users.find().fetch(),
  };
}, InnerTab);
