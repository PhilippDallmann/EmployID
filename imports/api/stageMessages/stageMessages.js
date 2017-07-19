/**
 * @summary initializes the StageMessage Collection
 *          language_key: language of message
 *          stage: number representation of the stage the message belongs to
 *          message: text of message
 * @type {SimpleSchema}
 * @locus Collection
 * */

const StageMessagesCollection = new Mongo.Collection("StageMessages");

let StageMessagesSchema = new SimpleSchema({
  "language_key": {
    type: String
  },
  "stage": {
    type: Number
  },
  "message": {
    type: String
  }
});

StageMessagesCollection.attachSchema(StageMessagesSchema);

StageMessagesCollection.allow({
  insert: function (userId, doc) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  },
  remove: function (userId, doc) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  }
});

export default StageMessagesCollection;
