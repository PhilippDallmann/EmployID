import { Meteor } from 'meteor/meteor';
import MeetingCollection from '../../meetings/meetings';
import ChatCollection from '../../chats/chats';
import ChatMessageCollection from '../chatMessages';

if (Meteor.isServer) {
  Meteor.publish('currentChatMessages', function (meetingId) {
    this.autorun(function (computation) {
      var meeting = MeetingCollection.findOne(meetingId, {fields: {chat: 1}});
      var chat = ChatCollection.findOne(meeting.chat, {fields: {chat_messages: 1}});

      return ChatMessageCollection.find({_id: {$in: chat.chat_messages}}, {'sort': ['timestamp', 'asc']});
    });
  });
}