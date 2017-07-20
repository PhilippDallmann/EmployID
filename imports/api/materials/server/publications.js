import { Meteor } from 'meteor/meteor';
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
  Meteor.publish('materials', function (meetingId, languageKey) {
    this.autorun(function (computation) {
      var meeting = MeetingCollection.findOne(meetingId, {fields: {client: 1, facilitator: 1}});
      if (meeting.facilitator == this.userId) {
        return MaterialCollection.find({role: 'facilitator', language_key: languageKey});
      }else if (meeting.client == this.userId) {
        return MaterialCollection.find({role: 'client', language_key: languageKey});
      } else {
        return MaterialCollection.find({role: 'participant', language_key: languageKey});
      }
    });
  });
  /**
   * @summary Publishes all materials
   * @locus Publication
   * */
  Meteor.publish('allMaterials', function() {
    return MaterialCollection.find({});
  });
  /**
   * @summary Publishes the materials beloning to a stage, role and language
   * @param {String} stageId - id of the stage
   * @param {String} roleId - id of the role
   * @param {String} languageKey - represents the wanted language
   * @locus Publication
   * */
  Meteor.publish('editorMaterial', function (stageId, roleId, languageKey) {
    this.autorun(function (computation) {
      var stage = StageCollection.findOne({stage_id: stageId}, {fields: {material: 1}});

      return MaterialCollection.find({_id: {$in: stage.material}, role: roleId, language_key: languageKey}, {sort: {position: 1}});
    });
  });
}