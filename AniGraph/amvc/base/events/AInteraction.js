import AObject from "../AObject/AObject";
import {Vec2} from "../../../math/Vector";


export class AInteraction extends AObject{
    constructor(args){
        super(args);
        if(args!==undefined){
            this.setElement(args.element);
            this._setEventListeners(args.eventListeners);
        }
        if(this._getEventListeners()===undefined){
            this._setEventListeners([]);
        }
        this.isActive = false;
    }

    initTempState() {
        super.initTempState();
        this._setEventListeners([]);
    }

    /** Getter and setter that map [controller] to tempState, which means it wont be serialized.*/
    get controller(){return this._tempState.controller;}
    set controller(value){this._tempState.controller = value;}
    getController(){return this.controller;}

    /**
    * [event listeners] setter
    * @param eventListener Value to set event listener
    * @param update Whether or not to update listeners
    */
    _setEventListeners(eventListener){this._tempState.eventListeners = eventListener;}
    _getEventListeners(){return this._tempState.eventListeners;}
    addEventListener(type, callback, ...args){
        const interaction = this;
        function addListener(){
            interaction.getElement().addEventListener(type, callback, ...args);
        }
        function removeListener(){
            interaction.getElement().removeEventListener(type, callback, ...args);
        }
        this._getEventListeners().push({type:type, activate: addListener, deactivate: removeListener});
    }


    elementIsTarget(event){
        return event.target===this.getElement().getDOMItem();
    }

    getContextElement(){
        return this.getElement().getContext().getElement();
    }

    getEventPositionInContext(event){
        // const svgrect = this.getContextElement().getBoundingClientRect();
        const svgrect = this.getElement().getContext().getElement().getBoundingClientRect();
        return new Vec2(event.clientX-svgrect.left, event.clientY-svgrect.top);
    }

    activate(){
        if(!this.isActive) {
            for(let eventListener of this._getEventListeners()){
                eventListener.activate();
            }
            this.isActive = true;
        }
    }

    deactivate(){
        if(this.isActive){
            for(let eventListener of this._getEventListeners()){
                eventListener.deactivate();
            }
            this.isActive = false;
        }
    }

    release(args){
        this.deactivate();
        this._setEventListeners([]);
        super.release();
    }


    /**
    * [element] setter
    * @param element Value to set element
    * @param update Whether or not to update listeners
    */
    setElement(element){this._element = element;}
    getElement(){return this._element;}
    /** Get set element */
    set element(value){this._element = value;}
    get element(){return this._element;}
}



export class ADragInteraction extends AInteraction{
    constructor(args) {
        super(args);
    }

    release(){
        this.deactivate();
        this.setDragStartCallback();
        this.setDragMoveCallback();
        this.setDragEndCallback();
        super.release();
    }

    activate(){
        if(!this.isActive) {
            this._addDragListeners();
            this.isActive = true;
        }
    }

    deactivate(){
        if(this.isActive){
            this._removeDragListeners();
            this.isActive = false;
        }
    }

    setDragStartCallback(dragStartCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['start'] = dragStartCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragStartCallback(){return this._dragCallbacks['start'];}
    setDragMoveCallback(dragMoveCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['move'] = dragMoveCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragMoveCallback(){return this._dragCallbacks['move'];}
    setDragEndCallback(dragEndCallback){
        if(this._dragCallbacks===undefined){
            this._dragCallbacks = {};
        }
        this._dragCallbacks['end'] = dragEndCallback;
        if(this.isActive){this._updateDragListeners();}
    }
    getDragEndCallback(){return this._dragCallbacks['end'];}

    _updateDragListeners(){
        if(this.isActive){
            this._removeDragListeners();
        }
        this._addDragListeners();
    }
    _removeDragListeners(){
        this.getElement().removeEventListener('mousedown', this._dragSetCallback);
    }
    _addDragListeners(){
        if(this._dragSetCallback===undefined){
            this._dragSetCallback=null;
        }
        if(this._dragSetCallback!==null){
            this._removeDragListeners();
        }
        const interaction = this;
        const element = this.getElement();

        function startCallback(){
            element.addEventListener('mousedown', interaction._dragSetCallback);
        }
        function dragmovingcallback(event) {
            event.preventDefault();
            interaction.getDragMoveCallback()(event);
        }
        function dragendcallback(event) {
            event.preventDefault();
            interaction.getDragEndCallback()(event);
            element.getWindowElement().removeEventListener('mousemove', dragmovingcallback);
            // startCallback();
        }
        this._dragSetCallback = function(event){
            // if(!interaction.elementIsTarget(event)){
            //     return;
            // }
            event.preventDefault();
            // rect.getDOMItem().classList.add('isdragging');
            interaction.getDragStartCallback()(event);
            if(!interaction.isEscaped) {
                element.getWindowElement().addEventListener('mousemove', dragmovingcallback);
                element.getWindowElement().addEventListener('mouseup', dragendcallback, {once: true});
            }
        }
        startCallback();
    }
}