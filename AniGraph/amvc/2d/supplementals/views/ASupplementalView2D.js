import AView2D from "../../mvc/AView2D";
import {Vec2} from "../../../../math/Vector";


export default class ASupplementalView2D extends AView2D{
    constructor(args) {
        super(args);
    }

    updateGroup() {
        // We aren't going to call updateGroup here,
        // because this SVG group is already child to
        // the group corresponding to our model
    }
}
