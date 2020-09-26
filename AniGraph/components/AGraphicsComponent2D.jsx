import React from "react";
import 'two.js';
import AController2D from '../amvc/2d/mvc/AController2D';
import AGraphicsComponent from "./AGraphicsComponent";
import AGraphicsContext2D from "../amvc/2d/contexts/AGraphicsContext2D";
import AView2D from "../amvc/2d/mvc/AView2D";

const AGraphicsComponent2DDefaultProps = {
    width: 500,
    height: 500,
};
export default class AGraphicsComponent2D extends AGraphicsComponent {
    static ComponentControllerClass = AController2D;
    static GraphicsContextClass = AGraphicsContext2D;
    static ModelClassMap = {
        default: {
            controllerClass: AController2D,
            viewClass: AView2D
        }
    };
}
AGraphicsComponent2D.defaultProps = AGraphicsComponent2DDefaultProps;

