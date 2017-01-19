
if (Meteor.isServer) {
  Meteor.publish('groupsOfCurrentUser', function () {
    return GroupCollection.find({users: this.userId});
  });
}