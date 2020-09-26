import AModel from "../../base/mvc/AModel";
import {Vec2} from "../../../math/Vector";
import Matrix3x3 from "../../../math/Matrix3x3";
import AObject from "../../base/AObject/AObject";

/**
 * Class represents a 2D graphical element. Extends the AModel class, which has properties and listeners.
 * This will be the base class for creating your own elements.
 */
export default class AModel2D extends AModel{
    /**
     * Default properties include:
     * @param args An object containing the properties:
     * @param props
     * <p><b> origin </b>: the center of the graphic's coordinate system.</p>
     * <p><b> position </b>: the position of the graphic relative to its parent's coordinate system.</p>
     * <p><b> scale </b>: the scale of the graphic's coordinate system</p>
     * <p><b> rotation </b>: the rotation of the graphic's coordinate system</p>
     * @returns GraphicElement2D object
     */
    constructor(args) {
        super(args);
        // this._modelProperties will be filled with defaults from super class and populated with
        // anything in arge.modelProperties

        const verts = [];

        const defaultProps = {
            matrix: new Matrix3x3(),
            origin: new Vec2(0,0),
            translation: new Vec2(0,0),
            scale: new Vec2(1,1),
            rotation: 0,
            objectVertices: verts,
            attributes: {
                fill: '#9ECFFF',
                opacity: 1.0,
                stroke: '#000000',
                linewidth: 2
            }
        }
        // update any defaults not set explicitly with arguments
        this.setDefaultProperties(defaultProps);
        this.initModel(args);
    }

    initModel(args){
        //set any props based on args that aren't in args.modelProperties here
    }

    afterLoadFromJSON(args) {
        super.afterLoadFromJSON(args);
        this.setAttributes(this.getAttributes());
    }

    //##################//--Default Properties for 2D Elements--\\##################
    //<editor-fold desc="Default Properties">
    setMatrix(value){
        this.setProperty('matrix', value);
        this.updateMatrixProperties();
    }
    
    updateMatrixProperties(){
        //To be implemented!
    }
    /** Get set matrix */
    set matrix(value){this.this._modelProperties.matrix=value;}
    get matrix(){return this._modelProperties.matrix;}

    updateMatrix(){
        throw new Error("Not implemented");
    };

    setMatrixProperty(name, value, update=true){
        this.modelProperties[name] = value;
        if(update) {
            this.updateMatrix();
            this.notifyPropertySet({name: value});
        }
    }

    /**
     * AModel property [origin] setter
     * @param origin Value to set origin
     * @param update Whether or not to update listeners
     */
    setOrigin(origin, update=true){
        this.setMatrixProperty('origin', origin, update);
    }
    getOrigin(origin){return this.getProperty('origin');}

    /**
     * AModel property [translation] setter
     * @param translation Value to set translation
     * @param update Whether or not to update listeners
     */
    setTranslation(translation, update=true){
        this.setMatrixProperty('translation', translation, update);
    }
    getTranslation(translation){return this.getProperty('translation');}

    /**
     * AModel property [scale] setter
     * @param scale Value to set scale
     * @param update Whether or not to update listeners
     */
    setScale(scale, update=true){
        if(Array.isArray(scale)){
            this.setMatrixProperty('scale', scale, update);
            return;
        }
        if(scale.elements){
            this.setMatrixProperty('scale', scale, update);
            return;
        }
        if(typeof scale == 'number'){
            this.setMatrixProperty('scale', new Vec2(scale, scale), update);
            return;
        }
        this.setMatrixProperty('scale', scale, update);
    }
    getScale(scale){return this.getProperty('scale');}

    /**
     * AModel property [rotation] setter in radians
     * @param rotation Value to set rotation in radians
     * @param update Whether or not to update listeners
     */
    setRotation(rotation, update=true){
        this.setMatrixProperty('rotation', rotation, update);
    }
    getRotation(rotation){return this.getProperty('rotation');}

    // /**
    //  * AModel property [rotation] setter in degrees
    //  * @param rotation Value in degrees to set rotation
    //  * @param update Whether or not to update listeners
    //  */
    setRotationDegrees(rotation, update=true){
        this.setRotation(rotation*Math.PI/180, update);
    }
    getRotationDegrees(rotation){return this.getRotation()*180/Math.PI;}
    //</editor-fold>
    //##################\\--Default Properties--//##################

    //##################//--Attributes--\\##################
    //<editor-fold desc="Attributes">
    /** Get set attributes */
    set attributes(value){this._modelProperties['attributes'] = value;}
    get attributes(){return this._modelProperties['attributes'];}

    /** Get set vertices */
    set objectVertices(value){this.setProperty('objectVertices', value);}
    get objectVertices(){return this._modelProperties['objectVertices'];}
    getVertices(){
        return this._modelProperties['objectVertices'];
    }
    setVertices(value){
        this.setProperty('objectVertices', value);
    }

    /** Get set objectSpaceBounds */
    set objectSpaceBounds(value){this._objectSpaceBounds = value;}
    get objectSpaceBounds(){return this._objectSpaceBounds;}

    /**
     * Get an SVG attribute. These have significant overlap with CSS properties.
     * @param name
     * @returns {*}
     */
    getAttribute(name){
        return this.attributes[name];
    }

    /**
     * Set an SVG attribute. These have significant overlap with CSS properties
     * @param name
     * @param value
     */
    setAttribute(name, value, update=true){
        this.attributes[name]=value;
        if(update){
            this.notifyListeners({
                type: "setAttributes",
                args: {name:value}
            });
        }
    }

    getAttributes(){
        return this.attributes;
    }

    setAttributes(attrs, update){
        if(attrs === undefined){return;}
        this.attributes = Object.assign(this.attributes, attrs);
        if(update){
            this.notifyListeners({
                type: "setAttributes",
                args: attrs
            });
        }

    }

    //</editor-fold>
    //##################\\--Attributes--//##################

    renormalizeVertices(){

    }


}

AObject.RegisterClass(AModel2D);