import {Meteor} from 'meteor/meteor';
import StageMessagesCollection from './stageMessages';

Meteor.methods({
  /**
   * @summary Updates a stagemessage
   * @param {Number} stage - Number representation of the stage
   * @param {String} languageKey - represents the language of the message
   * @param {String} message - value of the message
   * @locus Method
   * */
  "updateStageMessage": function(stage, languageKey, message) {
    StageMessagesCollection.update({stage: stage, language_key: languageKey}, {
      $set: {message: message}
    });
  }
});
