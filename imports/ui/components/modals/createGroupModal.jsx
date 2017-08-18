import {Meteor} from 'meteor/meteor';
import React from 'react';
import {TAPi18n} from 'meteor/tap:i18n';
import swal from 'sweetalert2';

import HomeActions from "../../../reflux/actions/homeActions";
import t from 'tcomb-form';

let Modal = require("react-bootstrap").Modal;
let Button = require("react-bootstrap").Button;
let Input = require("react-bootstrap").Input;
let Row = require("react-bootstrap").Row;
let Col = require("react-bootstrap").Col;
let Panel = require("react-bootstrap").Panel;

const GroupSchema = t.struct({
  name: t.String,
  description: t.maybe(t.String),
  users: t.list(t.String)
});
let options = {
  fields: {
    name: {
      label: TAPi18n.__("createGroupModal.name")
    },
    description: {
      label: TAPi18n.__("createGroupModal.description")
    },
    users: {
      disableOrder: true,
      label: TAPi18n.__("createGroupModal.users"),
      attrs: {
        placeholder: TAPi18n.__("createGroupModal.userPlaceholder")
      }
    }
  },
  i18n: {
    add: TAPi18n.__("tcomb.add"),               // add button
    down: TAPi18n.__("tcomb.down"),                // move down button
    optional: TAPi18n.__("tcomb.optional"),   // suffix added to optional fields
    required: TAPi18n.__("tcomb.required"),               // suffix added to required fields
    remove: TAPi18n.__("tcomb.remove"),          // remove button
    up: TAPi18n.__("tcomb.up")                    // move up button
  }
}

let CreateGroupModal = React.createClass({
    getInitialState: function() {
      if(this.props.group!==null) {
  			return {
          show: false,
          isEditModal: true,
          value: {
            name: this.props.group.name,
            description: this.props.group.description,
            users: null
          }
  			};
  		} else {
  			return {
          show: false,
          isEditModal: false,
          value: {
            name: null,
            description: null,
            users: [Meteor.user().username]
          }
  			};
  		}
    },
    componentDidMount: function() {
      require("./createGroupModal.less");
      this.setValues(this.props);
    },
    componentWillReceiveProps: function(nextProps) {
      this.setValues(nextProps);
    },
    open: function() {
      this.setState({
          show: true
      });
    },
    close: function() {
      this.setState({
          show: false
      });
    },
    setValues: function(props) {
      var me = this;
      if(props.group!==null) {
        Meteor.call("getIdUsernameList", props.group.users, function(error,result) {
          if(error) {
            swal(error);
          } else{
            me.setState({
              isEditModal: true,
              value: {
                name: props.group.name,
                description: props.group.description,
                users: result
              }
            });
          }
        });
      } else {
        me.setState({
          isEditModal: false,
          value: {
            name: null,
            description: null,
            users: [Meteor.user().username]
          }
        });
      }
    },
    onChange: function(value, path) {
      if(this.refs.form.getComponent(path)) {
        this.refs.form.getComponent(path).validate();
      }
      this.setState({
        value: value
      });
    },
    save: function() {
      var validation = t.validate(this.state.value, GroupSchema);
      if(validation.isValid()) {
        if(this.state.isEditModal) {
          this.editGroup();
        } else {
          this.createGroup();
        }
      } else {
        this.refs.form.validate();
      }
    },
    createGroup: function() {
      var group = this.state.value;
      group.owner = Meteor.userId();
      HomeActions.createGroup(group);
    },
    editGroup: function() {
      var group = this.state.value;
      group._id = this.props.group._id;
      HomeActions.editGroup(group);
    },
    deleteGroup: function() {
      let me = this;
      swal({
        title: TAPi18n.__("swal.areYouSure"),
        text: TAPi18n.__("swal.deleteInfo"),
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: TAPi18n.__("swal.deleteConfirmation"),
        html: false
      }).then( function(){
        Meteor.call("deleteGroup", {_id: me.props.group._id, owner: me.props.group.owner}, function(error, result) {
          if(!error) {
            me.close();
          }
        });
      });
    },
    render: function() {
        return (
            <div>
                <Modal
                    show={this.state.show}
                    onHide={this.close}
                    container={this}
                    aria-labelledby="contained-modal-title"
                    >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">{this.state.isEditModal? TAPi18n.__("editGroupModal.title") : TAPi18n.__("createGroupModal.title")}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <t.form.Form 
                          ref="form" 
                          type={GroupSchema}
                          options={options}
                          value={this.state.value}
                          onChange={this.onChange}
                        >
                        </t.form.Form>
                        <button type="submit" className="btn btn-primary" onClick={this.save}>{this.state.isEditModal? TAPi18n.__("editGroupModal.createButton") : TAPi18n.__("createGroupModal.createButton")}</button>
                      {this.state.isEditModal ? <button type="delete" className="btn btn-danger pull-right" onClick={this.deleteGroup}>{TAPi18n.__("editGroupModal.delete")}</button> : null}
                    </Modal.Body>
                </Modal>
            </div>
        );
    }
});

export default CreateGroupModal;
