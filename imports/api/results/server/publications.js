import { Meteor } from 'meteor/meteor';
import MeetingCollection from '../../meetings/meetings';
import ResultCollection from '../../results/results';

if (Meteor.isServer) {
  Meteor.publish('currentResult', function (meetingId) {
    this.autorun(function (computation) {
      var meeting = MeetingCollection.findOne(meetingId, {fields: {result_id: 1}});
      return ResultCollection.find(meeting.result_id);
    });
  });
}