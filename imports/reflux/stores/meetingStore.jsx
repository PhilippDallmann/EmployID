import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';

import MeetingActions from '../actions/meetingActions';
import MeetingTimeActions from '../actions/meetingTimeActions';

import StageCollection from '../../api/stages/stages';
import StageMessagesCollection from '../../api/stageMessages/stageMessages';

const Reflux = require('reflux');

const MeetingStore = Reflux.createStore({
  listenables: [MeetingActions],
  state: {
    totalTimeInterval: null,
    timeTotal: null,
  },
  onCreateChatMessage(message, chatId) {
    Meteor.call('createChatMessage', message, chatId);
  },
  onCreateBotChatMessage(stageKey, chatId) {
    // TODO select language?
    const currentLanguageKey = TAPi18n.getLanguage();
    const messageText = StageMessagesCollection.find({
      language_key: currentLanguageKey, stage: stageKey,
    }).fetch()[0].message;

    const message = {
      userId: 'chatBot',
      userName: 'chatBot',
      text: messageText,
      isBotMessage: true,
    };

    Meteor.call('createChatMessage', message, chatId);
  },
  onUpdateMeetingStageAndSetStageActive(meeting, newStage) {
    const currentStageDuration = StageCollection.find({ stage_id: newStage }).fetch()[0].duration;
    const currentStageEndtime = Date.parse(new Date()) + (currentStageDuration * 1000);

    Meteor.call('updateMeetingStageAndSetStageActive', meeting._id, newStage, currentStageEndtime);
  },
  onPlayMeeting(meeting) {
    if (meeting.active_stage_id === 0) {
      this.onUpdateMeetingStageAndSetStageActive(meeting, 1);
    } else {
      const currentStageEndtime = Date.parse(new Date()) + (meeting.current_stage_time_remaining * 1000);
      Meteor.call('updateMeetingStatusWithTimeRemaining', meeting._id, 1, null, currentStageEndtime);
    }
  },
  onPauseMeeting(meetingId) {
    MeetingTimeActions.pauseTimer(meetingId);
  },
  onUpdateMeetingStatusWithTimeRemaining(meetingId, statusCode, currentStageTimeRemaining, endtime) {
    Meteor.call('updateMeetingStatusWithTimeRemaining', meetingId, statusCode, currentStageTimeRemaining, endtime);
  },
});

export default MeetingStore;
