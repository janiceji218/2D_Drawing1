import AController2D from "../../mvc/AController2D";



export default class ASupplementalController2D extends AController2D{
    static ViewClass = null;
    constructor(args) {
        super(args);
    }

    release(args){
        this.detach();
        super.release(args);
    }

    //TODO instead of setting model when attaching, just have getter that accesses it through hostController

    get isSupplementalController(){return true;}
    get isComponentSupplementalController(){return false;}
    /** Get set hostController */
    set hostController(value){this._hostController = value;}
    get hostController(){return this._hostController;}

    getHostController(){
        return this.hostController;
    }

    get isAttached(){return !!this.hostController;}

    getViewClass(){
        return this.constructor.ViewClass;
    }

    createView(){
        if(this.getViewClass() && this.hostController) {
            const newView = new (this.getViewClass())({controller: this});
            this.setView(newView);
            this.getView().initGraphics();
            this.getView().onModelUpdate();
        }
    }

    attachToController(controller){
        if(this.hostController) {
            this.detach();
        }
        this.hostController = controller;
        this.hostController.addSupplementalController(this);
        this.initInteractions();
        this.createView();
        if(this.getView()) {
            this.hostController.getViewGroup().add(this.getViewGroup());
        }
        // if(this.getView()) {
        //     this.getView().onModelUpdate();
        // }
    }

    activate(args){
        super.activate(args);
        if(this.getModel()) {
            this.onModelUpdate();
        }
    }
    /**
     * Add the interactions
     * @param args
     */
    initInteractions(args) {
        super.initInteractions(args);
        this.initHostInteractions(args);
    }

    /**
     * Initializat any of the supplemental controller's interactions that belong on the host view or elements
     */
    initHostInteractions(){

    }

    detach(){
        this.deactivate();
        const host = this.hostController;
        // this.getView().getGroup().removeFromParentGroup();
        this.releaseAllInteractions();
        if(this.getView() && this.getViewClass()){
            console.assert(this.getView().getController()===this, "RELEASING ANOTHER CONTROLLER'S VIEW!");
            this.getView().release();
            this.setView();
        }
        if(host){
            host.removeSupplementalController(this);
            this.hostController = undefined;
            host.getComponent().updateGraphics();
        }
    }

    onModelUpdate(args){
        const self = this;
        function defaultResponse(){
            // Only update view if we own it...
            if(self.getViewClass() && self.getView()){
                self.getView().onModelUpdate(args);
            }
            return true;
        }
        return defaultResponse();
        // function unanticipatedUpdate(){
        //     console.warn("Did not know what to do for onModelUpdate for: "+args.type);
        // }

        // switch (args.type){
        //     // case 'addChild':
        //     case 'childUpdated':
        //         return defaultResponse();
        //         break;
        //     case 'setProperties':
        //         return defaultResponse();
        //         break;
        //     case "setAttributes":
        //         return defaultResponse();
        //         break;
        //     default:
        //         return unanticipatedUpdate();
        // }

    }

}