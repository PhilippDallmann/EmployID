import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import StageMessagesCollection from './stageMessages';

Meteor.methods({
  /**
   * @summary Updates a stagemessage
   * @param {Number} stage - Number representation of the stage
   * @param {String} languageKey - represents the language of the message
   * @param {String} message - value of the message
   * @locus Method
   * */
  updateStageMessage(stage, languageKey, message) {
    check(stage, Number);
    check(languageKey, String);
    check(message, String);
    StageMessagesCollection.update({ stage, language_key: languageKey }, {
      $set: { message },
    });
  },
});
