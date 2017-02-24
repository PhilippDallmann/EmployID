import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {TAPi18n} from 'meteor/tap:i18n';
import {createContainer} from 'meteor/react-meteor-data';

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
/*let options = {
	fields: {
		topic: {
			label: TAPi18n.__("createMeetingModal.topic")
		},
		description: {
			label: TAPi18n.__("createMeetingModal.description")
		},
		group: {
			factory: t.form.Select,
			label: TAPi18n.__("createMeetingModal.group")
		},
		facilitator: {
			factory: t.form.Select,
			label: TAPi18n.__("createMeetingModal.facilitator")
		},
		client: {
			factory: t.form.Select,
			label: TAPi18n.__("createMeetingModal.client")
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
}*/

class CreateMeetingModal extends Component{
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
	onChange(value, path) {
		if(this.refs.form.getComponent(path)) {
			this.refs.form.getComponent(path).validate();
		}
		this.setState({
			value: value
		});
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
			this.refs.form.validate();
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
			closeOnConfirm: true,
			html: false
		}, function(){
			Meteor.call("deleteMeeting", me.props.meeting, function(error, result) {
				if(!error) {
					me.close();
				}
			});
		});
	}
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
      <div>
        <Modal
               show={this.state.show}
               onHide={this.close}
               container={this}
               aria-labelledby="contained-modal-title">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title">
              {this.state.isEditModal ? TAPi18n.__("editMeetingModal.title") : TAPi18n.__("createMeetingModal.title")}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <label>
              {TAPi18n.__("createMeetingModal.date")}
            </label>
            <DateTimeField
                           className="input-area"
                           dateTime={this.state.date}
                           format="YYYY-MM-DDTHH:mm:ss.sssZ"
                           onChange={this.updateDate}>

            </DateTimeField>
            <t.form.Form
              ref="form"
              type={MeetingSchema}
              options={options}
              value={this.state.value}
              onChange={this.onChange}
            >
            </t.form.Form>
            <button type="submit" className="btn btn-primary" onClick={this.save}>{this.state.isEditModal? TAPi18n.__("editMeetingModal.createButton") : TAPi18n.__("createMeetingModal.createButton")}</button>
            {this.state.isEditModal ? <button type="delete" className="btn btn-danger pull-right" onClick={this.deleteMeeting}>{TAPi18n.__("editMeetingModal.delete")}</button> : null}
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

export default createContainer(() => {
  if(this.state) {
    let userHandle = Meteor.subscribe('usersOfGroup', this.state.value.group);
  }
  return {
    groups: GroupCollection.find().fetch(),
    users: Meteor.users.find().fetch()
  };
},CreateMeetingModal);
