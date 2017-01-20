import {Meteor} from 'meteor/meteor';
import NotificationCollection from './notifications';

Meteor.methods({
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
  "addConfirmation": function(notificationId, userId) {
    NotificationCollection.update(notificationId, {
      $addToSet: {confirmed_by: userId}
    });
  }
});