/* global Mongo, SimpleSchema, Roles */

/**
 * @summary initializes the StageMessage Collection
 * @param language_key - language of message
 * @param stage - number representation of the stage the message belongs to
 * @param message - text of message
 * @type {SimpleSchema}
 * @locus Collection
 * */

const StageMessagesCollection = new Mongo.Collection('StageMessages');

const StageMessagesSchema = new SimpleSchema({
  language_key: {
    type: String,
  },
  stage: {
    type: Number,
  },
  message: {
    type: String,
  },
});

StageMessagesCollection.attachSchema(StageMessagesSchema);

StageMessagesCollection.allow({
  insert(userId) {
    return Roles.userIsInRole(userId, ['admin', 'editor']);
  },
  update(userId) {
    return Roles.userIsInRole(userId, ['admin', 'editor']);
  },
  remove(userId) {
    return Roles.userIsInRole(userId, ['admin', 'editor']);
  },
});

export default StageMessagesCollection;
