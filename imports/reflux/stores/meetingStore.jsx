import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");
let Cookies = require("js-cookie");

import MeetingActions from "../actions/meetingActions";

import MeetingTimeActions from '../actions/meetingTimeActions';
import MeetingTimeStore from './meetingTimeStore';

import MeetingCollection from '../../../collections/Meetings';
import StageCollection from '../../../collections/Stages';
import StageMessagesCollection from '../../../collections/StageMessages';

let MeetingStore = Reflux.createStore({
    listenables: [MeetingActions],
    state: {
      totalTimeInterval: null,
      timeTotal: null
    },
    onCreateChatMessage: function(message, chatId) {
        Meteor.call("createChatMessage", message, chatId);
    },
    onCreateBotChatMessage: function(stageKey, chatId) {
      // TODO select language?
      var currentLanguageKey = TAPi18n.getLanguage();
      var messageText = StageMessagesCollection.find({language_key: currentLanguageKey, stage: stageKey}).fetch()[0].message;

      var message = {
        userId: "chatBot",
  			userName: "chatBot",
  			text: messageText,
        isBotMessage : true
  		};

      Meteor.call("createChatMessage", message, chatId);
    },
    onUpdateMeetingStageAndSetStageActive: function(meeting, newStage) {
      var currentStageDuration = StageCollection.find({stage_id: newStage}).fetch()[0].duration;
      var currentStageEndtime = Date.parse(new Date()) + (currentStageDuration*1000);

      Meteor.call("updateMeetingStageAndSetStageActive", meeting._id, newStage, currentStageEndtime);
    },
    onPlayMeeting: function(meeting) {
      if(meeting.active_stage_id == 0) {
        this.onUpdateMeetingStageAndSetStageActive(meeting, 1);
      } else {
        var currentStageEndtime = Date.parse(new Date()) + (meeting.current_stage_time_remaining*1000);
        Meteor.call("updateMeetingStatusWithTimeRemaining", meeting._id, 1, null, currentStageEndtime);
      }
      Meteor.call("startTotalTimeInterval", meeting._id);
    },
    onPauseMeeting: function(meetingId) {
      MeetingTimeActions.pauseTimer(meetingId);
      Meteor.call("stopTotalTimeInterval", meetingId);
    },
    onUpdateMeetingStatusWithTimeRemaining: function(meetingId, statusCode, currentStageTimeRemaining, endtime) {
      Meteor.call("updateMeetingStatusWithTimeRemaining", meetingId, statusCode, currentStageTimeRemaining, endtime)
    },
    onSetEtherpadCookie: function(meetingId) {
      var meeting = MeetingCollection.findOne({_id: meetingId}, {fields: {etherpad_group: 1}});
      var validUntil = new Date();
      validUntil.setDate(validUntil.getDate()+1);
      Meteor.call("createPadSession", meeting.etherpad_group, Meteor.user().profile.authorID, validUntil.getTime(), function(error, result) {
        if(error) {
          console.log(error);
        } else {
          if(result) {
            Cookies.set("sessionID", result, { expires: 1, path: "/"});
              var iframe = document.getElementById('etherpadEditorFullscreen');
              iframe.src = iframe.src;
          } else {
            console.log(result);
          }
        }
      });
    }
});

export default MeetingStore;
