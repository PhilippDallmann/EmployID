/* global Mongo, SimpleSchema */

/**
 * @summary initializes the Notification Collection
 * @param text - text of notification
 * @param type - defines whether it's a Invitation or a Creation of a meeting
 * @param owner - contains username and id of creator
 * @param group_id - id of the group the notification belongs to
 * @param timestamp - timestamp of creation
 * @param needs_confirmation - group invitations need confirmation of the invited users
 * @param confirmed_by - array of users that confirmed the group invitation
 * @type {SimpleSchema}
 * @locus Collection
 * */

const NotificationCollection = new Mongo.Collection('Notifications');

const NotificationSchema = new SimpleSchema({
  text: {
    type: String,
  },
  type: {
    type: String,
    allowedValues: ['groupInvitation', 'meetingCreation'],
  },
  owner: {
    type: Object,
  },
  'owner._id': {
    type: String,
  },
  'owner.username': {
    type: String,
  },
  group_id: {
    type: String,
  },
  timestamp: {
    type: String,
  },
  needs_confirmation: {
    type: Boolean,
  },
  confirmed_by: {
    type: [String],
    optional: true,
  },
});

NotificationCollection.attachSchema(NotificationSchema);

NotificationCollection.allow({
  insert() {
    return false;
  },
  update() {
    return false;
  },
  remove() {
    return false;
  },
});


export default NotificationCollection;
