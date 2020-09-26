import ASupplementalController2D from "../../supplementals/controllers/ASupplementalController2D";
import AShape2DBoundingBoxView from "./AShape2DBoundingBoxView";


export default class AShape2DBoundingBoxController extends ASupplementalController2D{
    static ViewClass = AShape2DBoundingBoxView;
    createView(){
        super.createView();
        if(this.getView()) {
            this.addInteractionsToView(this.getView());
        }
    }


    getAnchorWorldCoordinates(){
        return this.getModel().getOrigin();
    }

    getBoundingBoxCorners(){
        return this.getModel().getWorldSpaceBBoxCorners();
    }

    addInteractionsToView(){
        for (let h of this.getView().handles) {
            this.addInteractionsToHandle(h);
        }
        this.addInteractionsToBox(this.getView().box);
        this.addInteractionsToAnchor(this.getView().anchor);
    }

    addInteractionsToHandle(handle){
        const clickInteraction = handle.createInteraction('click-element');
        this.addInteraction(clickInteraction);
        clickInteraction.addEventListener('click', function(event){
            event.preventDefault();
            if(!clickInteraction.elementIsTarget(event)){return;}
            console.log("Whoa! You clicked a handle!");
        });
        return clickInteraction;
    }
    addInteractionsToBox(box){
        const clickInteraction = box.createInteraction('click-element');
        this.addInteraction(clickInteraction);
        clickInteraction.addEventListener('click', function(event){
            event.preventDefault();
            if(!clickInteraction.elementIsTarget(event)){return;}
            console.log("Great, you clicked the box---now can you think OUTSIDE OF IT? (Whoa!)");
        });
        return clickInteraction;
    }
    addInteractionsToAnchor(anchor){
        const clickInteraction = anchor.createInteraction('click-element');
        this.addInteraction(clickInteraction);
        clickInteraction.addEventListener('click', function(event){
            event.preventDefault();
            if(!clickInteraction.elementIsTarget(event)){return;}
            console.log("ANCHORS AWAY!");
        });
        return clickInteraction;
    }

    onModelUpdate(args) {
        super.onModelUpdate();
    }
}