/* global Roles */

import { Meteor } from 'meteor/meteor';
import { TAPi18n } from 'meteor/tap:i18n';
import { check, Match } from 'meteor/check';

import MeetingCollection from './meetings';
import ChatCollection from '../chats/chats';
import ResultCollection from '../results/results';

if (Meteor.isServer) {
  Meteor.methods({
    /**
     * @summary Creates a meeting
     * @isMethod true
     * @param {Object} meeting - contains all necessary information
     *                            (topic, description, start_date,owner,group,client,
     *                            result_id,facilitator,chat, active_stage_id,
     *                            status_code,current_stage_time_remaining, time_total)
     * @param {String} languageKey - used to create a notification in the users language
     * @locus Method
     * */
    createMeeting(meeting, languageKey) {
      check(meeting, {
        topic: String,
        description: String,
        start_date: String,
        owner: String,
        group: String,
        client: String,
        facilitator: String,
      });
      check(languageKey, String);
      const loggedInUser = Meteor.user();
      if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['user'])) {
        throw new Meteor.Error(403, 'Access denied');
      } else {
        const chatId = ChatCollection.insert({
          chat_messages: [],
        });
        const resultId = ResultCollection.insert({
          text: 'Insert your results!',
          sharing: 'self',
        });
        MeetingCollection.insert({
          topic: meeting.topic,
          description: meeting.description,
          start_date: meeting.start_date,
          owner: meeting.owner,
          group: meeting.group,
          client: meeting.client,
          result_id: resultId,
          facilitator: meeting.facilitator,
          recorder: meeting.facilitator,
          chat: chatId,
          active_stage_id: 0,
          status_code: 0,
          current_stage_time_remaining: 0,
          time_total: 0,
        });
        Meteor.call('createNotification', {
          text: TAPi18n.__('notifications.meetingCreation', {}, languageKey) + meeting.topic,
          type: 'meetingCreation',
          owner: { _id: Meteor.userId(), username: Meteor.user().username },
          groupId: meeting.group,
          timestamp: new Date().toISOString(),
          needsConfirmation: false,
        });
      }
    },
    /**
     * @summary Saves changes made to a meeting
     * @isMethod true
     * @param {Object} meeting - contains the editable fields
     *                          (topic, description, start_date, group, client, facilitator)
     * @locus Method
     * */
    editMeeting(meeting) {
      check(meeting, {
        topic: String,
        description: String,
        start_date: String,
        group: String,
        client: String,
        facilitator: String,
        recorder: String,
      });
      MeetingCollection.update(meeting._id, {
        $set: {
          topic: meeting.topic,
          description: meeting.description,
          start_date: meeting.start_date,
          group: meeting.group,
          client: meeting.client,
          facilitator: meeting.facilitator,
          recorder: meeting.facilitator,
        },
      }, (err, result) => result);
    },
    /**
     * @summary Deletes a meeting
     * @isMethod true
     * @param {Object} meeting - contains the information about the meeting
     * @locus Method
     * */
    deleteMeeting(meeting) {
      check(meeting, {
        owner: String,
        _id: String,
      });
      if (meeting.owner !== Meteor.userId()) {
        throw new Meteor.Error(500, 'Access denied');
      } else {
        MeetingCollection.remove(meeting._id);
      }
    },
    /**
     * @summary changes the active stage of a meeting
     * @isMethod true
     * @param {String} meetingId - id of the meeting
     * @param {Number} newStage - number representation of the new stage
     * @param {Number} currentStageEndTime - remaining time in stage in seconds
     * @locus Method
     * */
    updateMeetingStageAndSetStageActive(meetingId, newStage, currentStageEndTime) {
      check(meetingId, String);
      check(newStage, Number);
      check(currentStageEndTime, Number);
      MeetingCollection.update(meetingId, {
        $set: {
          status_code: 1,
          active_stage_id: newStage,
          current_stage_time_remaining: null,
          current_stage_endtime: currentStageEndTime,
        },
      });
    },
    /**
     * @summary change the status of a meetingstage and set the remaining time
     * @isMethod true
     * @param {String} meetingId - ID of  the meeting
     * @param {Number} statusCode - 0 for inactive 1 for active
     * @param {Number} timeRemaining - remaining time in stage
     * @param {Number} endTime - endtime
     * @locus Method
     * */
    updateMeetingStatusWithTimeRemaining(meetingId, statusCode, timeRemaining, endTime) {
      check(meetingId, String);
      check(statusCode, Number);
      check(timeRemaining, Match.Maybe(Number));
      check(endTime, Match.Maybe(Number));
      MeetingCollection.update(meetingId, {
        $set: {
          status_code: statusCode,
          current_stage_time_remaining: timeRemaining,
          current_stage_endtime: endTime,
        },
      });
    },
    /**
     * @summary change the recorder of the meeting
     * @isMethod true
     * @param {String} meetingId - id of meeting
     * @param {String} userId - id of the new recorder
     * */
    updateRecorder(meetingId, userId) {
      check(meetingId, String);
      check(userId, String);
      MeetingCollection.update(meetingId, {
        $set: {
          recorder: userId,
        },
      });
    },
    /**
     * @summary Update specific fields of a meeting
     * @isMethod true
     * @param {String} meetingId - ID of the meeting
     * @param {Array} fieldValueArray - contains the fields to be changed and the corresponding values
     * @locus Method
     * */
    updateMeeting(meetingId, fieldValueArray) {
      check(meetingId, String);
      check(fieldValueArray, Array);
      const updateQuery = {};
      fieldValueArray.forEach((element) => {
        updateQuery[element[0]] = element[1];
      });
      MeetingCollection.update(meetingId,
        { $set: updateQuery },
      );
    },
  });
}
