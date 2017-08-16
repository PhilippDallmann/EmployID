/* global Mongo, SimpleSchema */

/**
 * @summary initializes the Group Collection
 * @param name - name of the group
 * @param description - description of the group
 * @param users - array of all users in group
 * @param owner - creator of the group
 * @type {SimpleSchema}
 * @locus Collection
 * */

const GroupCollection = new Mongo.Collection('Groups');

const GroupSchema = new SimpleSchema({
  name: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  users: {
    type: [String],
  },
  owner: {
    type: String,
  },
});

GroupCollection.attachSchema(GroupSchema);

GroupCollection.allow({
  insert(userId) {
    return userId;
  },
  update(userId, doc) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove(userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  },
});


export default GroupCollection;
