import { Meteor } from 'meteor/meteor';
import StageCollection from '../stages';

if (Meteor.isServer) {
  /**
   * @summary Publishes all Stages
   * @locus Publication
   * */
  Meteor.publish('stages', () => StageCollection.find());
}
