
if (Meteor.isServer) {
  Meteor.publish('userSpecificMeetings', function (currentUserId) {
    this.autorun(function (computation) {
      var userGroups = _.uniq(GroupCollection.find({ 'users': currentUserId })
        .fetch().map(function (g) {
          return g._id;
        }), true);
      return MeetingCollection.find({ 'group': { $in: userGroups } });
    });
  });
  Meteor.publish('currentMeeting', function (meetingId) {
    return MeetingCollection.find({_id: meetingId});
  });
}