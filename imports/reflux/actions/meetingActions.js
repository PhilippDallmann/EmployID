let Reflux = require("reflux");

let MeetingActions = Reflux.createActions([
    "createChatMessage",
    "createBotChatMessage",
    "updateMeetingStageAndSetStageActive",
    "playMeeting",
    "pauseMeeting",
    "updateMeetingStatusWithTimeRemaining"
]);

export default MeetingActions;
