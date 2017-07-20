/**
 * @summary initializes the Stage Collection
 * @param stage_id - number reprensentation of stage
 * @param description - description of stage
 * @param material - array of all materials belonging to this stage
 * @param duration - number of seconds the stage lasts
 * @type {SimpleSchema}
 * @locus Collection
 * */

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
