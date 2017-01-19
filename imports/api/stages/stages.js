const StageCollection = new Mongo.Collection("Stages");

let StageSchema = new SimpleSchema({
  "stage_id": {
    type: Number
  },
  "description": {
    type: String
  },
  "material": {
    type: [String]
  },
  "duration": {
    type: Number
  }
});

StageCollection.attachSchema(StageSchema);

StageCollection.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  },
  remove: function (userId, doc) {
    return false;
  }
});


export default StageCollection;
