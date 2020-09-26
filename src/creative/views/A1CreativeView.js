/*
 * Copyright (c) 2020. Abe Davis
 */

import A1View from "../../mvc/views/A1View";
import Matrix3x3 from "../../math/Matrix3x3";
import tinycolor from "tinycolor2";

export default class A1CreativeView extends A1View{
    constructor(args) {
        super(args);
    }
    /**
     * Initialize the graphics. In this case, our view represents a single shape element.
     *
     */
    initGeometry() {
        const model = this.getModel();
        this.updateShapes(model);
    }

    /**
     * Update the shapes based on the current state of the model. This will be called every time the model changes.
     * @param model
     */
    updateShapes(model){

        // If you are curious, I used tinycolor to procedurally modify colors in the demo I showed.
        // you can look up the tinycolor package at [https://github.com/bgrins/TinyColor](https://github.com/bgrins/TinyColor)
        // if you want to play with it.
        // Example:
        // const mcolor = tinycolor(m.getAttribute('fill'));
        // shape.setAttribute('fill', mcolor.spin(angle).toString());
    }

    /**
     * This gets when we think the view might need to be updated.
     * We get the vertices and attributes from the model and update the svg element.
     */
    updateGraphics(){
        //
        const model = this.getModel();
        this.updateShapes(model);
        this.getGraphicsContext().update();
    }
}