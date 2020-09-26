import {Toggle} from 'rsuite'
import AGUIComponent from "./AGUIComponent";
import AGUIModelWidget from "./AGUIModelWidget";
import reactCSS from 'reactcss'
import React from "react";
import 'rsuite/dist/styles/rsuite-default.css';

export default class AToggle extends AGUIModelWidget{
    render(){
        return (
            <React.Fragment>
                <Toggle
                    onChange={this.handleChange}
                    checked={this.state.value}
                    size = {this.state.size}
                    disabled={this.state.disabled}
                />
            </React.Fragment>
        );
    }
}