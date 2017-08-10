/**
 * @summary initializes the Result Collection
 * @param text - value of the result
 * @param sharing - sharing setting: can be shared publicly or with group only (allowed values: group, public)
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ResultCollection = new Mongo.Collection("Results");

let ChatMessageSchema = new SimpleSchema({
  'text': {
    type: String,
    optional: true
  },
  'sharing': {
    type: String,
    optional: true,
    allowedValues: ['self', 'group', 'public']
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