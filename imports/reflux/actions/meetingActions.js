const Reflux = require('reflux');

const MeetingActions = Reflux.createActions([
  'createChatMessage',
  'createBotChatMessage',
  'updateMeetingStageAndSetStageActive',
  'playMeeting',
  'pauseMeeting',
  'updateMeetingStatusWithTimeRemaining',
]);

export default MeetingActions;
