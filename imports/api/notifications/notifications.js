const NotificationCollection = new Mongo.Collection("Notifications");

let NotificationSchema = new SimpleSchema({
  "text": {
    type: String
  },
  "type" : {
    type: String,
    allowedValues: ["groupInvitation", "meetingCreation"]
  },
  "owner": {
    type: Object
  },
  "owner._id": {
    type: String
  },
  "owner.username": {
    type: String
  },
  "group_id": {
    type: String
  },
  "timestamp": {
    type: String
  },
  "needs_confirmation": {
    type: Boolean
  },
  "confirmed_by": {
    type: [String],
    optional: true
  }
});

NotificationCollection.attachSchema(NotificationSchema);

NotificationCollection.allow({
  insert: function (userId, doc) {
    return false;
  },
  update: function (userId, doc, fields, modifier) {
    return false;
  },
  remove: function (userId, doc) {
    return false;
  }
});


export default NotificationCollection;