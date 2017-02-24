import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';

import StageCollection from '../../../../api/stages/stages';
import MaterialCollection from '../../../../api/materials/materials';

import MeetingActions from '../../../../reflux/actions/meetingActions';
import MeetingStore from '../../../../reflux/stores/meetingStore';

let Button = require('react-bootstrap').Button;
let OverlayTrigger = require('react-bootstrap').OverlayTrigger;
let Popover = require('react-bootstrap').Popover;
let ButtonGroup = require('react-bootstrap').ButtonGroup;

class MaterialArea extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stageId: this.props.stageId,
      chatId: this.props.chatId,
      stage: this.props.stage
    };
  }
  componentWillReceiveProps(nextProps) {
		this.setState({
			stageId: nextProps.stageId,
      chatId: nextProps.chatId,
      stage: nextProps.stage
		});
	}
  onSendAsChatMessageClick(e) {
		var message = {
			userId: Meteor.userId(),
			userName: Meteor.user().username,
			text: e.target.getAttribute('itemID')
		};
		MeetingActions.createChatMessage(message, this.state.chatId);
	}
  render() {
    var currentMaterial = [];
		for (var i in this.props.roleMaterial) {
			var material = this.props.roleMaterial[i];
			var index = this.state.stage.material.indexOf(material._id);
			if (index !== -1) {
				currentMaterial.push(material);
			}
		}
    return(
      <div className="material-div">
        <div className="material-text-container">
          {currentMaterial.map((material) => {
            if(material.is_heading) {
              return (
                <li className="material-li list-group-item"style={{"font-weight": "bold"}}>
                  <OverlayTrigger trigger="click" rootClose placement="left" overlay={
                      <Popover>
                          <ButtonGroup vertical block>
                            <Button itemID={material.text} onClick={this.onSendAsChatMessageClick}>{__("meeting.sendAsChatMessage")}</Button>
                          </ButtonGroup>
                      </Popover>
                    }>
                    <span>{material.text}</span>
                  </OverlayTrigger>

                </li>
              );
            } else {
              return (
                <li className="material-li list-group-item">
                  <OverlayTrigger trigger="click" rootClose placement="left" overlay={
                      <Popover>
                          <ButtonGroup vertical block>
                            <Button itemID={material.text} onClick={this.onSendAsChatMessageClick}>{__("meeting.sendAsChatMessage")}</Button>
                          </ButtonGroup>
                      </Popover>
                    }>
                    <span>{material.text}</span>
                  </OverlayTrigger>
                </li>
              );
            }
            return (
          <li style={{"font-weight": "bold"}}>
            {material.text}
          </li>
          ); })}
        </div>
      </div>
    );
  }
}

MaterialArea.propTypes = {
  currentStage: PropTypes.object,
  roleMaterial: PropTypes.array.isRequired
};

export default createContainer((stageId) => {
  Meteor.subscribe("materials", FlowRouter.getParam("meetingId"), TAPi18n.getLanguage());
  return {
    currentStage: StageCollection.find({stage_id: stageId}).fetch()[0],
    roleMaterial: MaterialCollection.find().fetch()
  };
},MaterialArea);