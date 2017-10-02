/**
 * data-append.jsx: append 'data_append' fieldset.
 *
 * @DataAppend, must be capitalized in order for reactjs to render it as a
 *     component. Otherwise, the variable is rendered as a dom node.
 *
 * @sessionId, pass a callback to be run, within the corresponding ajax
 *     script. This allows the server side to return a list of all stored
 *     session id's, and append them to the form, respectively.
 *
 * Note: this script implements jsx (reactjs) syntax.
 *
 * Note: importing 'named export' (multiple export statements in a module),
 *       requires the object being imported, to be surrounded by { brackets }.
 */

import React from 'react';
import SupplyDatasetFile from '../input-data/supply-dataset-file.jsx';
import SupplyDatasetUrl from '../input-data/supply-dataset-url.jsx';
import checkValidString from '../validator/valid-string.js';
import ModelType from '../model/model-type.jsx';
import Spinner from '../general/spinner.jsx';
import { setSvButton, setLayout, setContentType } from '../redux/action/page.jsx';
import ajaxCaller from '../general/ajax-caller.js';

var DataAppend = React.createClass({
  // initial 'state properties'
    getInitialState: function() {
        return {
            value_collection: '--Select--',
            value_dataset_type: '--Select--',
            value_model_type: '--Select--',
            ajax_done_options: null,
            ajax_done_error: null,
            ajax_fail_error: null,
            ajax_fail_status: null
        };
    },
  // update 'state properties'
    changeCollection: function(event){
        const collection = event.target.value;

        if (
            collection && collection != '--Select--' &&
            checkValidString(collection)
        ) {
            this.setState({value_collection: event.target.value});
        } else {
            this.setState({value_collection: '--Select--'});

          // update redux store
            const action = setSvButton({button: {submit_analysis: false}});
            this.props.dispatchSvButton(action);
        }
    },
    changeDatasetType: function(event){
        const datasetType = event.target.value;

        if (
            datasetType && datasetType != '--Select--' &&
            checkValidString(datasetType)
        ) {
            this.setState({value_dataset_type: event.target.value});
        } else {
            this.setState({value_dataset_type: '--Select--'});
        }

      // update redux store
        const action = setSvButton({button: {submit_analysis: false}});
        this.props.dispatchSvButton(action);
    },
  // update 'state properties' from child component (i.e. 'value_model_type')
    changeModelType: function(event) {
        const modelType = event.value_model_type;

        if (
            modelType && modelType != '--Select--' &&
            checkValidString(modelType)
        ) {
            this.setState({value_model_type: modelType});
        } else {
            this.setState({value_model_type: '--Select--'});
        }

      // update redux store
        const action = setSvButton({button: {submit_analysis: false}});
        this.props.dispatchSvButton(action);
    },
  // update 'state properties' from child component
    displaySubmit: function(event) {
        if (event.submitted_proper_dataset) {
          // update redux store
            const action = setSvButton({
                button: {submit_analysis: event.submitted_proper_dataset}
            });
            this.props.dispatchSvButton(action);
        } else {
          // update redux store
            const action = setSvButton({button: {submit_analysis: false}});
            this.props.dispatchSvButton(action);
        }
    },
  // triggered when 'state properties' change
    render: function(sessionId){
        const inputDatasetType = this.state.value_dataset_type;
        const inputCollection = this.state.value_collection;
        const modelType = this.state.value_model_type;
        const Dataset = this.getSupplyDataset(
            inputDatasetType,
            inputCollection,
            modelType
        );
        const datasetInput = !!Dataset ? <Dataset onChange={this.displaySubmit} /> : null;
        const options = this.state.ajax_done_options;
        const spinner = !!this.state.display_spinner ? <Spinner /> : null;

        return(
            <fieldset className='fieldset-session-data-upload'>
                <legend>Data Upload</legend>
                <fieldset className='fieldset-dataset-type'>
                    <legend>Configurations</legend>
                    <p>Select past collection, and upload type</p>
                    <select
                        name='collection'
                        autoComplete='off'
                        onChange={this.changeCollection}
                        value={this.state.value_collection}
                    >

                        <option value='' defaultValue>--Select--</option>

                        {/* array components require unique 'key' value */}
                        {options && options.map(function(value) {
                            return <option key={value.id} value={value.collection}>
                                       {value.id}: {value.collection}
                                   </option>;
                        })}

                    </select>

                    <select
                        name='dataset_type'
                        autoComplete='off'
                        onChange={this.changeDatasetType}
                        value={this.state.value_dataset_type}
                    >

                        <option value='' defaultValue>--Select--</option>
                        <option value='file_upload'>Upload file</option>
                        <option value='dataset_url'>Dataset URL</option>

                    </select>

                    <ModelType onChange={this.changeModelType} />
                </fieldset>

                {datasetInput}
                {spinner}
            </fieldset>
        );
    },
  // call back: used for the above 'render' (return 'span' if undefined)
    getSupplyDataset: function(datasetType, collection, modelType) {
        if (
            datasetType && checkValidString(datasetType) &&
            datasetType != '--Select--' && collection &&
            checkValidString(collection) && modelType &&
            checkValidString(modelType) && modelType != '--Select--'
        ) {
            return {
                file_upload: SupplyDatasetFile,
                dataset_url: SupplyDatasetUrl
            }[datasetType] || null;
        } else {
            return null;
        }
    },
  // call back: get session id(s) from server side, and append to form
    componentDidMount: function() {
      // ajax arguments
        const ajaxEndpoint = '/retrieve-collections';
        const ajaxArguments = {
            'endpoint': ajaxEndpoint,
            'data': null
        };

      // boolean to show ajax spinner
        this.setState({display_spinner: true});

      // asynchronous callback: ajax 'done' promise
        ajaxCaller(function (asynchObject) {
          // Append to DOM
            if (asynchObject && asynchObject.error) {
                this.setState({ajax_done_error: asynchObject.error});
            } else if (asynchObject) {
                this.setState({ajax_done_options: asynchObject});
            }
        // boolean to hide ajax spinner
            this.setState({display_spinner: false});
        }.bind(this),
      // asynchronous callback: ajax 'fail' promise
        function (asynchStatus, asynchError) {
            if (asynchStatus) {
                this.setState({ajax_fail_status: asynchStatus});
                console.log('Error Status: ' + asynchStatus);
            }
            if (asynchError) {
                this.setState({ajax_fail_error: asynchError});
                console.log('Error Thrown: ' + asynchError);
            }
        // boolean to hide ajax spinner
            this.setState({display_spinner: false});
        }.bind(this),
      // pass ajax arguments
        ajaxArguments);
    },
    componentWillMount: function() {
      // update redux store
        const actionLayout = setLayout({'layout': 'analysis'});
        this.props.dispatchLayout(actionLayout);

        const actionContentType = setContentType({'layout': 'data_append'});
        this.props.dispatchContentType(actionContentType);
    },
    componentWillUnmount: function() {
      // update redux store
        const action = setSvButton({button: {submit_analysis: false}});
        this.props.dispatchSvButton(action);
    }
});

// indicate which class can be exported, and instantiated via 'require'
export default DataAppend
