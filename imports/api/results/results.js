/* global Mongo, SimpleSchema */

/**
 * @summary initializes the Result Collection
 * @param text - value of the result
 * @param sharing - sharing setting: can be shared publicly or with group only
 *                                              (allowed values: group, public)
 * @type {SimpleSchema}
 * @locus Collection
 * */

const ResultCollection = new Mongo.Collection('Results');

const ChatMessageSchema = new SimpleSchema({
  text: {
    type: String,
    optional: true,
  },
  sharing: {
    type: String,
    optional: true,
    allowedValues: ['self', 'group', 'public'],
  },
});

ResultCollection.attachSchema(ChatMessageSchema);

ResultCollection.allow({
  insert(userId) {
    return userId;
  },
  update(userId) {
    return userId;
  },
  remove(userId) {
    return userId;
  },
});

export default ResultCollection;
