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
