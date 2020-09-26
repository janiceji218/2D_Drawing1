import AView2D from "../../mvc/AView2D";

export default class AShape2DView extends AView2D{
    /**
     *
     * @param model
     * @returns {Two.Path}
     */
    createShapeElement(model){
        // Our createShapeElement will look just like createBoxElement.
        // We create the svg path and and set it's initial attributes
        const context = this.getGraphicsContext();
        const verts = model.getVertices();
        const shape = context.makePath(verts);
        shape.setAttributes(model.getProperty('attributes'));
        shape.setVertices(model.getVertices());

        return shape;
    }

    createShapeWithVertices(verts){
        const context = this.getGraphicsContext();
        const shape = context.makePath(verts);;
        return shape;
    }
    /**
     * Initialize the graphics. In this case, our view represents a single shape element.
     *
     */
    initGraphics() {
        // This looks much the same as in the box example
        super.initGraphics();
        this.initGeometry();
    }

    initGeometry(){
        this.shape = this.createShapeElement(this.getModel());
        this.addGraphic(this.shape);
    }

    /**
     * This gets when we think the view might need to be updated.
     * We get the vertices and attributes from the model and update the svg element.
     */
    updateGraphics(){
        //
        super.updateGraphics();
        const model = this.getModel();
        this.shape.setVertices(model.getVertices());
        this.shape.setAttributes(model.getProperty('attributes'));
    }
}