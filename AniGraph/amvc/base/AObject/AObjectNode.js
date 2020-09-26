import AObject, {AObjectClass} from './AObject';
import {v4 as uuidv4} from "uuid";
import {Vec2, Vec3} from "../../../math/Vector";
import Matrix3x3 from "../../../math/Matrix3x3";


export default class AObjectNode extends AObject {



    constructor(args) {
        super(args);
        let children = (args && args.children) ? args.children : undefined;
        let parent = (args && args.parent) ? args.parent : undefined;
        this._initChildren(children);
        this.setParent(parent);
    }

    releaseChildren(args){
        if(this.getChildren()!==undefined){
            this.mapOverChildren((child)=>{child.release(args);});
        }
    }

    release(args){
        this.releaseChildren()
        if(this.getParent()!==undefined){
            this.getParent().removeChild(this);
        }
        super.release(args);
    }

    initTempState(){
        super.initTempState();
        this.setParent();
    }

    afterLoadFromJSON(args){
        super.afterLoadFromJSON(args);
        this.notifyDescendantsAdded();
    }

    // /**
    //  * Re-Add just the children. This will trigger updates that respond to their addition. Mainly used when loading from JSON.
    //  */
    // reAddChildren(){
    //     this.mapOverChildren(c=>{
    //         this.addChild(c);
    //     });
    // }

    notifyDescendantsAdded(){
        const self = this;
        this.mapOverChildren(c=> {
            self.notifyListeners({
                type: 'addChild',
                childModel: c
            })
        });
    }

    /**
     * Re-Add all descendants from root to leaf. Generally to trigger updates that respond to their addition.
     * Mainly used when adding a hierarchy to another hierarchy.
     */
    reAddDescendants(){
        this.mapOverChildren(c=>{
            this.addChild(c);
            c.reAddDescendants();
        });
    }

    addChildGraph(child){
        this.addChild(child);
        this.reAddDescendants();
    }

    _initChildren(children){
        this.setChildren(children);
        if(this.getChildren()===undefined){
            this.setChildren({});
        }
    }
    getChildren(){return this._children;}
    getChildrenList(){
        const self = this;
        return Object.keys(this._children).map(function(k){return self._children[k]});
    }
    setChildren(children){
        if(children===undefined){
            this._children = {};
        }
        if(Array.isArray(children)){
            this._children = {};
            for(let child in children){
                this.addChild(child);
            }
        }else{
            this._children = children;
        }
    }
    setParent(parent){this._tempState._parent = parent;}
    getParent(){return this._tempState._parent;}

    addChild(child){
        this.getChildren()[child.getUID()]=child;
        child.setParent(this);
    }

    removeChild(child){
        delete this.getChildren()[child.getUID()];
        child.setParent();
    }

    mapOverChildren(fn){
        var rvals = [];
        for(let child of this.getChildrenList()){
            rvals.push(fn(child));
        }
        return rvals;
    }

    createChildWithArgs(args){
        const newel = new this.constructor(args);
        this.addChild(newel);
        return newel;
    }

    // mapOverSubTree(func){
    //     func(this);
    //     if(this.getChildren().length>0){
    //         for(let child of this.getChildren()){
    //             child.mapOverSubTree(func);
    //         }
    //     }
    // }

    // setController(controller){
    //     this.mapOverSubTree((view)=>{view.controller = controller});
    // }

}