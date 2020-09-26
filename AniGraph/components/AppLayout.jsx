import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery'
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import React from "react";
import {ModelListener} from "../amvc/base/mvc/AModelListener";

@ModelListener()
export default class AppLayout extends React.Component{
    constructor(props){
        super(props);
        this._initBlank();
        if(props!==undefined){
            this.setModel(props.model);
            this.setComponents(props.components);
        }else{
            throw new Error("Must provide model and components to AppLayout");
        }
        this.bindMethods();
    }
    _initBlank(){
        this.components = {};
        this.state = {};
    }
    setModel(model, listen){
        this.state.model = model;
        if (this.getModel() !== undefined && listen) {
            this.listen();
        }
    }
    getModel(){return this.state.model;}

    onModelUpdate(args){
        console.log("layout model update:");
        console.log(args);
    }
    bindMethods(){
        this.saveJSON = this.saveJSON.bind(this);
        // this.getCSSClassName = this.getCSSClassName.bind(this);
    }

    /**
    * [components] setter
    * @param components Value to set components
    * @param update Whether or not to update listeners
    */
    setComponents(components){
        for(let componentname in components){
            this.setComponent(componentname, components[componentname]);
        }
    }
    setComponent(name, component){
        this.components[name]=component;
    }
    getComponents(){return this.components;}
    getComponent(name){return this.components[name];}
    //##################//--saving/loading--\\##################
    //<editor-fold desc="saving/loading">
    saveJSON(){
        this.getModel().saveJSON();
    }
    //</editor-fold>
    //##################\\--saving/loading--//##################

    render(){
        return (
            <div className={"container"}>
                <div className={"row"}>
                    <div className={"col-6"}>
                        {this.props.children}
                        {this.getComponent('main')}
                        <button onClick = {this.saveJSON}>
                            Save JSON
                        </button>
                        {/*<JSONTree data={this.state.modelSummary}/>*/}
                    </div>
                </div>
            </div>
        );
    }
}