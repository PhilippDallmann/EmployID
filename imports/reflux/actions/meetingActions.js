let Reflux = require("reflux");

let MeetingActions = Reflux.createActions([
    "createChatMessage",
    "createBotChatMessage",
    "updateMeetingStageAndSetStageActive",
    "playMeeting",
    "pauseMeeting",
    "updateMeetingStatusWithTimeRemaining",
    "setEtherpadCookie"
]);

export default MeetingActions;
