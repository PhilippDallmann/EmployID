import {Meteor} from 'meteor/meteor';
import NotificationCollection from './notifications';

Meteor.methods({
  /**
   *Creates a new notification
   * @param {object} notification - contaions all necessary information (text, type, owner, groupId, timestamp, needsConformation, conformedBy)
   * */
  "createNotification": function(notification) {
    NotificationCollection.insert({
      text: notification.text,
      type: notification.type,
      owner: notification.owner,
      group_id: notification.groupId,
      timestamp: notification.timestamp,
      needs_confirmation: notification.needsConfirmation,
      confirmed_by: notification.confirmedBy
    });
  },
  /**
   * Adds a user to the array of confirmed users in a notification
   * @param {string} notificationId - ID of the notification that gets updated
   * @param {string} userId -  ID of the user that confirmed
   * */
  "addConfirmation": function(notificationId, userId) {
    NotificationCollection.update(notificationId, {
      $addToSet: {confirmed_by: userId}
    });
  }
});