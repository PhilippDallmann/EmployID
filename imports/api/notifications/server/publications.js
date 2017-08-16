import { Meteor } from 'meteor/meteor';
import GroupCollection from '../../groups/groups';
import NotificationCollection from '../notifications';

if (Meteor.isServer) {
  /**
   * @summary Publishes all notifications of the current user
   * @param {String} currentUserId - id of the current user
   * @locus Publication
   * */
  Meteor.publish('notificationsOfCurrentUser', function (currentUserId) {
    this.autorun(() => {
      const userGroups = _.uniq(GroupCollection.find({ users: currentUserId })
        .fetch().map(g => g._id), true);
      return NotificationCollection.find({ group_id: { $in: userGroups } });
    });
  });
}
