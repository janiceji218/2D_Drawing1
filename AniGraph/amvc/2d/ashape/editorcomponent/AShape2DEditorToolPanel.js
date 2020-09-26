import React from "react"
import AObject from "../../../base/AObject/AObject";
import AModelColorPicker from "../../../../components/GUIComponents/AModelColorPicker";
import AGUIComponent from "../../../../components/GUIComponents/AGUIComponent";
import AModelSlider from "../../../../components/GUIComponents/AModelSlider";
import {Toggle} from "rsuite";
import {Uploader} from "rsuite";
import AModel2D from "../../mvc/AModel2D";
import ASelectPicker from "../../../../components/GUIComponents/ASelectPicker";


AObject.RegisterClass(AModel2D);

export default class AShape2DEditorToolPanel extends AGUIComponent{

    constructor(props){
        super(props);
    }

    saveSVG(){
        this.getAppState('saveSVG')();
    }

    saveJSON(){
        this.getAppState('model').saveJSON();
    }

    setIsCreatingNewShape(value){
        this.setAppState('isCreatingNewShape', value);
    }
    // getIsCreatingNewShape(){
    //     return this.props.isCreatingNewShape;
    // }

    initAppState() {
        super.initAppState();
        const self = this;
        this.addAppStateListener('selectedModel', function(selectedModel){
            self.setState({selectedModel: selectedModel});
        })
    }

    onRunScriptButtonClick(){
        this.getAppState('onRunScriptButtonClick')();
    }
    onRandomShapeButtonClick(){
        this.getAppState('onRandomShapeButtonClick')();
    }

    onSurpriseShapeButtonClick(){
        this.getAppState('onSurpriseShapeButtonClick')();
    }


    //##################//--new app state--\\##################
    //<editor-fold desc="new app state">

    getSelectedModel(){
        this.getAppState('selectedModel');
    }

    setCurrentEditMode(value){
        this.setAppState('currentEditMode', value);
    }

    getCurrentEditMode(){
        return this.getAppState('currentEditMode');
    }

    getModelRotation(){
        const selectedModel = this.getAppState('selectedModel');
        if(selectedModel) {
            return selectedModel.getRotation();
        }
    }

    setModelRotation(value){
        const selectedModel = this.getAppState('selectedModel');
        if(selectedModel) {
            selectedModel.setRotation(value);
        }
    }

    getModelStrokeWidth(value){
        const selectedModel = this.getAppState('selectedModel');
        if(selectedModel) {
            return selectedModel.getAttribute('linewidth');
        }
    }

    setModelStrokeWidth(value){
        const selectedModel = this.getAppState('selectedModel');
        if(selectedModel) {
            selectedModel.setAttribute('linewidth', value);
        }
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('availableEditModes', function(availableEditModes){
            self.setState({editModeDataItems: self._getEditModeDataItems(availableEditModes)});
        })
        this.setAppState('saveSVG', this.saveSVG);

        this.addAppStateListener('selectedModel', function(selectedModel){
            if(selectedModel) {
                self.setState({selectedModel: selectedModel});
            }
        });
    }


    //</editor-fold>
    //##################\\--new app state--//##################



    _getEditModeDataItems(availableEditModes){
        const editModes = availableEditModes;
        if(!editModes){
            return [];
        }
        const rval = [];
        if(Array.isArray(editModes)){
            for(let m of editModes){
                rval.push({value: m, label:m});
            }
        }else{
            for(let m in editModes){
                rval.push({value: m, label:m});
            }
        }
        return rval;
    }

    async onUpload(file){
        const text = await file.blobFile.text();
        const aobj = AObject.NewFromJSON(text);
        // this.componentHost.loadNewModel(aobj);
        // this.componentHost.callListeners({method:'loadNewModel', args:aobj});
        this.getAppState('loadNewModel')(aobj);
    }

    bindMethods() {
        super.bindMethods();
        this.setIsCreatingNewShape = this.setIsCreatingNewShape.bind(this);
        this.saveJSON = this.saveJSON.bind(this);
        this.saveSVG = this.saveSVG.bind(this);
        this.onUpload=this.onUpload.bind(this);
        this.setCurrentEditMode = this.setCurrentEditMode.bind(this);
        this.getCurrentEditMode = this.getCurrentEditMode.bind(this);
        this.getSelectedModel = this.getSelectedModel.bind(this);
        this.getModelRotation = this.getModelRotation.bind(this);
        this.setModelRotation = this.setModelRotation.bind(this);
        this.onRunScriptButtonClick = this.onRunScriptButtonClick.bind(this);
        this.onRandomShapeButtonClick = this.onRandomShapeButtonClick.bind(this);
        this.onSurpriseShapeButtonClick = this.onSurpriseShapeButtonClick.bind(this);
        this.setModelStrokeWidth = this.setModelStrokeWidth.bind(this);
        this.getModelStrokeWidth = this.getModelStrokeWidth.bind(this);
        this.getSelectedModel = this.getSelectedModel.bind(this);
    }
    render(){

        const uploaderStyles = {
            lineHeight: '15px'
        }

        return (
            <div className={"row shape-tools-stage"} key={"row" +this.constructor.name}>
                {/*<div className={""} key={"col" + this.constructor.name}>*/}
                <div className={"container atoolpanel"}>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            Fill: <AModelColorPicker model={this.state.selectedModel} attribute={'fill'}/>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            Stroke: <AModelColorPicker model={this.state.selectedModel} attribute={'stroke'}/>
                        </div>
                        <div className={"p-4 align-items-center align-self-center"}>
                            New:<Toggle onChange={this.setIsCreatingNewShape} checked={this.state.isCreatingNewShape}/>
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRunScriptButtonClick}>
                                Script
                            </button>
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onRandomShapeButtonClick}>
                                Random
                            </button>
                        </div>
                        <div className={"p-2 align-items-center align-self-center"}>
                            <button onClick = {this.onSurpriseShapeButtonClick}>
                                Surprise
                            </button>
                        </div>
                    </div>
                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            Stroke <AModelSlider model={this.state.model} min={0} max={20} getValueFromModel={this.getModelStrokeWidth} setModelValue={this.setModelStrokeWidth} step={0.1}/>
                        </div>

                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick = {this.saveJSON}>
                                SaveJSON
                            </button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <button onClick={this.saveSVG}>SaveSVG</button>
                        </div>
                        <div className={"d-inline-flex p-2 align-items-center align-self-center"}>
                            <Uploader action="//jsonplaceholder.typicode.com/posts/" draggable onUpload={this.onUpload}>
                                <div style={uploaderStyles}>Open [Risky]</div>
                            </Uploader>
                        </div>
                    </div>

                    <div className={"d-flex justify-content-start atoolpanel-row"}>
                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            <ASelectPicker
                                placeholder={"EditMode"}
                                onChange={this.setCurrentEditMode}
                                data={this.state.editModeDataItems}
                                value={this.getCurrentEditMode}
                                defaultValue={this.getCurrentEditMode()}
                            />
                        </div>

                        <div className={"d-inline-flex p-3 align-items-center align-self-center"}>
                            Rotation <AModelSlider model={this.state.selectedModel} min={-2*Math.PI} max={2*Math.PI} getValueFromModel={this.getModelRotation} setModelValue={this.setModelRotation} step={0.1}/>
                        </div>

                    </div>

                    {this.props.children}
                </div>
                {/*</div>*/}
            </div>
        )
    }
}