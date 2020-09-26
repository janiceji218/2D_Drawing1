/*
 * Copyright (c) 2020. Abe Davis
 */
import AShape2DBoundingBoxController from "../../../AniGraph/amvc/2d/ashape/supplementals/AShape2DBoundingBoxController";
import Vec2 from "../../math/Vec2";
import Matrix3x3 from "../../math/Matrix3x3";
import {Vec3} from "../../../AniGraph/math/Vector";

export default class A1TransformController extends AShape2DBoundingBoxController{

    /**
     * This should return an interaction for a bounding box handle that can be used to resize the shape.
     * In this case, scaling should happen around the origin of the object, represented by the anchor in the GUI.
     * As the user drags, the handle they are dragging should move with the cursor.
     * @param handle
     * @returns {ADragInteraction}
     */
    addInteractionsToHandle(handle){
        //Lets create a new drag interaction for our handle called 'handle-resize'
        const iaction = handle.createDragInteraction('handle-resize');

        //let's add the interaction to the controller right away
        this.addInteraction(iaction);

        // we should assign an alias to this controller so that we can access it in callbacks.
        const controller = this;
        const model = controller.getModel();
        //Now let's define a drag start callback
        iaction.setDragStartCallback(event=>{
            //if the current element isn't the frontmost thing being clicked (meaning something else is the target) then we'll return right away
            if(!iaction.elementIsTarget(event)){return;}

            // It's good practice to prevent default actions from happening. Presumably, this click is meant for us, so
            // we don't want it to, for example, trigger the selection of text or HTML
            event.preventDefault();

            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">

            //iaction.startCursorPosition = new Vec2(event.clientX, event.clientY);
            iaction.startCursorPosition = iaction.getEventPositionInContext(event);
            iaction.matrixST = Matrix3x3.Rotation(model.getRotation()).getInverse().times(
                Matrix3x3.Translation(model.getOrigin()).getInverse());
            iaction.origMatrix = model.matrix;
            iaction.rotation = Matrix3x3.Rotation(model.getRotation());
            iaction.origin = Matrix3x3.Translation(model.getOrigin());
            iaction.trans = Matrix3x3.Translation(model.getTranslation());
            iaction.scale = Matrix3x3.Scale((model.getScale));
            iaction.OR1 = (iaction.origin.times(iaction.rotation)).getInverse();
            //</editor-fold>
            //##################\\--YOUR CODE HERE--//##################

        });


        //now define a drag move callback
        iaction.setDragMoveCallback(event=> {
            event.preventDefault();
            //const newCursorLocation = new Vec2(event.clientX, event.clientY);
            const newCursorLocation = iaction.getEventPositionInContext(event);
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">

            let startCursorPositionST = iaction.OR1.times(new Vec3(iaction.startCursorPosition.x,
                iaction.startCursorPosition.y, 1));

            let newCursorLocationST = iaction.OR1.times(new Vec3(newCursorLocation.x, newCursorLocation.y, 1));

            let scaleX = newCursorLocationST.x / startCursorPositionST.x;
            let scaleY = newCursorLocationST.y / startCursorPositionST.y;
            let scaleMAT = Matrix3x3.Scale(scaleX, scaleY);

            model.matrix = iaction.origin.times(iaction.rotation).times(scaleMAT).times(iaction.OR1).times(
                iaction.origMatrix);
            //M<-(OR)S(OR)^-1(start matrix)
            model.updateMatrixProperties();

            //</editor-fold>
            //##################\\--YOUR CODE HERE--//##################

        });

        //we can optionally define a drag end callback
        iaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return iaction;
    }

    addInteractionsToBox(box){
    }

    addInteractionsToAnchor(anchor){
        const iaction = anchor.createDragInteraction('drag-anchor');
        this.addInteraction(iaction);
        const controller = this;
        iaction.setDragStartCallback(event=>{
            if(!iaction.elementIsTarget(event)){return;}
            event.preventDefault();
            iaction.startCursor = iaction.getEventPositionInContext(event);
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">


            iaction.mat = this.model.matrix;
            //remember start origin of model
            iaction.startOrigin = this.model.getOrigin();
            iaction.rotation = Matrix3x3.Rotation(this.model.getRotation());
            iaction.scale = Matrix3x3.Scale(this.model.getScale());
            iaction.translation = Matrix3x3.Translation(this.model.getTranslation());
            //</editor-fold>
            //##################\\--YOUR CODE HERE--//##################
        });

        //now define a drag move callback
        iaction.setDragMoveCallback(event=> {
            event.preventDefault();
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">
            const newCursorLocation = iaction.getEventPositionInContext(event);
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">
            let mod = this.model;
            let transX = newCursorLocation.x - iaction.startCursor.x;
            let transY = newCursorLocation.y - iaction.startCursor.y;
            let trans = new Vec2(iaction.startOrigin.x + transX, iaction.startOrigin.y + transY);
            mod.setOrigin(trans, false);
            mod.updateMatrixProperties();
            //this.getView().updateGraphics();

            //</editor-fold>
            //##################\\--YOUR CODE HERE--//##################
        });

        //we can optionally define a drag end callback
        iaction.setDragEndCallback(event=>{
            event.preventDefault();
        });

        //Finally, return the interaction
        return iaction;
    }

}
