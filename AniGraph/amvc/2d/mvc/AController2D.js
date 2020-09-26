import AController from "../../base/mvc/AController";

export default class AController2D extends AController{
    createChildWithArgs(args){
        const child = super.createChildWithArgs(args);
        child.getViewGroup().addToGroup(this.getViewGroup());
        if(this.isActive) {
            child.activate();
        }
    }

    onViewUpdate() {
        super.onViewUpdate();
        this.getComponent().updateGraphics();
    }
}