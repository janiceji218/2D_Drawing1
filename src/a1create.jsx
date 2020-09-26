import 'bootstrap/dist/css/bootstrap.min.css';
import React from "react";
import A1Component from "./components/A1Component";
import ReactDOM from "react-dom";
import "./assignment1.css"
import A1Model from "./mvc/A1Model";
import A1CreativeComponent from "./creative/A1CreativeComponent";
import AShape2DEditorToolPanel from "../AniGraph/amvc/2d/ashape/editorcomponent/AShape2DEditorToolPanel";
import AppState from "../AniGraph/components/AppState";
import A1CreativeToolPanel from "./creative/A1CreativeToolPanel";

export default function Assignment1Creative() {
    const appState = new AppState({model: new A1Model()});
    const colwidth = 800;
    const panelheight=200;
    const app = (
        <div className={"container"}>
            <div className={"d-flex flex-row justify-content-start"}>
                {/*<div className={"d-flex justify-content-start"}>*/}
                <div className={"col-6"}>
                <AShape2DEditorToolPanel appState={appState}
                                         key={'basic-shape-editor-panel'}
                                         style={{
                                             height: colwidth,
                                             width: panelheight
                                         }}
                />
                </div>
                {/*</div>*/}
                {/*<div className={"d-flex justify-content-start"}>*/}
                <div className={"col-6"}>
                <A1CreativeToolPanel appState={appState}
                                         key={'creative-view-panel'}
                                     style={{
                                         height: colwidth,
                                         width: panelheight
                                     }}
                />
                </div>
                {/*</div>*/}
            </div>
            <div className={"d-flex justify-content-center"}>
                <A1Component appState={appState}/>
                <A1CreativeComponent appState={appState}/>
            </div>
        </div>
    );
    ReactDOM.render(app,
        document.querySelector('#main')
    );
}
Assignment1Creative();