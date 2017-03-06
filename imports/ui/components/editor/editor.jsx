import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import { FlowRouter } from 'meteor/kadira:flow-router';
import {TAPi18n} from 'meteor/tap:i18n';
import lodash from 'lodash';

import StageCollection from '../../../api/stages/stages';
import MaterialCollection from '../../../api/materials/materials';
import StageMessagesCollection from '../../../api/stageMessages/stageMessages';

import MeetingActions from '../../../reflux/actions/meetingActions';
import MeetingStore from '../../../reflux/stores/meetingStore';
import EditorActions from '../../../reflux/actions/editorActions';
import EditorStore from '../../../reflux/stores/editorStore';

let Button = require('react-bootstrap').Button;
let FormGroup = require('react-bootstrap').FormGroup;
let FormControl = require('react-bootstrap').FormControl;
let InputGroup = require('react-bootstrap').InputGroup;
let Col = require('react-bootstrap').Col;
let Panel = require('react-bootstrap').Panel;
let ListGroup = require('react-bootstrap').ListGroup;
let ListGroupItem = require('react-bootstrap').ListGroupItem;
let Grid = require('react-bootstrap').Grid;
let DropdownButton = require("react-bootstrap").DropdownButton;
let MenuItem = require("react-bootstrap").MenuItem;
let Table = require('react-bootstrap').Table;


let Nav = require("react-bootstrap").Nav;
let NavItem = require("react-bootstrap").NavItem;

var placeholder = document.createElement("li");
placeholder.className = "placeholder";

var stages = ['start', 'problem', 'vision', 'resources', 'setting goals', 'solution', 'feedback'];

export default class EditorState extends Component {
  constructor(props) {
    super(props);

    var langObject = TAPi18n.getLanguages();
    var languages = [];
    for(var index in langObject) {
      languages.push(index);
    }

    this.state = {
      date: new Date(),
      description: '',
      activeStageId: 0,
      activeRole: 'participant',
      newMaterialText: null,
      materialsOrdered: null,
      editedMaterials: [],
      materialsHaveNewOrder: false,

      availableLanguages: languages,
      activeLanguage: "en",
      currentStageMessages: [],
      saveStagesButtonDisabled: true,
      saveMaterialButtonDisabled: true
    }
    this.handleStageChange = this.handleStageChange.bind(this);
    this.handleRoleChange = this.handleRoleChange.bind(this);
    this.handleNewMaterialText = this.handleNewMaterialText.bind(this);
    this.handleLanguageChange = this.handleLanguageChange.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.onSaveMaterialButtonClick = this.onSaveMaterialButtonClick.bind(this);
    this.handleStageMessageChange = this.handleStageMessageChange.bind(this);
    this.onSaveStateMessagesButtonClick = this.onSaveStateMessagesButtonClick.bind(this);
    this.deleteMaterial = this.deleteMaterial.bind(this);
  }
  componentWillMount() {
      document.title = TAPi18n.__("editor.documentTitle");
  }
  handleStageChange(eventKey) {
		this.setState({
			activeStageId: parseInt(eventKey)
		});
	}
	handleRoleChange(role) {
		this.setState({
			activeRole: role
		});
	}
	handleNewMaterialText(event) {
		this.setState({
			newMaterialText: event.target.value
		});
	}
  handleLanguageChange(languageKey) {
    var stageMessages = StageMessagesCollection.find({language_key: languageKey}).fetch();
    if(stageMessages) {
      this.setState({
        currentStageMessages: stageMessages,
        activeLanguage: languageKey
      });
    }
  }
  handleMaterialChange(event) {
    var newMaterial = {id: event.target.id, text: event.target.value};
    var array = this.state.editedMaterials;
    var findIndex = lodash.findIndex(array, {id: newMaterial.id});
    if(findIndex !== -1) {
      array[findIndex] = newMaterial;
      this.setState({
        saveMaterialButtonDisabled: false,
        editedMaterials: array
      });
    } else {
      array.push(newMaterial);
      this.setState({
        saveMaterialButtonDisabled: false,
        editedMaterials: array
      });
    }

  }
  onSaveMaterialButtonClick() {
    EditorActions.editMaterials(this.state.editedMaterials)
    this.setState({
      saveMaterialButtonDisabled: true,
      editedMaterials: []
    });
  }
  handleStageMessageChange(event){
    this.setState({
      saveStagesButtonDisabled: false
    });
  }
  onSaveStateMessagesButtonClick() {
    this.setState({
      saveStagesButtonDisabled: true
    });
    // TODO not optimal performance, bad
    for(var i = 0; i < 7; i++) {
      var currentText = document.getElementById('message-' + i).value;
      Meteor.call("updateStageMessage", i, this.state.activeLanguage, currentText);
    }
  }

  deleteMaterial(materialId) {
    EditorActions.deleteMaterial(this.state.activeStageId, materialId);
  }
  toggleHeading(materialId) {
    EditorActions.toggleHeading(materialId);
  }
  render() {
    return(
      <EditorContainer
        state = {this.state}
        handleStageChange = {this.handleStageChange.bind(this)}
        handleRoleChange = {this.handleRoleChange.bind(this)}
        handleNewMaterialText = {this.handleNewMaterialText.bind(this)}
        handleLanguageChange = {this.handleLanguageChange.bind(this)}
        handleMaterialChange = {this.handleMaterialChange.bind(this)}
        onSaveMaterialButtonClick = {this.onSaveMaterialButtonClick.bind(this)}
        onSaveStateMessagesButtonClick = {this.onSaveStateMessagesButtonClick.bind(this)}
        handleStageMessageChange = {this.handleStageMessageChange.bind(this)}
        deleteMaterial = {this.deleteMaterial.bind(this)}
        toggleHeading = {this.toggleHeading.bind(this)}
      />
    );
  }
};

class Editor extends Component {
  getMaterialText(id) {
    var findIndex = lodash.findIndex(this.props.state.editedMaterials, {id: id});
    if(findIndex!==-1) {
      var result = this.props.state.editedMaterials[findIndex].text;
      return result;
    } else {
      var result =  this.props.currentMaterial[lodash.findIndex(this.props.currentMaterial, {_id: id})].text;
      return result;
    }
  }
  addMaterial() {
    // TODO role check!!! only if admin or editor?
    if (this.props.state.newMaterialText === null) {
      // do nothing -> add button only can be clicked, if not empty
    } else {
      var newMaterial = {
        text: this.props.state.newMaterialText,
        role: this.props.state.activeRole,
        position: this.props.currentMaterial.length,
        languageKey: this.props.state.activeLanguage,
        isHeading: false
      };
      EditorActions.addMaterial(this.props.state.activeStageId, newMaterial);
      this.setState({
        newMaterialText: ''
      });
    }
  }
  render() {
    let currentMaterialHelper;
    if(this.props.currentMaterial) {
      currentMaterialHelper = this.props.currentMaterial;
      if(this.props.state.materialsOrdered!==null){
        currentMaterialHelper = this.props.state.materialsOrdered
      }
    } else {
      currentMaterialHelper = [];
    }
    var listItems = currentMaterialHelper.map(function(material, i) {
      return (
        <li data-id={i}
            key={i}
            className="list-group-item">
          {
            <div>
              <FormGroup>
                <InputGroup>
                  <FormControl type="text" id={material._id} value={this.getMaterialText(material._id)} onChange={this.props.handleMaterialChange}/>
                  <InputGroup.Button>
                    <DropdownButton id="optionsDrop" pullRight={true} title="">
                      <MenuItem eventKey={1} id={1} onClick={this.props.deleteMaterial.bind(null, material._id)}>Delete</MenuItem>
                      <MenuItem eventKey={2} id={2} onClick={this.props.toggleHeading.bind(null, material._id)}>Heading</MenuItem>
                    </DropdownButton>
                  </InputGroup.Button>
                </InputGroup>
              </FormGroup>
            </div>
          }
        </li>
      );
    }, this);

    const editMaterialHeader = (
      <div className="title-panel">
        <div className="pull-left">{TAPi18n.__("editor.editMaterials")}</div>
        <div className="pull-right">
          <DropdownButton id="languageDropdown" title={this.props.state.activeLanguage}>
            {this.props.state.availableLanguages.map(function(languageKey, index) {
              return (
                <MenuItem eventKey={index} onClick={this.props.handleLanguageChange.bind(null, languageKey)}>{TAPi18n.__("languages." + languageKey)}</MenuItem>
              );
            },this)}
          </DropdownButton>
          <DropdownButton id="roleDropdown" title={this.props.state.activeRole}>
            <MenuItem eventKey={1} onClick={this.props.handleRoleChange.bind(null, "participant")}>Participant</MenuItem>
            <MenuItem eventKey={2} onClick={this.props.handleRoleChange.bind(null, "facilitator")}>Facilitator</MenuItem>
            <MenuItem eventKey={3} onClick={this.props.handleRoleChange.bind(null, "client")}>Client</MenuItem>
          </DropdownButton>
          <DropdownButton id="stageDropdown" title={stages[this.props.state.activeStageId]}>
            <MenuItem eventKey={0} onClick={this.props.handleStageChange.bind(null, 0)}>Start</MenuItem>
            <MenuItem eventKey={1} onClick={this.props.handleStageChange.bind(null, 1)}>Problem</MenuItem>
            <MenuItem eventKey={2} onClick={this.props.handleStageChange.bind(null, 2)}>Vision</MenuItem>
            <MenuItem eventKey={3} onClick={this.props.handleStageChange.bind(null, 3)}>Resources</MenuItem>
            <MenuItem eventKey={4} onClick={this.props.handleStageChange.bind(null, 4)}>Setting Goals</MenuItem>
            <MenuItem eventKey={5} onClick={this.props.handleStageChange.bind(null, 5)}>Solution</MenuItem>
            <MenuItem eventKey={6} onClick={this.props.handleStageChange.bind(null, 6)}>Feedback</MenuItem>
          </DropdownButton>
          <Button disabled={this.props.state.saveMaterialButtonDisabled} onClick={this.props.onSaveMaterialButtonClick}><span className="glyphicon glyphicon-floppy-disk"/> {TAPi18n.__("editor.saveChanges")}</Button>
        </div>
      </div>
    );
    const editMaterial = (
      <div className="edit-material">
        <Panel header={editMaterialHeader}>
          <FormGroup>
            <InputGroup>
              <FormControl
                onChange={this.props.handleNewMaterialText}
                value={this.props.state.newMaterialText}
                type="text"
              />
              <InputGroup.Button>
                <Button onClick={this.addMaterial.bind(this)} disabled={!this.props.state.newMaterialText}> {TAPi18n.__("editor.add")}
                </Button>
              </InputGroup.Button>
            </InputGroup>
          </FormGroup>
          <ul className="list-group">{listItems}</ul>
        </Panel>
      </div>
    );

    const editStageMessagesHeader = (
      <div className="title-panel">
        <div className="pull-left">{TAPi18n.__("editor.editStageMessages")}</div>
        <div className="pull-right">
          <Button disabled={this.props.state.saveStagesButtonDisabled} onClick={this.props.onSaveStateMessagesButtonClick}><span className="glyphicon glyphicon-floppy-disk"/> {TAPi18n.__("editor.saveChanges")}</Button>
        </div>
      </div>
    );

    const editStageMessages= (
      <div>
        <Panel header={editStageMessagesHeader}>
          <ListGroup fill>
            {this.props.state.currentStageMessages.map((stageMessage) => { return (
              <ListGroupItem key={stageMessage._id}>
                <FormGroup>
                  <FormControl type="text" label={TAPi18n.__("editor." + stageMessage.stage)} id={"message-" + stageMessage.stage} defaultValue={stageMessage.message} onChange={this.props.handleStageMessageChange}/>
                </FormGroup>
              </ListGroupItem>
            ); })}
          </ListGroup>
        </Panel>
      </div>
    );

    return (
      <div>
        <Grid fluid>
          {editMaterial}
          <hr/>
          {editStageMessages}
        </Grid>
      </div>
    );
  }
}

Editor.propTypes = {
  currentStage: PropTypes.number,
  currentMaterial: PropTypes.array
};

let EditorContainer = createContainer((props) => {
  var materialHandle = Meteor.subscribe("editorMaterial", props.state.activeStageId, props.state.activeRole, props.state.activeLanguage);
  return {
    currentStage: StageCollection.find({stage_id: props.state.activeStageId}).fetch()[0],
    currentMaterial: MaterialCollection.find().fetch()
  };
}, Editor);
