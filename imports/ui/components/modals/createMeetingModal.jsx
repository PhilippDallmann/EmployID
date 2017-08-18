import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {TAPi18n} from 'meteor/tap:i18n';
import {createContainer} from 'meteor/react-meteor-data';
import swal from 'sweetalert2';

import GroupCollection from '../../../api/groups/groups';
import CreateMeetingModalActions from '../../../reflux/actions/createMeetingModalActions';
import CreateMeetingModalStore from '../../../reflux/stores/createMeetingModalStore';
import t from 'tcomb-form';

let Modal = require('react-bootstrap').Modal;
let Button = require('react-bootstrap').Button;
let Row = require('react-bootstrap').Row;
let Col = require('react-bootstrap').Col;
let Panel = require('react-bootstrap').Panel;
let DateTimeField = require('react-bootstrap-datetimepicker');
let Select = require('react-select');

const MeetingSchema = t.struct({
	topic: t.String,
	description: t.String,
	group: t.String,
	facilitator: t.String,
	client: t.String
});

let form;

export default class CreateMeetingModalState extends Component {
  constructor(props) {
    super(props);

    if(this.props.meeting!==null) {
      var meeting = this.props.meeting;
      this.state = {
        show: true,
        isEditModal: true,
        date: meeting.start_date,
        value: {
          topic: meeting.topic,
          description: meeting.description,
          group: meeting.group,
          facilitator: meeting.facilitator,
          client: meeting.client
        }
      };
    } else {
      this.state = {
        show: true,
        isEditModal: false,
        date: new Date().toISOString(),
        value: {
          topic: null,
          description: null,
          group: null,
          facilitator: null,
          client: null
        },
      };
    }
    this.close = this.close.bind(this);
    this.onChange = this.onChange.bind(this);
    this.save = this.save.bind(this);
    this.createMeeting = this.createMeeting.bind(this);
    this.editMeeting = this.editMeeting.bind(this);
    this.deleteMeeting = this.deleteMeeting.bind(this);
    this.updateDate = this.updateDate.bind(this);
  }

  componentDidMount() {
    require('../../../../node_modules/react-bootstrap-datetimepicker/css/bootstrap-datetimepicker.css');
    require('../../../../node_modules/react-select/dist/react-select.css');
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.meeting!==null) {
      var meeting = nextProps.meeting;
      this.setState({
        show: true,
        isEditModal: true,
        date: meeting.start_date,
        value: {
          topic: meeting.topic,
          description: meeting.description,
          group: meeting.group,
          facilitator: meeting.facilitator,
          client: meeting.client
        }
      });
    } else {
      this.setState({
        show: true,
        isEditModal: false,
        date: new Date().toISOString(),
        value: {
          topic: null,
          description: null,
          group: null,
          facilitator: null,
          client: null
        }
      });
    }
  }
  close() {
    this.setState({
      show: false
    });
  }
  updateDate(value) {
    this.setState({
      date: value
    });
  }
  onChange(value, path) {
    if(Array.isArray(path)) {
      if(form.getComponent(path)) {
        form.getComponent(path).validate();
      }
      this.setState({
        value: value
      });
    }
  }
  save() {
    var validation = t.validate(this.state.value, MeetingSchema);
    if(validation.isValid()) {
      if(this.state.isEditModal) {
        this.editMeeting();
      } else {
        this.createMeeting();
      }
    } else {
      form.validate();
    }
  }
  createMeeting() {
    var meeting = {
      owner: Meteor.userId(),
      group: this.state.value.group,
      topic: this.state.value.topic,
      description: this.state.value.description,
      start_date: this.state.date,
      facilitator: this.state.value.facilitator,
      client: this.state.value.client
    };
    CreateMeetingModalActions.createMeeting(meeting, TAPi18n.getLanguage());
    this.close();
  }
  editMeeting() {
    var meeting = {
      _id: this.props.meeting._id,
      group: this.state.value.group,
      topic: this.state.value.topic,
      description: this.state.value.description,
      start_date: this.state.date,
      facilitator: this.state.value.facilitator,
      client: this.state.value.client
    };
    CreateMeetingModalActions.editMeeting(meeting);
    this.close();
  }
  deleteMeeting() {
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
      Meteor.call("deleteMeeting", { owner: me.props.meeting.owner, _id: me.props.meeting._id }, function(error, result) {
        if(!error) {
          me.close();
        }
      });
    });
  }
  render() {
    return <CreateMeetingModalContainer
      show = {this.state.show}
      isEditModal = {this.state.isEditModal}
      date = {this.state.date}
      value = {this.state.value}
      close = {this.close.bind(this)}
      onChange = {this.onChange.bind(this)}
      save = {this.save.bind(this)}
      createMeeting = {this.createMeeting.bind(this)}
      editMeeting = {this.editMeeting.bind(this)}
      deleteMeeting = {this.deleteMeeting.bind(this)}
      updateDate = {this.updateDate.bind(this)}
    />
  }
}

class CreateMeetingModal extends Component{
	render() {
		let groups = [];
		let users = [];
		for(let g in this.props.groups) {
			groups.push({value: this.props.groups[g]._id, text: this.props.groups[g].name});
		}
		for(let u in this.props.users) {
			users.push({value: this.props.users[u]._id, text: this.props.users[u].username});
		}
		let options = {
			fields: {
				topic: {
					label: TAPi18n.__("createMeetingModal.topic")
				},
				description: {
					label: TAPi18n.__("createMeetingModal.description")
				},
				group: {
					factory: t.form.Select,
					label: TAPi18n.__("createMeetingModal.group"),
					options: groups
				},
				facilitator: {
					factory: t.form.Select,
					label: TAPi18n.__("createMeetingModal.facilitator"),
					options: users
				},
				client: {
					factory: t.form.Select,
					label: TAPi18n.__("createMeetingModal.client"),
					options: users
				}
			}
		}
		return (
      <div id='createMeetingModal'>
        <Modal
               show={this.props.show}
               onHide={this.props.close}
               container={this}
               aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {this.props.isEditModal ? TAPi18n.__("editMeetingModal.title") : TAPi18n.__("createMeetingModal.title")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>
              {TAPi18n.__("createMeetingModal.date")}
            </label>
            <DateTimeField
                           className="input-area"
                           dateTime={this.props.date}
                           format="YYYY-MM-DDTHH:mm:ss.sssZ"
                           onChange={this.props.updateDate}>

            </DateTimeField>
            <t.form.Form
              ref = {(c)=> form = c}
              type={MeetingSchema}
              options={options}
              value={this.props.value}
              onChange={this.props.onChange}
            >
            </t.form.Form>
            <button type="submit" className="btn btn-primary" onClick={this.props.save}>{this.props.isEditModal? TAPi18n.__("editMeetingModal.createButton") : TAPi18n.__("createMeetingModal.createButton")}</button>
            {this.props.isEditModal ? <button type="delete" className="btn btn-danger pull-right" onClick={this.props.deleteMeeting}>{TAPi18n.__("editMeetingModal.delete")}</button> : null}
          </Modal.Body>
        </Modal>
      </div>
		);
	}
}

CreateMeetingModal.propTypes = {
	groups: PropTypes.array,
	users: PropTypes.array
};

let CreateMeetingModalContainer = createContainer((props) => {
  if (props.value && props.value.group) {
    Meteor.subscribe('usersOfGroup', props.value.group);
  }

  return {
    groups: GroupCollection.find().fetch(),
    users: Meteor.users.find().fetch()
  };
},CreateMeetingModal);
