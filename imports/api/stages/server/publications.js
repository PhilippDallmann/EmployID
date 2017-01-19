if (Meteor.isServer) {
  Meteor.publish('stages', function () {
    var result = StageCollection.find();
    return result;
  });
}