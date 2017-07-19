/**
 * @summary initializes the Message Collection
 *          topic: topic of meeting
 *          description: description of meeting
 *          start_date: date of meeting
 *          owner: creator of meeting
 *          group: group the meeting belongs to
 *          client: the one who wants to talk about a problem
 *          facilitator: the one who guids the meeting
 *          chat: id of the chat that belongs to the meeting
 *          result_id: id of the result that belongs to the meeting
 *          active_stage_id: id of the current stage
 *          status_code: 1 for meeting is active 0 for not active
 *          current_stage-Time_remaining: remaining time in current stage
 *          current_stage_endtime: endtime of current stage
 *          time_total: total time of the meeting beeing active
 * @type {SimpleSchema}
 * @locus Collection
 * */

const MeetingCollection = new Mongo.Collection("Meetings");

let MeetingSchema = new SimpleSchema({
  "topic": {
    type: String
  },
  "description": {
    type: String
  },
  "start_date": {
    type: String
  },
  "owner": {
    type: String
  },
  "group": {
    type: String
  },
  "client": {
    type: String
  },
  "facilitator": {
    type: String
  },
  "chat": {
    type: String
  },
  "result_id": {
    type: String
  },
  "active_stage_id": {
    type: Number
  },
  "status_code": {
    type: Number
  },
  "current_stage_time_remaining": {
    type: String,
    optional: true
  },
  "current_stage_endtime": {
    type: String,
    optional: true
  },
  "time_total": {
    type: Number
  }
});

MeetingCollection.attachSchema(MeetingSchema);

MeetingCollection.allow({
  insert: function (userId, doc) {
    return userId;
  },
  update: function (userId, doc, fields, modifier) {
    // can only change your own documents
    return doc.owner === userId;
  },
  remove: function (userId, doc) {
    // can only remove your own documents
    return doc.owner === userId;
  }
});

export default MeetingCollection;
