import AGraphicsComponent2D from "../../../../components/AGraphicsComponent2D";
import AShape2DVertexEditController from "../supplementals/AShape2DVertexEditController";
import React from "react";
import AShape2DEditorToolPanel from "./AShape2DEditorToolPanel";
import AShape2DCreateByVerticesController from "../supplementals/AShape2DCreateByVerticesController";
import ABackgroundClickController from "../../supplementals/controllers/ABackgroundClickController";
import AShape2DDragOriginController from "../supplementals/AShape2DDragOriginController";
import AComponentController2D from "../../components/AComponentController2D";
import AShape2DController from "../mvc/AShape2DController";
import AShape2DView from "../mvc/AShape2DView";
import AModel2D from "../../mvc/AModel2D";

export default class AShape2DEditorComponent extends AGraphicsComponent2D {
    static ModelClassMap = {
        default: {
            controllerClass: AShape2DController,
            viewClass: AShape2DView,
            modelClass: AModel2D
        }
    };
    static ComponentControllerClass = AComponentController2D;
    static SupplementalControllerClasses = {
        backgroundClick: ABackgroundClickController,
        createByVertices: AShape2DCreateByVerticesController,
        editVertices: AShape2DVertexEditController,
        dragTranslation: AShape2DDragOriginController
    };
    get backgroundClickController(){return this.getController('backgroundClick')}
    get currentSelectionModeControllers(){return this._currentSelectionModeControllers;}
    set currentSelectionModeControllers(value){this._currentSelectionModeControllers = value;}
    set createShapeControllers(value){this._createShapeControllers = value;}
    get createShapeControllers(){return this._createShapeControllers;}

    /** Get set saveSVG */
    set saveSVG(value){this._saveSVG = value;}
    get saveSVG(){return this._saveSVG ? this._saveSVG : this._saveContextSVG;}

    get shapeSelectionEnabled(){return !this.createShapeControllers[0].isActive;}

    get newModelClass(){return this._newModelClass;}

    /** Get set itemBeingCreated */
    set itemBeingCreated(value){this._itemBeingCreated = value;}
    get itemBeingCreated(){return this._itemBeingCreated;}

    /**
     * Default state related to model selection. Whenever this state changes, the React component will re-render, which
     * will cause the tool panel to update (to show and allow control of the selected shape's properties and attributes).
     */
    getDefaultState() {
        return Object.assign(super.getDefaultState(), {
            isCreatingNewShape: false,
            selectedModel: undefined,
        });
    }

    //##################//--App State--\\##################
    //<editor-fold desc="App State">
    setSelectedModel(value){
        this.setAppState('selectedModel', value);
    }
    /**
     * The editor app has state indicating whether the user is currently creating a new shape.
     * @returns {boolean}
     */
    getIsCreatingNewShape() {
        // return this.state.isCreatingNewShape;
        return this.getAppState('isCreatingShape');
    }
    /**
     * Set the app state that indicates whether the user is about to create a new shape.
     * @param value
     */
    setIsCreatingNewShape(value) {
        this.setAppState('isCreatingNewShape', value);

    }

    initAppState(){
        super.initAppState();
        const self = this;
        this.addAppStateListener('isCreatingNewShape', function(isCreatingNewShape){
            self.toggleCreateNewShape(isCreatingNewShape);
        })
        this.setAppState('saveSVG', this.saveSVG);
    }

    //</editor-fold>
    //##################\\--App State--//##################


    bindMethods() {
        super.bindMethods();
        this._saveContextSVG = this._saveContextSVG.bind(this);
    }

    //<editor-fold desc="Controllers">
    /**
     * Gets called after component mounts. Also calls initSupplemental____Controllers();
     * @param args
     */
    startControllers(args){
        super.startControllers(args);
        this.backgroundClickController.activate();
        this.createShapeControllers = [this.getController('createByVertices')];
        this.currentSelectionModeControllers = [];
        this.initSupplementalComponentControllers();
        this.initSupplementalSelectionControllers();
    }

    initSupplementalComponentControllers(){
        this.setNewModelClass();
    }

    initSupplementalSelectionControllers(){
        this.currentSelectionModeControllers = [
            this.getController('editVertices'),
            this.getController('dragTranslation')
        ];
    }
    //</editor-fold>

    //<editor-fold desc="Save SVG">
    /**
     * Save the svg corresponding to this component.
     * This function is private; the public saveSVG can be set to this or to
     * a function provided in props.
     * @private
     */
    _saveContextSVG(){
        this.getGraphicsContext().saveSVG();
    }
    //</editor-fold>

    //##################//--Shape Selection--\\##################
    //<editor-fold desc="Shape Selection">
    /**
     * User clicks on the graphics context. Generally, this should deselect an object.
     * @param args
     */
    handleContextClick(args){
        if(this.shapeSelectionEnabled) {
            this.selectShape(args);
        }
    }

    attachSelectionControllers(selectedController){
        this.currentSelectionModeControllers.map(c=>{
            c.attachToController(selectedController);
            c.activate();
        })
    }
    detachSelectionControllers(){
        this.currentSelectionModeControllers.map(c=>{
            if(c.isActive) {
                c.detach();
            }
        });
    }
    /**
     * This function handles everything that needs to happen when a shape is selected.
     * @param args - a dictionary. 'controller' key should be the controller for whatever shape is being selected.
     */
    selectShape(args) {
        const selectedController = (args && args.controller) ? args.controller : undefined;
        if (selectedController && (selectedController!==this.componentController)) {
            this.attachSelectionControllers(selectedController);
            this.setSelectedModel(selectedController.getModel());
        } else {
           this.detachSelectionControllers();
           this.setSelectedModel(undefined);
        }
        this.updateGraphics();
    }
    //</editor-fold>
    //##################\\--Shape Selection--//##################

    mapOverChildren(fn){
        var rvals = [];
        for(let child of this.getChildrenList()){
            rvals.push(fn(child));
        }
        return rvals;
    }

    //##################//--Shape Creation--\\##################
    //<editor-fold desc="Shape Creation">
    setNewModelClass(newModelClass){
        this._newModelClass = newModelClass? newModelClass : this.constructor.ModelClassMap.default.modelClass;
        this.createShapeControllers.map(c=>{
            c.newModelClass = newModelClass;
        })

    }

    activateCreateShapeControllers(selectedController){
        this.createShapeControllers.map(c=>{
            c.newModelClass = this.newModelClass;
            c.activate();
        })
    }
    deactivateCreateShapeControllers(){
        this.createShapeControllers.map(c=>{
            c.deactivate();
        });
    }

    /**
     * This function handles transition from creating a new shape to editing existing shapes.
     * Note that the associated state is updated at the end of the function.
     * @param value
     */
    toggleCreateNewShape(value) {
        var newValue = value;
        // if (newValue === undefined) {
        //     newValue = !this.getIsCreatingNewShapeAppState();
        // }
        const contextElement = this.componentController.getContextElement();
        if (value) {
            // We ARE creating a new shape
            this.detachSelectionControllers();
            this.activateCreateShapeControllers();
            contextElement.setStyle('cursor', 'crosshair');
        } else {
            // We are NOT creating a new shape
            this.deactivateCreateShapeControllers();
            contextElement.setStyle('cursor', 'default');
            this.itemBeingCreated = undefined;
        }
        // this.setIsCreatingNewShape(!!newValue);
    }


    //</editor-fold>
    //##################\\--Shape Creation--//##################

    // renderToolPanels(){
    //     return [(<AShape2DEditorToolPanel componentHost={this}
    //                                       selectedModel={this.state.selectedModel}
    //                                       isCreatingNewShape={this.state.isCreatingNewShape}
    //                                       key={'basic-shape-editor-panel'}
    //     />)];
    // }

    //##################//--Rendering the React Component--\\##################
    //<editor-fold desc="Rendering the React Component">
    /**
     * Tells React how to render the component. This is written in JSX, which reads much like HTML.
     * If you want to know more [React docs](https://reactjs.org/docs/getting-started.html).
     * @returns {JSX.Element}
     */
    render() {
        // const toolPanels = this.renderToolPanels();

        return (

                    // <div className={"col-6"}>
                    <div className={"d-flex justify-content-start"}>
                        {super.render()}
                    </div>
        )
    }

    //</editor-fold>
    //##################\\--Rendering the React Component--//##################
}
