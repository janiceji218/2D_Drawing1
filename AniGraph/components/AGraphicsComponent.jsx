import React from "react";
import AController from "../amvc/base/mvc/AController";
import AModel from "../amvc/base/mvc/AModel";
// import JSONTree from 'react-json-tree';
import {ModelListener} from "../amvc/base/mvc/AModelListener";
import "./styles/AGraphicsComponent.css"
import AWebElement from "../amvc/base/webelements/AWebElement";
import AComponent from "./AComponent";
import AGraphicsContext2D from "../amvc/2d/contexts/AGraphicsContext2D";
import AGraphicsContext from "../contexts/AGraphicsContext";
import AMVCComponent from "./AMVCComponent";

export default class AGraphicsComponent extends AMVCComponent{
    static ComponentControllerClass = AController;
    static GraphicsContextClass = AGraphicsContext;
    static SupplementalControllerClasses = {};

    constructor(props) {
        super(props);
    }
    initComponent(props){
        if(this.state===undefined){this.state = {};}
        if(props && props.width!==undefined){this.state.width = props.width;}
        if(props && props.height!==undefined){this.state.height = props.height;}
        this.initGraphicsContext();
        super.initComponent(props);

    }

    release(args){
        // for(let c of this.getControllersList()){
        //     c.release();
        // }
        super.release(args);
        // this.controllers = {};
    }


    /**
     * DOM Element containing component
     * @param stage Value to set stage
     * @param update Whether or not to update listeners
     */
    setStage(stage){
        this._stage = stage;
        const stageElement = new AWebElement();
        stageElement.setDOMItem(this.getStage());
        this.setStageElement(stageElement);
    }
    getStage(){return this._stage;}

    /**
    * [Stage Element] setter
    * @param stageElement Value to set Stage Graphic
    * @param update Whether or not to update listeners
    */
    setStageElement(stageElement){this._stageElement = stageElement;}
    getStageElement(){return this._stageElement;}

    //##################//--Initialization and defaults--\\##################
    //<editor-fold desc="Initialization and defaults">

    getDefaultState(){
        return Object.assign({
            width: 500,
            height: 500
        }, super.getDefaultState());
    }

    componentDidMount(){
        const context = this.getGraphicsContext();
        context.appendTo(this.getStage());
        super.componentDidMount();
        this.update();
    }
    //</editor-fold>
    //##################\\--Initialization and defaults--//##################


    //##################//--Graphics Context--\\##################
    //<editor-fold desc="Graphics Context">
    /**
     * [graphics context] setter
     * @param graphicsContext Value to set graphics context
     * @param update Whether or not to update listeners
     */
    setGraphicsContext(graphicsContext){this._graphicsContext = graphicsContext;}
    getGraphicsContext(){return this._graphicsContext;}

    _getContextArgs(args){
        if(args===undefined){args = {};}
        args.width = args.width? args.width : this.state.width;
        args.height = args.height? args.height : this.state.height;
        return args;
    }

    initGraphicsContext(){
        if(this.getGraphicsContext()===undefined){
            this.setGraphicsContext(new this.constructor.GraphicsContextClass(this._getContextArgs()));
            this.setRootGraphicsGroup(this.getGraphicsContext().makeGroup());
        }
    }

    setRootGraphicsGroup(rootGraphicsGroup){this._rootGraphicsGroup = rootGraphicsGroup;}
    getRootGraphicsGroup(){return this._rootGraphicsGroup;}

    updateGraphics(){
        this.getGraphicsContext().update();
    }

    //</editor-fold>
    //##################\\--Graphics Context--//##################

    //##################//--Update functions--\\##################
    //<editor-fold desc="Update functions">
    update(){
        var d = Date.now();
        this.setState(() => ({
            time: d,
            // modelSummary: this.getModelSummary()
        }));
    }
    // resize(){
    //     this.setState({
    //         right: this.two.width,
    //         bottom: this.two.height
    //     });
    // }

    //</editor-fold>
    //##################\\--Update functions--//##################



    //##################//--ReactComponent Functions--\\##################
    //<editor-fold desc="ReactComponent Functions">
    componentDidUpdate(prevProps, prevState){
        this.updateGraphics();
    }

    render(){

        // return (
        //     <div
        //         className={"acomponent "+this.cssClassName}
        //         ref={el => {this.setStage(el);}}
        //     />
        // );
        return (
                <div
                    className={"acomponent "+this.cssClassName}
                    ref={el => {this.setStage(el);}}
                    style={{
                        height: this.state.height,
                        width: this.state.width
                    }}
                />
        );
    }
    //</editor-fold>
    //##################\\--ReactComponent Functions--//##################



}
