import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import MeetingCollection from '../../meetings/meetings';
import ResultCollection from '../../results/results';

if (Meteor.isServer) {
  /**
   * @summary Publishes the result belonging to a meeting
   * @param {String} meetingId - id of the meeting
   * @locus Publication
   * */
  Meteor.publish('currentResult', function currentResult(meetingId) {
    check(meetingId, String);
    this.autorun(() => {
      const meeting = MeetingCollection.findOne(meetingId, { fields: { result_id: 1 } });
      return ResultCollection.find(meeting.result_id);
    });
  });
}
