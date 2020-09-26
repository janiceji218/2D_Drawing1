import React from "react"
import AGUIComponent from "./AGUIComponent";

export default class AToolPanelComponent extends AGUIComponent{

    constructor(props){
        super(props);
    }

    bindMethods() {
        super.bindMethods();
    }
    render(){
        return (
            <div className={"container atoolpanel"}>
                {this.props.children}
            </div>
        )
    }
}