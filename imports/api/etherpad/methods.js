import {Meteor} from 'meteor/meteor';
import MeetingCollection from '../meetings/meetings';

var ENDPOINT = Meteor.settings.private.etherpad_endpoint;
var APIKEY = Meteor.settings.private.etherpad_apikey;

Meteor.methods({
  createEtherpadGroup: function(meetingId) {
    HTTP.post(ENDPOINT + "/createGroup", {
      data: {
        "apikey": APIKEY
      }
    }, function(error, response) {
      if(error) {
        console.log(error);
      } else {
        MeetingCollection.update(meetingId, {
          $set: {
            etherpad_group: response.data.data.groupID
          }
        });
        Meteor.call("createGroupPad", meetingId);
      }
    });

  },
  createGroupPad: function(meetingId) {
    var meeting = MeetingCollection.findOne(meetingId, {fields: {etherpad_group: 1}});

    HTTP.post(ENDPOINT + "/createGroupPad", {
      data: {
        "apikey": APIKEY,
        "groupID": meeting.etherpad_group,
        "padName": meetingId
      }
    }, function(error, response) {
      if(error) {
        console.log(error);
      } else {
        MeetingCollection.update(meetingId, {
          $set: {
            result_group_pad: response.data.data.padID
          }
        });
      }
    });
  },
  createEtherpadAuthor: function(user) {
    var response = HTTP.post(ENDPOINT + "/createAuthorIfNotExistsFor", {
      data: {
        "apikey": APIKEY,
        "name": user.username,
        "authorMapper": user._id
      }
    });
    return response.data.data.authorID ? response.data.data.authorID : response;
  },
  createPadSession: function(etherpadGroupId, authorId, validUntil) {
    var response = HTTP.post(ENDPOINT + "/createSession", {
      data: {
        "apikey": APIKEY,
        "groupID": etherpadGroupId,
        "authorID": authorId,
        "validUntil": validUntil
      }
    });
    return response.data.data&&response.data.data.sessionID ? response.data.data.sessionID : response;
  }
});
