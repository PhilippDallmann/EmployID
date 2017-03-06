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
      result: this.props.result,
      value: this.props.result,
      isFacilitator: this.props.facilitator==Meteor.userId(),
      isResultLoaded: false
    };
    this.onChange = this.onChange.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if(this.state.isResultLoaded) {
      this.setState({
        result: nextProps.result,
        isFacilitator: nextProps.facilitator==Meteor.userId()
      });
    } else {
      this.setState({
        result: nextProps.result,
        value: nextProps.result,
        isFacilitator: nextProps.facilitator==Meteor.userId(),
        isResultLoaded: true
      });
    }
  }
  componentDidMount() {
    require('../../../../../node_modules/react-quill/dist/quill.snow.css');
  }
  onChange(value) {
    this.setState({
      value: value
    });
    Meteor.call('updateResult', this.props.meetingId, value);
  }
  render() {
    if(this.state.isFacilitator) {
      return (
        <div className="text-editor">
          <CustomToolbar />
          <ReactQuill
            theme='snow'
            defaultValue={this.state.result}
            value={this.state.value}
            onChange={this.onChange}
            modules={ResultEditor.modules}
            readOnly={false}
          >
          </ReactQuill>
        </div>
      )
    } else {
      return (
        <div className="text-editor">
          <CustomToolbar />
          <ReactQuill
            theme='snow'
            value={this.state.result}
            modules={ResultEditor.modules}
            readOnly={true}
          >
          </ReactQuill>
        </div>
      )
    }
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
