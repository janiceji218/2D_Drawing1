import React from "react";
import AController from "../amvc/base/mvc/AController";
import AModel from "../amvc/base/mvc/AModel";
// import JSONTree from 'react-json-tree';
import {ModelListener} from "../amvc/base/mvc/AModelListener";
import "./styles/AGraphicsComponent.css"
import AppState from "./AppState";

@ModelListener()
export default class AComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = Object.assign(this.getDefaultState(), this.state);

        //<editor-fold desc="appState">
        if(props && props.appState) {
            this.setAppStateObject(props.appState);
        }

        // this.initAppState(props);
        //</editor-fold>

        this.bindMethods();
        this.initAppState(props);
        this.initComponent(props);



        //Bind callback methods.

    }


    /**
     * This function will be run in the constructor, and potentially re-run if the component is reset
     * This may happen, for example, if the component is given a new model.
     * @param props
     */
    initComponent(props){
        //set the data model if it is provided as an argument
        var model = undefined;
        if(props!==undefined && props.model!==undefined){
            model = props.model;
        }
        model = model? model: (this.getAppStateObject()? this.getAppState('model') : undefined);
        this.setModelAndListen(model);
    }

    // initAppState(props){
        //initialize app state
    // }

    initAppState(){
        this._aEventCallbackSwitches = {};
    }

    /**
     * Setting app state will set the component's state AND the appState State...
     * @param name
     * @param value
     * @param update
     */
    setAppState(name, value, update=true, setReactState=true){
        // const passDict = {};
        // passDict[name]=value;
        this.getAppStateObject().setState(name, value, update);
        // this.update();
        if(setReactState) {
            if(!this.hasMounted){
                this.state[name]=value;
            }else {
                const stateDict = {};
                stateDict[name] = value;
                this.setState(stateDict);
            }
        }
    }

    getAppState(name){
        return this.getAppStateObject().getState(name)
    }

    setAppStateObject(appState){
        this.state.appState = appState;
        if(this.state.appState) {
            this.state.appState.setListener(this);
        }
    }

    getAppStateObject(){
        return this.state.appState;
    }

    onAppStateUpdate(args){
        // Nothing right now
    }

    addAppStateListener(stateName, callback, handle){
        const switchHandle = handle? handle : stateName;
        this._addAEvenetCallbackSwitch(
            switchHandle,
            this.getAppStateObject().addAEventListener(
                AppState.GetStateListenerEventName(stateName),
                callback
            )
        );
    }

    addAppEventListener(eventName, callback, handle){
        const switchHandle = handle? handle : eventName;
        this._addAEvenetCallbackSwitch(
            switchHandle,
            this.getAppStateObject().addAEventListener(
                eventName,
                callback
            )
        );
    }

    _addAEvenetCallbackSwitch(handle, callbackSwitch){
        if(this._aEventCallbackSwitches[handle] !== undefined){
            console.assert(false, {message: `Handle ${handle} already used for AEvent callback`, component: this});
            this._aEventCallbackSwitches[handle].deactivate();
        }
        this._aEventCallbackSwitches[handle]=callbackSwitch;
    }

    release(args){
    }

    get hasMounted(){
        return this._hasMounted;
    }

    get cssClassName(){
        return "acomp-"+this.constructor.name;
    }

    //##################//--Initialization and defaults--\\##################
    //<editor-fold desc="Initialization and defaults">
    /** Get set model */
    set model(value){this.state.model = value;}
    get model(){return this.state.model;}
    /**
     * Set the data model. This will be the root model for the application.
     * If the data model is hierarchical, then it may have children.
     * @param model
     */
    setModelAndListen(model, listen=true){
        this.model = model;
        if(model && listen) {
            this.listen();
        }
    }

    getModel(){
        return this.model;
    }

    getModelSummary(){
        return this.getModel().getSummary();
    }

    reset(args){

    }

    // loadNewModel(model){
    //     this.reset();
    //     // this.setState(this.getDefaultState());
    //     this.initComponent({model:model});
    //     this.componentDidMount();
    //     this.model.notifyPropertySet();
    // }


    bindMethods(){
        this.saveJSON = this.saveJSON.bind(this);
        this.saveModelToJSON = this.saveModelToJSON.bind(this);
    }

    getDefaultState(){
        return {
            model : undefined,
            width: 800,
            height: 500
        };
    }

    componentDidMount(){
        this._hasMounted = true;
    }
    //</editor-fold>
    //##################\\--Initialization and defaults--//##################


    //##################//--Update functions--\\##################
    //<editor-fold desc="Update functions">
    update(){
        var d = Date.now();
        this.setState(() => ({
            time: d,
            // modelSummary: this.getModelSummary()
        }));
    }
    startTimer(){
        if(this.timerID === null) {
            this.timerID = setInterval(
                () => this.tick(),
                1000
            );
        }
    }
    stopTimer(){
        if(this.timerID !== null) {
            clearInterval(this.timerID);
            this.timerID = null;
        }
    }
    tick(){
        this.update();
    }
    // resize(){
    //     this.setState({
    //         right: this.two.width,
    //         bottom: this.two.height
    //     });
    // }

    //</editor-fold>
    //##################\\--Update functions--//##################


    //##################//--saving/loading--\\##################
    //<editor-fold desc="saving/loading">
    saveJSON(){
        this.model.saveJSON();
    }

    saveModelToJSON(){
        this.model.saveJSON();
    }
    //</editor-fold>
    //##################\\--saving/loading--//##################



    //##################//--ReactComponent Functions--\\##################
    //<editor-fold desc="ReactComponent Functions">
    // componentWillUnmount(){
    // }
    // componentDidUpdate(prevProps, prevState){
    // }

    render(){
        return (
            <div className={'acomponent-parent-container'}>
                <div
                    className={"acomponent "+this.cssClassName}
                    ref={el => {this.setStage(el);}}
                    style={{
                        height: this.state.height,
                        width: this.state.width
                    }}
                />
                {/*<JSONTree data={this.state.modelSummary}/>*/}
            </div>
        );
    }
    //</editor-fold>
    //##################\\--ReactComponent Functions--//##################

    onModelUpdate(args){
        if(args && args.type && args.type=='call'){
            if(this[args.method]){
                this[args.method](args.args);
            }
        }
    }

}
