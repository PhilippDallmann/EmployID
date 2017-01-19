const MaterialCollection = new Mongo.Collection("Materials");

let MaterialSchema = new SimpleSchema({
  "text": {
    type: String
  },
  "language_key": {
    type: String
  },
  "role": {
    type: String
  },
  "position": {
    type: Number
  },
  "is_heading": {
    type: Boolean
  }
});

MaterialCollection.attachSchema(MaterialSchema);

MaterialCollection.allow({
  insert: function (userId, doc) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  },
  update: function (userId, doc, fields, modifier) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  },
  remove: function (userId, doc) {
    return Roles.userIsInRole(userId, ["admin", "editor"]);
  }
});


export default MaterialCollection;
