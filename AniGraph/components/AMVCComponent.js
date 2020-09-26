import React from "react";
import AController from "../amvc/base/mvc/AController";
import AView from "../amvc/base/mvc/AView";
import AModel from "../amvc/base/mvc/AModel";
// import JSONTree from 'react-json-tree';
import AComponent from "./AComponent";

export default class AMVCComponent extends AComponent{
    static ComponentControllerClass = AController;
    static SupplementalControllerClasses = {};
    static ModelClassMap = {
        default: {
            controllerClass: AController,
            viewClass: AView,
            modelClass: AModel
        }
    };

    get modelClassMap(){return this.constructor.ModelClassMap;}

    getDefaultModelClass(){
        return this.constructor.ModelClassMap.default.modelClass;
    }

    constructor(props) {
        super(props);
        if(this.state===undefined){this.state = {};}

    }
    initComponent(props){
        super.initComponent(props);
        this._initDefaultControllers(props);
    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.setAppState('loadNewModel', function(model){
            self.loadNewModel(model);
        });
    }

    loadNewModel(model){
        this.reset();
        // this.setState(this.getDefaultState());
        // this.initComponent({model:model});
        // this.componentDidMount();
        this.componentController.getModel().addChild(model);
        model.reAddDescendants();
        this.model.notifyPropertySet();
    }

    _createNewComponentController(){
        return new this.componentControllerClass({
            model:this.getModel(),
            component:this,
            modelClassMap: this.modelClassMap
        })
    }

    /**
     * Creates controllers
     * @param props
     */
    _initDefaultControllers(props){
        if(this.controllers && this.controllers!=={}){
            return;
        }
        this.controllers = {};
        this._componentControllerClass = (props && props.ComponentControllerClass)? props.ComponentControllerClass : this.constructor.ComponentControllerClass;
        this.setComponentController(this._createNewComponentController());
        this._supplementalControllerClasses=(props && props.SupplementalControllerClasses)? props.SupplementalControllerClasses : this.constructor.SupplementalControllerClasses;
        for (let supCName in this.supplementalControllerClasses) {
            var newC = new this.supplementalControllerClasses[supCName]({component: this});
            this.setController(supCName, newC);
        }
    };


    /**
     * Where initial set of controllers should be activated. Will be called once component mounts and context is created.
     * @param args
     */
    startControllers(args){
        for(let newC of this.getControllersList()) {
            if (newC.isSupplementalComponentController) {
                newC.attachToController(this.componentController);
            }
        }
    }

    release(args){
        // for(let c of this.getControllersList()){
        //     c.detachSelectionControllers()
        //
        // }
        super.release(args);
        // this.controllers = {};
        // this._initDefaultControllers(this.props);
    }

    reset(){
        const supc = this.getSupplementalModelControllers();
        for(let c of supc){
            // this.removeController(c);
            c.detach();
        }
    }


    //##################//--Initialization and defaults--\\##################
    //<editor-fold desc="Initialization and defaults">

    /**
     * Set the data model. This will be the root model for the application.
     * If the data model is hierarchical, then it may have children.
     * @param model
     */
    setModelAndListen(model, listen=true){
        super.setModelAndListen(model, listen);
    }

    componentDidMount(){
        // const context = this.getGraphicsContext();
        // context.appendTo(this.getStage());
        super.componentDidMount();
        this.componentController.onDidMount();
        this.startControllers();
        // this.update();
    }
    //</editor-fold>
    //##################\\--Initialization and defaults--//##################

    //##################//--Controllers--\\##################
    //<editor-fold desc="Controllers">
    /**
     * [root controller class] setter
     * @param componentControllerClass Value to set root controller class
     * @param update Whether or not to update listeners
     */
    get componentControllerClass(){
        if(this.getComponentController()){
            return this.getComponentController().constructor;
        }else {
            return this._componentControllerClass;
        }
    }

    /** Get set supplementalControllerClasses */
    get supplementalControllerClasses(){return this._supplementalControllerClasses;}

    getControllersList(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){return self._controllers[k]});
    }

    getSupplementalComponentControllers(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){
            if(self.controllers[k].isSupplementalComponentController){
                return self._controllers[k]
            }
        });
    }

    getSupplementalModelControllers(){
        const self = this;
        return Object.keys(this._controllers).map(function(k){
            let controller = self.controllers[k];
            if(controller.isSupplementalController && !controller.isSupplementalComponentController){
                return self._controllers[k]
            }
        }).filter(c=>{return c;});
    }


    /** Get set controllers */
    set controllers(value){this._controllers = value;}
    get controllers(){return this._controllers;}

    getController(name){return this._controllers[name];}
    setController(name, controller){
        this._controllers[name]=controller;
        controller.component = this;
        controller.keyInComponent = name;
    }
    removeController(c){
        if(c){
            var key = c.keyInComponent ? c.keyInComponent : c;
            var controller= this.controllers[key];
            controller.deactivate();
            if(controller.isSupplementalController){
                controller.detach();
            }
            delete this.controllers[key];
        }
    }
    setComponentController(controller){this.setController('component', controller);}
    getComponentController(){return this.componentController;}
    get componentController(){return this.getController('component');}

    // addController(name, controller){this.getControllers().push(controller);}
    getControllers(){return this._controllers;}
    setControllers(controllers){
        for(let name of controllers){
            this.setController(name, controllers[name]);
        }
    }

    //</editor-fold>
    //##################\\--Controllers--//##################

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
    //</editor-fold>
    //##################\\--Update functions--//##################


}
