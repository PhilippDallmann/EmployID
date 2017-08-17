import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import NotificationCollection from './notifications';

Meteor.methods({
  /**
   * @summary Creates a new notification
   * @isMethod true
   * @param {Object} notification - Contains all necessary information (text, type, owner, groupId, timestamp, needsConformation, conformedBy)
   * @locus Method
   * */
  createNotification(notification) {
    check(notification, {
      text: String,
      type: String,
      owner: {
        _id: String,
        username: String,
      },
      groupId: String,
      timestamp: String,
      needsConfirmation: Boolean,
      confirmedBy: Array,
    });
    NotificationCollection.insert({
      text: notification.text,
      type: notification.type,
      owner: notification.owner,
      group_id: notification.groupId,
      timestamp: notification.timestamp,
      needs_confirmation: notification.needsConfirmation,
      confirmed_by: notification.confirmedBy,
    });
  },
  /**
   * @summary Adds a user to the array of confirmed users in a notification
   * @isMethod true
   * @param {String} notificationId - ID of the notification that gets updated
   * @param {String} userId -  ID of the user that confirmed
   * @locus Method
   * */
  addConfirmation(notificationId, userId) {
    check(notificationId, String);
    check(userId, String);
    NotificationCollection.update(notificationId, {
      $addToSet: { confirmed_by: userId },
    });
  },
});
