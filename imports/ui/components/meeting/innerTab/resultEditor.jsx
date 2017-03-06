import {Meteor} from 'meteor/meteor';
import React, {Component, PropTypes} from 'react';
import ReactQuill from 'react-quill';
import {TAPi18n} from 'meteor/tap:i18n';
import {createContainer} from 'meteor/react-meteor-data';

const CustomToolbar = () => (
  <div id="toolbar">
    <div className="result-panel-header">{TAPi18n.__("meeting.resultPanelHeader")}</div>
    <div className="toolbar-buttons">
      <select className="ql-header">
        <option value="1"></option>
        <option value="2"></option>
        <option selected></option>
      </select>
      <button className="ql-bold"></button>
      <button className="ql-italic"></button>
      <select className="ql-color">
        <option value="red"></option>
        <option value="green"></option>
        <option value="blue"></option>
        <option value="orange"></option>
        <option value="violet"></option>
        <option value="#d0d1d2"></option>
        <option selected></option>
      </select>
    </div>
  </div>
);

class ResultEditor extends Component{
  constructor(props) {
    super(props);

    this.state = {
      value: this.props.result,
      isFacilitator: this.props.facilitator==Meteor.userId()
    };
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.result,
      isFacilitator: nextProps.facilitator==Meteor.userId()
    });
  }
  componentDidMount() {
    require('../../../../../node_modules/react-quill/dist/quill.snow.css');
  }
  onChange(value) {
    Meteor.call('updateResult', this.props.meetingId, value);
  }
  render() {
    return (
      <div className="text-editor">
        <CustomToolbar />
        <ReactQuill
          theme='snow'
          value={this.state.value}
          onChange={this.onChange}
          modules={ResultEditor.modules}
          readOnly={!this.state.isFacilitator}
        >
        </ReactQuill>
      </div>
    )
  }
}

/*
 * Quill modules to attach to editor
 * See http://quilljs.com/docs/modules/ for complete options
 */
ResultEditor.modules = {
  toolbar: {
    container: "#toolbar",
  }
};

/*
 * Quill editor formats
 * See http://quilljs.com/docs/formats/
 */
ResultEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'color',
]

export default ResultEditor;
