import ASupplementalView2D from "../../supplementals/views/ASupplementalView2D";
import {Vec2} from "../../../../math/Vector";

export default class AShape2DBoundingBoxView extends ASupplementalView2D{
    constructor(args) {
        super(args);
        this.handleSize = (args && args.handleSize) ? args.handleSize : 10;
        this.anchorInnerRadius = (args && args.anchorInnerRadius) ? args.anchorInnerRadius : 4;
        this.anchorOuterRadius = (args && args.anchorOuterRadius) ? args.anchorOuterRadius : 30;
        this.boxThickness = (args && args.boxThickness) ? args.boxThickness : 3;
    }

    getHandleVerts(location, handleSize){
        const sideLength = (handleSize!==undefined)? handleSize : this.handleSize;
        return [new Vec2(location.x-sideLength*0.5, location.y-sideLength*0.5),
            new Vec2(location.x-sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y+sideLength*0.5),
            new Vec2(location.x+sideLength*0.5, location.y-sideLength*0.5)];
    }

    /**
     * returns xy, Xy, XY, xY
     * @param minXminY
     * @param maxXmaxY
     * @returns {Vec2[]}
     */
    getBoxVerts(corners){
        return [
            corners[0].dup(),
            corners[1].dup(),
            corners[2].dup(),
            corners[3].dup()
        ];

    }

    getAnchorVerts(location, outerRadius, innerRadius){
        const myOuterRadius = (outerRadius!==undefined)? outerRadius : this.anchorOuterRadius;
        const myInnerRadius = (innerRadius!==undefined)? innerRadius : this.anchorInnerRadius;
        const verts = [
            new Vec2(myInnerRadius,myInnerRadius),
            new Vec2(0,myOuterRadius),
            new Vec2(-myInnerRadius,myInnerRadius),
            new Vec2(-myOuterRadius,0),
            new Vec2(-myInnerRadius,-myInnerRadius),
            new Vec2(0,-myOuterRadius),
            new Vec2(myInnerRadius,-myInnerRadius),
            new Vec2(myOuterRadius,0)
        ];
        return verts.map(v=>{
            return v.plus(location);
        });

    }

    createHandle(location, handleIndex, handleSize){
        const sideLength = (handleSize!==undefined)? handleSize : this.handleSize;
        const context = this.getGraphicsContext();
        const handleVerts = this.getHandleVerts(location, sideLength);
        const handle = context.makePath(handleVerts);
        const color = '#aaaaaa';
        handle.setAttributes({
            fill: color,
            opacity: 0.8,
            stroke: 'black'
        });
        handle.handleIndex = handleIndex;
        handle.setStyle('cursor', 'grab');
        handle.addClass('shape-handle');
        handle.location = location;
        this.addGraphic(handle);
        // this.getController().addInteractionsToElement(handle);
        return handle;
    }


    getAxesVerts(corners){
        const mxy = corners[0];
        const mXY = corners[2];
        const cxy = new Vec2(mxy.x+mXY.x, mxy.y+mXY.y).times(0.5);
        return [
            new Vec2(mxy.x,cxy.y),
            new Vec2(mXY.x,cxy.y),
            new Vec2(cxy.x, mxy.y),
            new Vec2(cxy.x, mXY.y)
        ];
    }

    createAxes(corners){
        const context = this.getGraphicsContext();
        const averts = this.getAxesVerts(corners);
        const xaxis = context.makePath([averts[0],averts[1]], false);
        const yaxis = context.makePath([averts[2],averts[3]], false);
        xaxis.setAttributes({
            opacity: 0.2,
            linewidth: 1,
            stroke: '#558855',
            dashes: [1, 1]
        });
        yaxis.setAttributes({
            opacity: 0.2,
            linewidth: 1,
            stroke: '#885555',
            dashes: [1, 1]
        });
        xaxis.setStyle('pointer-events', 'none');
        xaxis.addClass('obj-xaxis');
        yaxis.setStyle('pointer-events', 'none');
        yaxis.addClass('obj-yaxis');
        this.addGraphic(xaxis);
        this.addGraphic(yaxis);
        return {xaxis:xaxis, yaxis:yaxis};


    }

    createBox(corners, linewidth){
        const boxThickness = (linewidth!==undefined)? linewidth : this.boxThickness;
        const context = this.getGraphicsContext();
        const boxVerts = this.getBoxVerts(corners);
        const box = context.makePath(boxVerts, false);

        box.setAttributes({
            opacity: 1.0,
            linewidth: boxThickness,
            stroke: '#aaaaaa',
            dashes: [2*boxThickness, boxThickness]
        });
        box.noFill();
        box.setStyle('pointer-events', 'stroke');
        box.setStyle('cursor', 'nwse-resize');
        // this.getController().addInteractionsToElement(handle);
        box.addClass('shape-bounding-box');
        this.addGraphic(box);
        return box;
    }

    // createBoxLines(minXminY, maxXmaxY){
    //     const context = this.getGraphicsContext();
    //     const hlines = [
    //         context.makePath([
    //             new Vec2(minXminY.x, minXminY.y),
    //             new Vec2(maxXmaxY.x, minXminY.y),
    //         ]),
    //         context.makePath([
    //             new Vec2(minXminY.x, minXminY.y),
    //             new Vec2(maxXmaxY.x, minXminY.y),
    //         ])
    //     ];
    //     const vlines = [
    //         context.makePath([
    //             new Vec2(minXminY.x, minXminY.y),
    //             new Vec2(minXminY.x, maxXmaxY.y),
    //         ]),
    //         context.makePath([
    //             new Vec2(maxXmaxY.x, minXminY.y),
    //             new Vec2(maxXmaxY.x, maxXmaxY.y),
    //         ])
    //     ];
    //     const boxThickness =5;
    //     const attributes = {
    //         opacity: 1.0,
    //         linewidth: boxThickness,
    //         stroke: '#aaaaaa',
    //         dashes: [2*boxThickness, boxThickness]
    //     };
    //
    //     const hcursor = 'ns-resize';
    //     const hclass = 'h-bounding-box';
    //     hlines[0].setAttributes(attributes);
    //     hlines[1].setAttributes(attributes);
    //
    //     hlines[0].setStyle('cursor', hcursor);
    //     hlines[1].setStyle('cursor', hcursor);
    //     hlines[0].addClass(hclass);
    //     hlines[1].addClass(hclass);
    //
    //     const vcursor = 'ew-resize';
    //     const vclass = 'v-bounding-box';
    //     vlines[0].setAttributes(attributes);
    //     vlines[1].setAttributes(attributes);
    //     vlines[0].setStyle('cursor', vcursor);
    //     vlines[1].setStyle('cursor', vcursor);
    //     vlines[0].addClass(vclass);
    //     vlines[1].addClass(vclass);
    //
    //     // box.noFill();
    //     // box.setStyle('pointer-events', 'stroke');
    //
    //     this.addGraphic(hlines[0]);
    //     this.addGraphic(hlines[1]);
    //     this.addGraphic(vlines[0]);
    //     this.addGraphic(vlines[1]);
    //     // this.getController().addInteractionsToElement(handle);
    //
    //     return {vlines: vlines, hlines:hlines};
    // }




    createAnchor(location, outerRadius=50, innerRadius=3){
        const context = this.getGraphicsContext();
        const verts = this.getAnchorVerts(location, outerRadius, innerRadius);
        const element = context.makePath(verts, true);
        element.setAttributes({
            opacity: 0.25,
            linewidth: 3,
            fill: 'black',
            stroke: '#FFFFFF',
        });
        element.setStyle('cursor', 'all-scroll');
        this.addGraphic(element);
        // this.getController().addInteractionsToElement(handle);
        element.addClass('shape-anchor');
        return element;
    }

    initGraphics() {
        super.initGraphics();
        const corners = this.getController()? this.getController().getBoundingBoxCorners() : [
            new Vec2(0,0),
            new Vec2(1,0),
            new Vec2(1,1),
            new Vec2(0,1)
        ];

        // const center = corners[0].plus(corners[2]).times(0.5)
        // const anchor = this.getController().getAnchorWorldCoordinates();
        const anchor = this.getController().getModel().getOrigin();

        const axes = this.createAxes(corners);
        this.xaxis = axes.xaxis;
        this.yaxis = axes.yaxis;
        this.box = this.createBox(corners);
        this.anchor = this.createAnchor(anchor);
        this.handles = [];
        this.handles.push(this.createHandle(corners[0], 0));
        this.handles.push(this.createHandle(corners[1], 1));
        this.handles.push(this.createHandle(corners[2], 2));
        this.handles.push(this.createHandle(corners[3], 3));
    }

    /**
     * This should only ever be called when the controller has a model, as it is triggered by onModelUpdate
     */
    updateGraphics(){
        super.updateGraphics();
    }

    updateAxes(corners){
        const averts = this.getAxesVerts(corners);
        this.xaxis.setVertices(averts.slice(0,2));
        this.yaxis.setVertices(averts.slice(2));
    }

    updateBox(corners){
        this.box.setVertices(this.getBoxVerts(corners));
    }

    updateAnchor(){
        const anchor = this.getModel().getOrigin();
        this.anchor.setVertices(this.getAnchorVerts(anchor));
    }

    updateHandles(corners){
        for(let c=0;c<corners.length;c++){
            this.handles[c].setVertices(this.getHandleVerts(corners[c]));
            // this,handles[c].handleIndex = c;c
        }
    }

    onModelUpdate(args) {
        const model = this.getController().getModel();
        // const corners = this.getModel()? this.getModel().calcWorldSpaceBBoxCorners() : [
        const corners = this.getModel()? this.getModel().getWorldSpaceBBoxCorners() : [
            new Vec2(0,0),
            new Vec2(1,0),
            new Vec2(1,1),
            new Vec2(0,1)
        ];

        this.updateAxes(corners);
        this.updateBox(corners);
        this.updateAnchor();
        this.updateHandles(corners);
        return super.onModelUpdate(args);
    }

}