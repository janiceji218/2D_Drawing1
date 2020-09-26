import AController2D from "../mvc/AController2D";
import AView2D from "../mvc/AView2D";


export default class AComponentController2D extends AController2D{
    activate(args){
        super.activate(args);
    }

    getViewGroup(){
        return this.getComponent().getRootGraphicsGroup();
    }
}