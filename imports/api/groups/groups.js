const GroupCollection = new Mongo.Collection("Groups");

let GroupSchema = new SimpleSchema({
  "name": {
    type: String
  },
  "description": {
    type: String,
    optional: true
  },
  "users": {
    type: [String]
  },
  "owner": {
    type: String
  }
});

GroupCollection.attachSchema(GroupSchema);

GroupCollection.allow({
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


export default GroupCollection;
