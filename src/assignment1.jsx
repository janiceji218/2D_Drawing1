import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import A1Component from "./components/A1Component";
import ReactDOM from "react-dom";
import "./assignment1.css";
import A1Model from "./mvc/A1Model";
import AppState from "../AniGraph/components/AppState";
import AShape2DEditorToolPanel from "../AniGraph/amvc/2d/ashape/editorcomponent/AShape2DEditorToolPanel";

export default function Assignment1() {
    const appState = new AppState({model: new A1Model()});
    const app = (
        <div className={"container"}>
            <div className={"row"}>
                <AShape2DEditorToolPanel appState={appState}
                                         key={'basic-shape-editor-panel'}>
                </AShape2DEditorToolPanel>

            </div>
            <div className={"row"}>
            <A1Component appState={appState}/>
            </div>
        </div>
    );
    ReactDOM.render(app,
        document.querySelector('#main')
    );
}
Assignment1();