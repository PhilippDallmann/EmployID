/* global document, $ */

import { Meteor } from 'meteor/meteor';
import React, { Component, PropTypes } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { TAPi18n } from 'meteor/tap:i18n';
import lodash from 'lodash';
import swal from 'sweetalert2';

import StageCollection from '../../../api/stages/stages';
import MaterialCollection from '../../../api/materials/materials';
import StageMessagesCollection from '../../../api/stageMessages/stageMessages';

import LoadingActions from '../../../reflux/actions/loadingActions';
import EditorActions from '../../../reflux/actions/editorActions';

const Button = require('react-bootstrap').Button;
const FormGroup = require('react-bootstrap').FormGroup;
const FormControl = require('react-bootstrap').FormControl;
const InputGroup = require('react-bootstrap').InputGroup;
const Panel = require('react-bootstrap').Panel;
const ListGroup = require('react-bootstrap').ListGroup;
const ListGroupItem = require('react-bootstrap').ListGroupItem;
const Grid = require('react-bootstrap').Grid;
const DropdownButton = require('react-bootstrap').DropdownButton;
const MenuItem = require('react-bootstrap').MenuItem;

const placeholder = document.createElement('li');
placeholder.className = 'placeholder';

const stages = ['start', 'problem', 'vision', 'resources', 'setting goals', 'solution', 'feedback'];

export default class EditorState extends Component {
  constructor(props) {
    super(props);

    const langObject = TAPi18n.getLanguages();
    const languages = [];
    Object.keys(langObject).forEach((key) => {
      languages.push(key);
    });

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
      activeLanguage: 'en',
      currentStageMessages: [],
      saveStagesButtonDisabled: true,
      saveMaterialButtonDisabled: true,
    };
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
    document.title = TAPi18n.__('editor.documentTitle');
  }
  handleRoleChange(role) {
    this.setState({
      activeRole: role,
    });
  }
  handleNewMaterialText(event) {
    this.setState({
      newMaterialText: event.target.value,
    });
  }
  handleLanguageChange(languageKey) {
    const stageMessages = StageMessagesCollection.find({ language_key: languageKey }).fetch();
    if (stageMessages) {
      this.setState({
        currentStageMessages: stageMessages,
        activeLanguage: languageKey,
      });
    }
  }
  handleMaterialChange(event) {
    const newMaterial = { id: event.target.id, text: event.target.value };
    const array = this.state.editedMaterials;
    const findIndex = lodash.findIndex(array, { id: newMaterial.id });
    if (findIndex !== -1) {
      array[findIndex] = newMaterial;
      this.setState({
        saveMaterialButtonDisabled: false,
        editedMaterials: array,
      });
    } else {
      array.push(newMaterial);
      this.setState({
        saveMaterialButtonDisabled: false,
        editedMaterials: array,
      });
    }
  }
  onSaveMaterialButtonClick() {
    EditorActions.editMaterials(this.state.editedMaterials);
    this.setState({
      saveMaterialButtonDisabled: true,
      editedMaterials: [],
    });
  }
  handleStageMessageChange() {
    this.setState({
      saveStagesButtonDisabled: false,
    });
  }
  onSaveStateMessagesButtonClick() {
    this.setState({
      saveStagesButtonDisabled: true,
    });
    // TODO not optimal performance, bad
    for (let i = 0; i < 7; i += 1) {
      const currentText = document.getElementById(`message-${i}`).value;
      Meteor.call('updateStageMessage', i, this.state.activeLanguage, currentText);
    }
  }
  onImportClick() {
    swal({
      title: TAPi18n.__('swal.areYouSure'),
      text: TAPi18n.__('swal.importInfo'),
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DD6B55',
      confirmButtonText: TAPi18n.__('swal.importConfirmation'),
      html: false,
    }).then(() => {
      LoadingActions.setLoading();
      Meteor.call('deleteAllMaterials');
      $.getJSON('defaultMaterials.json', (json) => {
        for (const lang in json) {
          const langs = json[lang];
          for (const stage in langs) {
            const stages = langs[stage];
            for (const role in stages) {
              const roles = stages[role];
              for (const material in roles) {
                const newMaterial = {
                  text: roles[material].text,
                  role: roles[material].role,
                  position: roles[material].position,
                  languageKey: lang,
                  isHeading: roles[material].is_heading,
                };
                Meteor.call('addMaterialGivenStageDescription', stage, newMaterial);
              }
            }
          }
        }
        LoadingActions.unsetLoading();
      });
    });
  }
  handleStageChange(eventKey) {
    this.setState({
      activeStageId: parseInt(eventKey),
    });
  }
  deleteMaterial(materialId) {
    EditorActions.deleteMaterial(this.state.activeStageId, materialId);
  }
  toggleHeading(materialId) {
    EditorActions.toggleHeading(materialId);
  }
  render() {
    return (
      <EditorContainer
        state={this.state}
        handleStageChange={this.handleStageChange.bind(this)}
        handleRoleChange={this.handleRoleChange.bind(this)}
        handleNewMaterialText={this.handleNewMaterialText.bind(this)}
        handleLanguageChange={this.handleLanguageChange.bind(this)}
        handleMaterialChange={this.handleMaterialChange.bind(this)}
        onSaveMaterialButtonClick={this.onSaveMaterialButtonClick.bind(this)}
        onSaveStateMessagesButtonClick={this.onSaveStateMessagesButtonClick.bind(this)}
        handleStageMessageChange={this.handleStageMessageChange.bind(this)}
        deleteMaterial={this.deleteMaterial.bind(this)}
        toggleHeading={this.toggleHeading.bind(this)}
        onImportClick={this.onImportClick.bind(this)}
      />
    );
  }
}

class Editor extends Component {
  getMaterialText(id) {
    const findIndex = lodash.findIndex(this.props.state.editedMaterials, { id });
    let result;
    if (findIndex !== -1) {
      result = this.props.state.editedMaterials[findIndex].text;
      return result;
    }
    result = this.props.currentMaterial[lodash.findIndex(this.props.currentMaterial, { _id: id })].text;
    return result;
  }
  addMaterial() {
    // TODO role check!!! only if admin or editor?
    if (this.props.state.newMaterialText === null) {
      // do nothing -> add button only can be clicked, if not empty
    } else {
      const newMaterial = {
        text: this.props.state.newMaterialText,
        role: this.props.state.activeRole,
        position: this.props.currentMaterial.length,
        languageKey: this.props.state.activeLanguage,
        isHeading: false,
      };
      EditorActions.addMaterial(this.props.state.activeStageId, newMaterial);
      this.setState({
        newMaterialText: '',
      });
    }
  }
  render() {
    let currentMaterialHelper;
    if (this.props.currentMaterial) {
      currentMaterialHelper = this.props.currentMaterial;
      if (this.props.state.materialsOrdered !== null) {
        currentMaterialHelper = this.props.state.materialsOrdered;
      }
    } else {
      currentMaterialHelper = [];
    }
    const listItems = currentMaterialHelper.map(function (material, i) {
      return (
        <li
          data-id={i}
          key={i}
          className="list-group-item"
        >
          {
            <div>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    type="text"
                    id={material._id}
                    value={this.getMaterialText(material._id)}
                    onChange={this.props.handleMaterialChange}
                  />
                  <InputGroup.Button>
                    <DropdownButton id="optionsDrop" pullRight title="">
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
        <div className="pull-left">{TAPi18n.__('editor.editMaterials')}</div>
        <Button onClick={this.props.onImportClick}>{TAPi18n.__('editor.import')}</Button>
        <div className="pull-right">
          <DropdownButton id="languageDropdown" title={this.props.state.activeLanguage}>
            {this.props.state.availableLanguages.map(function (languageKey, index) {
              return (
                <MenuItem eventKey={index} onClick={this.props.handleLanguageChange.bind(null, languageKey)}>
                  {TAPi18n.__(`languages.${languageKey}`)}
                </MenuItem>
              );
            }, this)}
          </DropdownButton>
          <DropdownButton id="roleDropdown" title={this.props.state.activeRole}>
            <MenuItem eventKey={1} onClick={this.props.handleRoleChange.bind(null, 'participant')}>
              Participant
            </MenuItem>
            <MenuItem eventKey={2} onClick={this.props.handleRoleChange.bind(null, 'facilitator')}>
              Facilitator
            </MenuItem>
            <MenuItem eventKey={3} onClick={this.props.handleRoleChange.bind(null, 'client')}>
              Client
            </MenuItem>
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
          <Button disabled={this.props.state.saveMaterialButtonDisabled} onClick={this.props.onSaveMaterialButtonClick}>
            <span className="glyphicon glyphicon-floppy-disk" /> {TAPi18n.__('editor.saveChanges')}
          </Button>
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
                <Button onClick={this.addMaterial.bind(this)} disabled={!this.props.state.newMaterialText}>
                  {TAPi18n.__('editor.add')}
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
        <div className="pull-left">{TAPi18n.__('editor.editStageMessages')}</div>
        <div className="pull-right">
          <Button disabled={this.props.state.saveStagesButtonDisabled} onClick={this.props.onSaveStateMessagesButtonClick}><span className="glyphicon glyphicon-floppy-disk" /> {TAPi18n.__('editor.saveChanges')}</Button>
        </div>
      </div>
    );

    const editStageMessages = (
      <div>
        <Panel header={editStageMessagesHeader}>
          <ListGroup fill>
            {this.props.state.currentStageMessages.map(stageMessage => (
              <ListGroupItem key={stageMessage._id}>
                <FormGroup>
                  <FormControl
                    type="text"
                    label={TAPi18n.__(`editor.${stageMessage.stage}`)}
                    id={`message-${stageMessage.stage}`}
                    defaultValue={stageMessage.message}
                    onChange={this.props.handleStageMessageChange}
                  />
                </FormGroup>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Panel>
      </div>
    );

    return (
      <div>
        <Grid fluid>
          {editMaterial}
          <hr />
          {editStageMessages}
        </Grid>
      </div>
    );
  }
}

Editor.propTypes = {
  currentStage: PropTypes.number,
  currentMaterial: PropTypes.array,
};

const EditorContainer = createContainer((props) => {
  const materialHandle = Meteor.subscribe('editorMaterial', props.state.activeStageId,
    props.state.activeRole, props.state.activeLanguage,
  );
  if (materialHandle.ready()) {
    LoadingActions.unsetLoading();
  }

  return {
    currentStage: StageCollection.find({ stage_id: props.state.activeStageId }).fetch()[0],
    currentMaterial: MaterialCollection.find({}, { sort: { position: 1 } }).fetch(),
  };
}, Editor);
