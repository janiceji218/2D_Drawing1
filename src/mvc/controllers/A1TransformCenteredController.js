/*
 * Copyright (c) 2020. Abe Davis
 */

import Vec2 from "../../math/Vec2";
import Matrix3x3 from "../../math/Matrix3x3";
import A1TransformController from "./A1TransformController";
import Vec3 from "../../math/Vec3";

export default class A1TransformCenteredController extends A1TransformController{
    /**
     * This should return an interaction for a bounding box handle that can be used to resize the shape.
     * In this case, scaling should happen around the center of the object, defined as the center of its bounding box.
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

        //Now let's define a drag start callback
        iaction.setDragStartCallback(event=>{
            //if the current element isn't the frontmost thing being clicked (meaning something else is the target) then we'll return right away
            if(!iaction.elementIsTarget(event)){return;}

            // It's good practice to prevent default actions from happening. Presumably, this click is meant for us, so
            // we don't want it to, for example, trigger the selection of text or HTML
            event.preventDefault();
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">
            let model = this.model;
            iaction.startCursorPosition = iaction.getEventPositionInContext(event);
            let bbCenterX = (this.model.getWorldSpaceBBoxCorners()[1].x + this.model.getWorldSpaceBBoxCorners()[0].x) / 2.0;
            let bbCenterY = (this.model.getWorldSpaceBBoxCorners()[2].y + this.model.getWorldSpaceBBoxCorners()[0].y) / 2.0;
            iaction.bbOrigin = new Vec2(bbCenterX, bbCenterY);
            iaction.origMatrix = this.model.matrix;
            iaction.rotation = Matrix3x3.Rotation(model.getRotation());
            iaction.bbOriginMAT = Matrix3x3.Translation(iaction.bbOrigin.x, iaction.bbOrigin.y);
            iaction.trans = Matrix3x3.Translation(model.getTranslation());
            iaction.bbOR1 = (iaction.bbOriginMAT.times(iaction.rotation)).getInverse();
            //##################\\--YOUR CODE HERE--//##################
        });


        //now define a drag move callback
        iaction.setDragMoveCallback(event=> {
            event.preventDefault();
            //##################//--YOUR CODE HERE--\\##################
            //<editor-fold desc="YOUR CODE HERE">
            const newCursorLocation = iaction.getEventPositionInContext(event);
            let model = this.model;

            let startCursorPositionST = iaction.bbOR1.times(new Vec3(iaction.startCursorPosition.x,
                iaction.startCursorPosition.y, 1));

            let newCursorLocationST = iaction.bbOR1.times(new Vec3(newCursorLocation.x, newCursorLocation.y, 1));

            let scaleX = newCursorLocationST.x / startCursorPositionST.x;
            let scaleY = newCursorLocationST.y / startCursorPositionST.y;
            let scaleMAT = Matrix3x3.Scale(scaleX, scaleY);

            model.matrix = iaction.bbOriginMAT.times(iaction.rotation).times(scaleMAT).times(iaction.bbOR1).times(
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

}

