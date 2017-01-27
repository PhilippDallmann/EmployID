let Reflux = require('reflux');

let MeetingTimeActions = Reflux.createActions([
	'setStartDate',
	'setInterval',
	'startTimer',
	'pauseTimer',
	'meetingDataHasChanged',
	'killTimer'
]);

module.exports = MeetingTimeActions;
