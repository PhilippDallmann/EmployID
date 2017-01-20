import {Meteor} from 'meteor/meteor';
import MeetingCollection from './meetings';
import ChatCollection from '../chats/chats';

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
    "createMeeting": function(meeting, languageKey) {
      var loggedInUser = Meteor.user();
      if(!loggedInUser || !Roles.userIsInRole(loggedInUser, ["user"])){
        throw new Meteor.Error(403, "Access denied");
      } else {
        var chatId = ChatCollection.insert({
          chat_messages: []
        });
        var meetingId = MeetingCollection.insert({
          topic: meeting.topic,
          description: meeting.description,
          start_date: meeting.start_date,
          owner: meeting.owner,
          group: meeting.group,
          client: meeting.client,
          facilitator: meeting.facilitator,
          chat: chatId,
          etherpad_group: null,
          result_group_pad: null,
          active_stage_id: 0,
          status_code: 0,
          current_stage_time_remaining: 0,
          time_total: 0
        });
        Meteor.call("createEtherpadGroup", meetingId);
        Meteor.call("createNotification", {
          text: __("notifications.meetingCreation", {}, languageKey) + meeting.topic,
          type: "meetingCreation",
          owner: {_id: Meteor.userId(), username: Meteor.user().username},
          groupId: meeting.group,
          timestamp: new Date().toISOString(),
          needsConfirmation: false
        });
      }
    },
    "editMeeting": function(meeting) {
      //TODO: detect changes and only update changed values?
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
    "deleteMeeting": function(meeting) {
      if(meeting.owner!==Meteor.userId()) {
        throw new Meteor.Error(500, "Access denied");
      } else {
        MeetingCollection.remove(meeting._id);
      }
    },
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
    "updateMeetingStatusWithTimeRemaining" : function(meetingId, statusCode, currentStageTimeRemaining, currentStageEndtime) {
      MeetingCollection.update(meetingId, {
        $set: {
          status_code: statusCode,
          current_stage_time_remaining: currentStageTimeRemaining,
          current_stage_endtime: currentStageEndtime
        }
      });
    },
    "updateMeetingTimeTotal" : function(meetingId, newTime) {
      MeetingCollection.update(meetingId, {
        $inc: {
          time_total: 1
        }
      });
    },
    startTotalTimeInterval : function(meetingId) {
      var intervalId = Meteor.setInterval(function() {
        MeetingCollection.update(meetingId, {
          $inc: {
            time_total: 1
          }
        });
      }, 60000);
      var intervalObj = {
        meetingId: meetingId,
        intervalId: intervalId
      };
      intervalArray.push(intervalObj);
    },
    "stopTotalTimeInterval" : function(meetingId) {
      var intervalObj = intervalArray.filter(function(obj) {
        return obj.meetingId === meetingId;
      })
      Meteor.clearInterval(intervalObj[0].intervalId);
      removeByAttr(intervalArray, 'meetingId', meetingId);
    }
  });

}

