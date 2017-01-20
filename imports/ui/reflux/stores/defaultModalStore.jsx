import {Meteor} from 'meteor/meteor';

let Reflux = require("reflux");

import DefaultModal from "../../components/modals/defaultModal";
import DefaultModalActions from "../actions/defaultModalActions";

let DefaultModalStore = Reflux.createStore({
    listenables: [DefaultModalActions],
    state: {
        defaultModal: null
    },
    onShowError: function(err) {
        if(this.state.defaultModal===null) {
            var newModal = ReactDOM.render(<DefaultModal />, document.getElementById("defaultModal"));
            newModal.open(__("defaultModal.error"), err.message, 'danger');
            this.state.defaultModal = newModal;
        } else {
            this.state.defaultModal.open(__("defaultModal.error"), err.message, 'danger');
        }
    },
    onShowWarning: function(msg) {
        if(this.state.defaultModal===null) {
            var newModal = ReactDOM.render(<DefaultModal />, document.getElementById("defaultModal"));
            newModal.open(__("defaultModal.warning"), msg, 'warning');
            this.state.defaultModal = newModal;
        } else {
            this.state.defaultModal.open(__("defaultModal.warning"), msg, 'warning');
        }
    },
    onShowInfo: function(title, bodyMessage) {
        if(this.state.defaultModal===null) {
            var newModal = ReactDOM.render(<DefaultModal />, document.getElementById("defaultModal"));
            newModal.open(title, bodyMessage, 'info');
            this.state.defaultModal = newModal;
        } else {
            this.state.defaultModal.open(title, bodyMessage, 'info');
        }
    }

});

export default DefaultModalStore;
