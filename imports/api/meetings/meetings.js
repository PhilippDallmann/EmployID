/* global Mongo, SimpleSchema */

/**
 * @summary initializes the Message Collection
 * @param topic - topic of meeting
 * @param description - description of meeting
 * @param start_date - date of meeting
 * @param owner - creator of meeting
 * @param group - group the meeting belongs to
 * @param client - the one who wants to talk about a problem
 * @param facilitator - the one who guids the meeting
 * @param recorder - the one who takes notes in the meeting
 * @param chat - id of the chat that belongs to the meeting
 * @param result_id - id of the result that belongs to the meeting
 * @param active_stage_id - id of the current stage
 * @param status_code - 1 for meeting is active 0 for not active
 * @param current_stage-Time_remaining - remaining time in current stage
 * @param current_stage_endtime - endtime of current stage
 * @param time_total - total time of the meeting beeing active
 * @type {SimpleSchema}
 * @locus Collection
 * */

const MeetingCollection = new Mongo.Collection('Meetings');

const MeetingSchema = new SimpleSchema({
  topic: {
    type: String,
  },
  description: {
    type: String,
  },
  start_date: {
    type: String,
  },
  owner: {
    type: String,
  },
  group: {
    type: String,
  },
  client: {
    type: String,
  },
  facilitator: {
    type: String,
  },
  recorder: {
    type: String,
  },
  chat: {
    type: String,
  },
  result_id: {
    type: String,
  },
  active_stage_id: {
    type: Number,
  },
  status_code: {
    type: Number,
  },
  current_stage_time_remaining: {
    type: String,
    optional: true,
  },
  current_stage_endtime: {
    type: String,
    optional: true,
  },
  time_total: {
    type: Number,
  },
});

MeetingCollection.attachSchema(MeetingSchema);

MeetingCollection.allow({
  insert(userId) {
    return userId;
  },
  update(userId, doc) {
    // can only change your own documents and client can change it
    return doc.owner === userId || doc.client === userId;
  },
  remove(userId, doc) {
    // can only remove your own documents and client can
    return doc.owner === userId || doc.client === userId;
  },
});

export default MeetingCollection;
