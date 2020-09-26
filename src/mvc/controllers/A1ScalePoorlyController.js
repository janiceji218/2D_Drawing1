import AShape2DBoundingBoxController from "../../../AniGraph/amvc/2d/ashape/supplementals/AShape2DBoundingBoxController";
import Vec2 from "../../math/Vec2";
import Matrix3x3 from "../../math/Matrix3x3";
import Precision from "../../../AniGraph/math/Precision";


/***
 * A poorly implemented scale controller that modifies vertices directly.
 * If you click and drag an object's handle until the bounding box is a line,
 * then the object will literally turn into a line (you wont be able to scale it back up)...
 * This is mostly here to provide an example of how supplemental controllers can be written.
 * After You complete the part of the assignment in A1Model.js, this controller should work,
 * albeit still poorly :-p.
 */
export default class A1ScalePoorlyController extends AShape2DBoundingBoxController{

    addInteractionsToHandle(handle){
        //Lets create a new drag interaction for our handle called 'handle-resize'
        const iaction = handle.createDragInteraction('handle-resize');

        //let's add the interaction to the controller right away
        this.addInteraction(iaction);

        // we should assign an alias to this controller so that we can access it in callbacks.
        // we'll do the same with the model for convenience.
        const controller = this;
        const model = controller.getModel();

        // If the user tries to reflect the object, the order of these handles can switch.
        // Therefore, we will need to keep track of which one is which.
        // If the user moves one corner, the opposite handle should always remain still.
        // We will call that opposite corner the pivot.
        // Each handle has an index, so we will keep track of which one is the current handle and which one is the pivot.
        const handleIndex = handle.handleIndex;
        const pivotIndex = (handle.handleIndex+2)%4;
        const view = this.getView();

        //Now let's define the drag start callback
        iaction.setDragStartCallback(event=>{

            // If the current element wasn't the target of the event---i.e., the user is clicking
            // on something else---then ignore it and return right away.
            if(!iaction.elementIsTarget(event)){return;}

            // Prevent default actions like selecting text that might be otherwise triggered by a drag.
            event.preventDefault();

            // For kicks, we'll print the current handle index to the console.
            console.log('mouse down on handle '+handleIndex);

            // Now let's keep track of the cursor's start position
            iaction.startCursorPosition = new Vec2(event.clientX, event.clientY);

            iaction.startVerts = model.getVertices().slice();
            iaction.startHandleLocation = view.handles[handleIndex].location;
            iaction.startPivotLocation = view.handles[pivotIndex].location;
            iaction.startDiagonal = iaction.startHandleLocation.minus(iaction.startPivotLocation);
        });

        //now define a drag move callback
        iaction.setDragMoveCallback(event=> {
            event.preventDefault();
            const newCursorLocation = new Vec2(event.clientX, event.clientY);

            const newDiagonal = iaction.startDiagonal.plus(
                newCursorLocation.minus(
                    iaction.startCursorPosition
                )
            );

            const scaleX =  newDiagonal.x/iaction.startDiagonal.x;
            const scaleY =  newDiagonal.y/iaction.startDiagonal.y;

            const scaleMat = Matrix3x3.Scale(
                (scaleX && isFinite(scaleX))? scaleX : Precision.SMALLEST,
                (scaleY && isFinite(scaleY))? scaleY : Precision.SMALLEST
            )

            const newVerts = iaction.startVerts.map(v=> {
                // will interpret all 2D vectors as points
                let ival = Matrix3x3.Multiply(
                    scaleMat,
                    v.minus(iaction.startPivotLocation)
                );
                return new Vec2(ival.x, ival.y).plus(iaction.startPivotLocation);
            });

            model.setVertices(newVerts);
            view.updateGraphics();
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
    }

}

