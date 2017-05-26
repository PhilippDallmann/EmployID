import {Meteor} from 'meteor/meteor';
import {Restivus} from 'meteor/nimble:restivus';

if(Meteor.isServer) {
  var Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true
  });
}