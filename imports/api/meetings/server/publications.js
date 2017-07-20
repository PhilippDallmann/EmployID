import { Meteor } from 'meteor/meteor';
import GroupCollection from '../../groups/groups'
import MeetingCollection from '../meetings'

if (Meteor.isServer) {
  /**
   * @summary Publishes all meetings a user is part of
   * @param {String} currentUserId - id of the current user
   * @locus Publication
   * */
  Meteor.publish('userSpecificMeetings', function (currentUserId) {
    this.autorun(function (computation) {
      var userGroups = _.uniq(GroupCollection.find({ 'users': currentUserId })
        .fetch().map(function (g) {
          return g._id;
        }), true);
      return MeetingCollection.find({ 'group': { $in: userGroups } });
    });
  });
  /**
   * @summary Publishes a meeting
   * @param {String} meetingId - id of the meeting
   * @locus Publication
   * */
  Meteor.publish('currentMeeting', function (meetingId) {
    return MeetingCollection.find({_id: meetingId});
  });
  /**
   * @summary Publishes the participants of a meeting
   * @param {String} meetingId - id of the meeting
   * @locus Publication
   * */
  Meteor.publish('meetingParticipants', function (meetingId) {
    this.autorun(function (computation) {
      var meeting = MeetingCollection.findOne(meetingId, {fields: {group: 1}});
      var group = GroupCollection.findOne(meeting.group, {fields: {users: 1}});

      return Meteor.users.find({_id: {$in: group.users}}, {fields: {id: 1, profile: 1, username: 1, status: 1}});
    });
  });
}