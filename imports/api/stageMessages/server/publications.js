if (Meteor.isServer) {
  Meteor.publish('stageMessages', function () {
    var result = StageMessagesCollection.find();
    return result;
  });
}