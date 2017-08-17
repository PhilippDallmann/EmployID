import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MeetingCollection from '../../meetings/meetings';
import MaterialCollection from '../materials';
import StageCollection from '../../stages/stages';

if (Meteor.isServer) {
  /**
   * @summary Publishes role specific materials in the wanted language
   * @param {String} meetingId - id of the meeting used to look up the role of the current user
   * @param {String} languageKey - represents the wanted language
   * @locus Publication
   * */
  Meteor.publish('materials', function materials(meetingId, languageKey) {
    check(meetingId, String);
    check(languageKey, String);
    this.autorun(() => {
      const meeting = MeetingCollection.findOne(meetingId, {
        fields: { client: 1, facilitator: 1 },
      });
      if (meeting.facilitator === this.userId) {
        return MaterialCollection.find({ role: 'facilitator', language_key: languageKey });
      } else if (meeting.client === this.userId) {
        return MaterialCollection.find({ role: 'client', language_key: languageKey });
      }
      return MaterialCollection.find({ role: 'participant', language_key: languageKey });
    });
  });
  /**
   * @summary Publishes all materials
   * @locus Publication
   * */
  Meteor.publish('allMaterials', () => MaterialCollection.find({}));
  /**
   * @summary Publishes the materials belonging to a stage, role and language
   * @param {String} stageId - id of the stage
   * @param {String} roleId - id of the role
   * @param {String} languageKey - represents the wanted language
   * @locus Publication
   * */
  Meteor.publish('editorMaterial', function editorMaterial(stageId, roleId, languageKey) {
    check(stageId, Number);
    check(roleId, String);
    check(languageKey, String);
    this.autorun(() => {
      const stage = StageCollection.findOne({ stage_id: stageId }, { fields: { material: 1 } });

      return MaterialCollection.find(
        { _id: { $in: stage.material }, role: roleId, language_key: languageKey },
        { sort: { position: 1 } },
      );
    });
  });
}
