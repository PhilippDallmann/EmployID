import {Meteor} from 'meteor/meteor';
import {TAPi18n} from 'meteor/tap:i18n';

import MeetingCollection from './meetings';
import ChatCollection from '../chats/chats';
import ResultCollection from '../results/results';

if(Meteor.isServer) {
  let intervalArray = [];
  var removeByAttr = function(arr, attr, value){
    var i = arr.length;
    while(i--){
      if( arr[i]
        && arr[i].hasOwnProperty(attr)
        && (arguments.length > 2 && arr[i][attr] === value ) ){

        arr.splice(i,1);

      }
    }
    return arr;
  }

  Meteor.methods({
    /**
     * Creates a meeting
     * @param {object} meeting - contains all necessary information (topic, description, start_date,owner,group,client,
     *                            result_id,facilitator,chat, active_stage_id,status_code,current_stage_time_remaining, time_total)
     * @param {string} languageKey - used to create a notification in the users language
     * */
    "createMeeting": function(meeting, languageKey) {
      var loggedInUser = Meteor.user();
      if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ["user"])){
        throw new Meteor.Error(403, "Access denied");
      } else {
        var chatId = ChatCollection.insert({
          chat_messages: []
        });
        var resultId = ResultCollection.insert({
          text: "Insert your results!"
        });
        var meetingId = MeetingCollection.insert({
          topic: meeting.topic,
          description: meeting.description,
          start_date: meeting.start_date,
          owner: meeting.owner,
          group: meeting.group,
          client: meeting.client,
          result_id: resultId,
          facilitator: meeting.facilitator,
          chat: chatId,
          active_stage_id: 0,
          status_code: 0,
          current_stage_time_remaining: 0,
          time_total: 0
        });
        Meteor.call("createNotification", {
          text: TAPi18n.__("notifications.meetingCreation", {}, languageKey) + meeting.topic,
          type: "meetingCreation",
          owner: {_id: Meteor.userId(), username: Meteor.user().username},
          groupId: meeting.group,
          timestamp: new Date().toISOString(),
          needsConfirmation: false
        });
      }
    },
    /**
     * Saves changes made to a meeting
     * @param {object} - contains the editable fields (topic, description, start_date, group, client, facilitator)
     * */
    "editMeeting": function(meeting) {
      MeetingCollection.update(meeting._id, {
        $set: {
          topic: meeting.topic,
          description: meeting.description,
          start_date: meeting.start_date,
          group: meeting.group,
          client: meeting.client,
          facilitator: meeting.facilitator
        },
      }, function(err, result) {
        return result;
      });
    },
    /**
     * Deletes a meeting
     * @param {object} meeting - contains the information about the meeting
     * */
    "deleteMeeting": function(meeting) {
      if(meeting.owner!==Meteor.userId()) {
        throw new Meteor.Error(500, "Access denied");
      } else {
        MeetingCollection.remove(meeting._id);
      }
    },
    /**
     *changes the active stage of a meeting
     * @param {string} meetingId - id of the meeting
     * @param {number} newStage - number representation of the new stage
     * @param {number} currentStageEndTime - remaining time in stage in seconds
     * */
    "updateMeetingStageAndSetStageActive" : function(meetingId, newStage, currentStageEndtime) {
      MeetingCollection.update(meetingId, {
        $set: {
          status_code: 1,
          active_stage_id: newStage,
          current_stage_time_remaining: null,
          current_stage_endtime: currentStageEndtime
        }
      });
    },
    /**
     *change the status of a meetingstage and set the remaining time
     * @param {string} meetingId - ID of  the meeting
     * @param {number} statusCode - 0 for inactive 1 for active
     * @param {number} currentStageTimeRemaining - remaining time in stage
     * */
    "updateMeetingStatusWithTimeRemaining" : function(meetingId, statusCode, currentStageTimeRemaining, currentStageEndtime) {
      MeetingCollection.update(meetingId, {
        $set: {
          status_code: statusCode,
          current_stage_time_remaining: currentStageTimeRemaining,
          current_stage_endtime: currentStageEndtime
        }
      });
    }
  });
}