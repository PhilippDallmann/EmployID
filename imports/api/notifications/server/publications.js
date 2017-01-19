if (Meteor.isServer) {
  Meteor.publish('notificationsOfCurrentUser', function(currentUserId) {
    this.autorun(function (computation) {
      var userGroups = _.uniq(GroupCollection.find({'users': currentUserId})
        .fetch().map(function (g) {
          return g._id;
        }), true);
      return NotificationCollection.find({'group_id': {$in: userGroups}});
    });
  });
}