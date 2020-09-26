import AModel2D from "../../AniGraph/amvc/2d/mvc/AModel2D";
import Matrix3x3 from "../math/Matrix3x3";
import Vec3 from "../math/Vec3";
import Vec2 from "../math/Vec2";
import Precision from "../../AniGraph/math/Precision";
import AObject from "../../AniGraph/amvc/base/AObject/AObject";


/***
 * The A1Model class represents the data model for assignment 1.
 * model.modelProperties
 */
export default class A1Model extends AModel2D{
    /**
     * Initialize the model. This will be called from the constructor, which will pass it's args argument.
     * @param args - a dictionary of keyword arguments
     */
    initModel(args){
        this.matrix = Matrix3x3.Identity();
        this.objectSpaceCorners = [
            new Vec2(0,0),
            new Vec2(0,0),
            new Vec2(0,0),
            new Vec2(0,0)
        ];
    }

    //##################//--Matrices & Coordinate Systems--\\##################
    //<editor-fold desc="Matrices & Coordinate Systems">

    set matrix(value){this.modelProperties.matrix = value;}
    get matrix(){return this.modelProperties.matrix;}

    /*** These are convenience methods in case you forget which transformation the matrix represents */
    get objectToWorldSpaceMatrix(){return this.matrix;}
    get worldToObjectSpaceMatrix(){return this.matrix.getInverse();}

    //</editor-fold>

    //##################//--Matrix Properties--\\##################
    //<editor-fold desc="Matrix Properties">
    /**
     * Set the matrix properties based on the current matrix.
     * This will be called after the matrix is changed directly,
     * so you can assume that the matrix is accurate and the matrix properties
     * should be updated to reflect the current matrix.
     * The same matrix could be the result of different combinations of
     * translation and origin, so here you should assume that the origin property
     * is accurate and only uodate translation. In other words, update translation,
     * scale and rotation.
     */
    updateMatrixProperties(){
        //##################//--YOUR CODE HERE--\\##################
        //<editor-fold desc="YOUR CODE HERE">

        let rst = Matrix3x3.Translation(this.getOrigin()).getInverse().times(this.matrix);
        this.setRotation(Math.atan2(rst.m10, rst.m00),);
        let st = Matrix3x3.Rotation(this.getRotation()).getInverse().times(rst);
        this.setScale(new Vec2(st.m00, st.m11));
        let t = Matrix3x3.Scale(this.getScale()).getInverse().times(st);
        this.setTranslation(new Vec2(t.m02, t.m12));
        //</editor-fold>
        //##################\\--YOUR CODE HERE--//##################
        this.notifyPropertySet();
    }

    /**
     * Set the current matrix based on the current matrix properties.
     * This will be called when a matrix property is set directly.
     * It should take the current matrix properties and set the current matrix
     * based on those properties.
     */
    updateMatrix(){
        this.matrix = Matrix3x3.FromProperties({
            origin: this.getOrigin(),
            rotation: this.getRotation(),
            scale: this.getScale(),
            translation: this.getTranslation()
        });
    }
    //</editor-fold>

    //##################//--Vertices--\\##################
    //<editor-fold desc="Vertices">
    /**
     * Return the world coordinates of the vertices
     */
    getVertices() {
        //##################//--YOUR CODE HERE--\\##################
        //<editor-fold desc="YOUR CODE HERE">

        if (this.objectVertices ===[]) return this.objectVertices;
        else{
            const v = this.objectVertices;
            let n = 0;
            let lst = [];
            while(n < v.length){
                let vert = this.matrix.times(new Vec3(v[n].x, v[n].y, 1))
                lst.push(new Vec2(vert.x, vert.y));
                n = n + 1;
            }
            return lst;
        }
        //</editor-fold>
        //##################\\--YOUR CODE HERE--//##################
        return this.objectVertices;
    }

    /**
     * setVertices should take vertices in world coordinates and use them to set geometry in object coordinates.
     * Transform the provided vertices into object coordinates, and assign objectVertices to these transformed values.
     * Update the objectSpaceCorners for our object (since we're changing the geometry, the bounds of that geometry might change).
     * @param value: list of vertices (Vec3)
     */
    setVertices(value) {
        //##################//--YOUR CODE HERE--\\##################
        //<editor-fold desc="YOUR CODE HERE">

        let n = 0;
        let lst = [];
        while(n < value.length){
            let vert = this.matrix.getInverse().times(new Vec3(value[n].x, value[n].y, 1));
            lst.push(new Vec2(vert.x, vert.y));
            n = n + 1;
        }
        this.objectVertices = lst;

        //change objectSpaceCorners
        let minX = lst[0].x, minY = lst[0].y, maxX = lst[0].x, maxY = lst[0].y;
        let count = 0;
        while(count < lst.length){
            if(lst[count].x < minX){minX = lst[count].x};
            if(lst[count].y < minY){minY = lst[count].y};
            if(lst[count].x > maxX){maxX = lst[count].x};
            if(lst[count].y > maxY){maxY = lst[count].y};
            count = count + 1;
        }
        this.objectSpaceCorners =
            [new Vec2(minX, minY), new Vec2(maxX, minY), new Vec2(maxX, maxY), new Vec2(minX, maxY)];

        //</editor-fold>
        //##################\\--YOUR CODE HERE--//##################
    }

    //</editor-fold>

    //##################//--Object Bounds--\\##################
    //<editor-fold desc="Object Bounds">
    /**
     * objectSpaceBounds is the min and max bounds of each dimensions
     * @returns {*[]}
     */
    get objectSpaceBounds(){return [this.objectSpaceCorners[0], this.objectSpaceCorners[2]];}

    /**
     * setter for objectSpaceCorners, a list of Vec2 for the 4 corners of the object's bounding box.
     * Should be in the form:
     *
     * @param value[Vec2(minX, minY),
     * Vec2(maxX, minY),
     * Vec2(maxX, maxY),
     * Vec2(minX, maxY)]
     */
    set objectSpaceCorners(value){this._objectSpaceCorners = value;}

    /**
     * getter for objectSpaceCorners. this DOES NOT calculate the corners, it just accesses a variable used to store them.
     * @returns {*}
     */
    get objectSpaceCorners(){return this._objectSpaceCorners;}

    calcWorldBounds(){
        return Vec2.GetPointBounds(this.getVertices());
    }

    getWorldSpaceBBoxCorners(){
        return this.worldSpaceCorners;
    }

    calcWorldSpaceBBoxCorners(){
        const wbounds = this.calcWorldBounds();
        return [wbounds[0], new Vec2(wbounds[1].x, wbounds[0].y), wbounds[1], new Vec2(wbounds[0].x, wbounds[1].y)];
    }
    //</editor-fold>

    //##################//--Bounding Box Transformation--\\##################
    //<editor-fold desc="Bounding Box Transformation">
    get worldSpaceCorners(){
        return this.matrix.applyToPoints(this.objectSpaceCorners);
    }
    //</editor-fold>


    /**
     * Renormalize vertices should:
     * - translate and scale the model's objectVertices so that their bounding box is the -0.5,0,5 box.
     * - adjust the model's matrix so that the return value of getVertices is not changed by the translation/scaling.
     * - adjust the models
     * - call updateMatrixProperties() to update matrix properties to reflect the new matrix.
     *
     * If the centerOrigin argument is true, this will reset the origin to the center of the object's bounding box,
     * and set translation to be zero. That portion of the code is provided and does not need to change.
     *
     * Note that this function should work even if matrix properties have not been set or initialized.
     * You should only need the current matrix and vertices.
     * You may assume that this.objectSpaceCorners is accurate, as it should be updated whenever vertices are set.
     */
    renormalizeVertices(centerOrigin=false){
        //##################//--YOUR CODE HERE--\\##################
        //<editor-fold desc="YOUR CODE HERE">
        //</editor-fold>
        //##################\\--YOUR CODE HERE--//##################

        if (this.objectVertices.length > 1) {
            let diffX = this.objectSpaceCorners[1].x - this.objectSpaceCorners[0].x;
            let diffY = this.objectSpaceCorners[2].y - this.objectSpaceCorners[0].y;
            let scaleX = 1.0, scaleY = 1.0;
            if (diffX !== 0) scaleX = 1.0 / diffX;
            if (diffY !== 0) scaleY = 1.0 / diffY;

            let transX = 0.5 - this.objectSpaceBounds[1].x * scaleX;
            let transY = 0.5 - this.objectSpaceBounds[1].y * scaleY;

            let v = this.objectVertices;
            let n = 0;
            let lst = [];
            while (n < v.length) {
                lst.push(new Vec2(v[n].x * scaleX + transX, v[n].y * scaleY + transY));
                n = n + 1;
            }
            this.objectVertices = lst;


            this.matrix = this.matrix.times(Matrix3x3.Scale(scaleX,
                scaleY).getInverse().times(Matrix3x3.Translation(transX, transY).getInverse()));


            let osc = this.objectSpaceCorners;
            this.objectSpaceCorners = [
                new Vec2(osc[0].x * scaleX + transX, osc[0].y * scaleY + transY),
                new Vec2(osc[2].x * scaleX + transX, osc[0].y * scaleY + transY),
                new Vec2(osc[2].x * scaleX + transX, osc[2].y * scaleY + transY),
                new Vec2(osc[0].x * scaleX + transX, osc[2].y * scaleY + transY)];

            this.updateMatrixProperties();
        }

        if(centerOrigin){
            this.setOrigin(this.matrix.times(new Vec2(0,0)), false);
            this.setTranslation(new Vec2(0,0), false);
        }
        this.updateMatrixProperties();
    }

}

AObject.RegisterClass(A1Model);
