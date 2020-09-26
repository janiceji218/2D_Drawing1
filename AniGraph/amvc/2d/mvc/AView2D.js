import AView from "../../base/mvc/AView";
import {Vec2} from "../../../math/Vector";

export default class AView2D extends AView{
    constructor(args){
        super(args);
    }

    getGroup(){return this.group;}
    setGroup(group){this.group = group;}

    addGraphic(graphic){
        super.addGraphic(graphic);
        graphic.addToGroup(this.getGroup());
    }

    initGraphics(){
        super.initGraphics();
        const context = this.getGraphicsContext();
        this.setGroup(context.makeGroup());
        this.updateGroup();
    }

    hideGraphics(){
        for(let graphic in this.getGraphics()){
            graphic.removeFromParentGroup();
        }
    }

    showGraphics(){
        for(let graphic in this.getGraphics()){
            if(graphic.getParent()===undefined){
                this.getGroup().add(graphic);
            }
        }
    }

    updateGroup(){
        // To be implemented after assignment 1
    }

    updateGraphics(){
        this.getGraphicsContext().update();
    }

    onModelUpdate(){
        const rval = super.onModelUpdate()
        this.updateGroup();
        this.updateGraphics();
        return rval;
    }
}
