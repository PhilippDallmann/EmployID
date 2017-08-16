/* global Mongo, SimpleSchema, Roles */

/**
 * @summary initializes the Material Collection
 * @param text - text of material
 * @param language_key - language of material
 * @param role - material can belong to roles client, facilitator or participant
 * @param position - allows showing the materials in right order
 * @param is_heading - materials can be heading and are shown bold
 * @type {SimpleSchema}
 * @locus Collection
 * */

const MaterialCollection = new Mongo.Collection('Materials');

const MaterialSchema = new SimpleSchema({
  text: {
    type: String,
  },
  language_key: {
    type: String,
  },
  role: {
    type: String,
  },
  position: {
    type: Number,
  },
  is_heading: {
    type: Boolean,
  },
});

MaterialCollection.attachSchema(MaterialSchema);

MaterialCollection.allow({
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


export default MaterialCollection;
