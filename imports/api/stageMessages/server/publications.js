import { Meteor } from 'meteor/meteor';
import StageMessagesCollection from '../../stageMessages/stageMessages';

if (Meteor.isServer) {
  /**
   * @summary Publishes all StageMessages
   * @locus Publication
   * */
  Meteor.publish('stageMessages', () => StageMessagesCollection.find());
}
