import { Meteor } from 'meteor/meteor';
import MeetingCollection from '../../meetings/meetings';
import MaterialCollection from '../materials';
import StageCollection from '../../stages/stages';

if (Meteor.isServer) {
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
  Meteor.publish('allMaterials', function() {
    var result = MaterialCollection.find({});
    return result;
  });
  Meteor.publish('editorMaterial', function (stageId, roleId, languageKey) {
    this.autorun(function (computation) {
      var stage = StageCollection.findOne({stage_id: stageId}, {fields: {material: 1}});

      return MaterialCollection.find({_id: {$in: stage.material}, role: roleId, language_key: languageKey}, {sort: {position: 1}});
    });
  });
}