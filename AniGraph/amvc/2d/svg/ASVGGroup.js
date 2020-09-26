import {ASVGElement} from "./ASVGElement";


export default class ASVGGroup extends ASVGElement{
    add(elem){
        this.addChild(elem);
        this.getTwoJSObject().add(elem.getTwoJSObject());
        // this.getTwoJSObject().add(...arguments);
    }

    remove(elem){
        this.removeChild(elem);
    }

    removeChild(child){
        this.getTwoJSObject().remove(child.getTwoJSObject());
        super.removeChild(child);
    }
}