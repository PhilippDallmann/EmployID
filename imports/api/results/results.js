/**
 * @summary initializes the Result Collection
 *          text: value of the result
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ResultCollection = new Mongo.Collection("Results");

let ChatMessageSchema = new SimpleSchema({
  "text": {
    type: String,
    optional: true
  }
});

ResultCollection.attachSchema(ChatMessageSchema);

ResultCollection.allow({
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {
    return userId;
  },
  remove: function (userId, doc) {
    return userId;
  }
});

export default ResultCollection;