const Reflux = require('reflux');

const MeetingTimeActions = Reflux.createActions([
  'setStartDate',
  'setInterval',
  'startTimer',
  'pauseTimer',
  'meetingDataHasChanged',
  'killTimer',
]);

module.exports = MeetingTimeActions;
