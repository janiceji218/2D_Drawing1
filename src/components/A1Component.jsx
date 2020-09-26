import React from "react"

//<editor-fold desc="MVC imports">
import A1Model from "../mvc/A1Model";
import A1View from "../mvc/views/A1View";
import A1Controller from "../mvc/controllers/A1Controller";
import AComponentController2D from "../../AniGraph/amvc/2d/components/AComponentController2D";
//</editor-fold>

//<editor-fold desc="Parent Component imports">
import AShape2DEditorComponent from "../../AniGraph/amvc/2d/ashape/editorcomponent/AShape2DEditorComponent";
//</editor-fold>

//<editor-fold desc="Supplemental Controllers">
import A1DragOriginController from "../mvc/controllers/A1DragOriginController";
import A1TransformController from "../mvc/controllers/A1TransformController";
import A1ScalePoorlyController from "../mvc/controllers/A1ScalePoorlyController";
//</editor-fold>

//<editor-fold desc="Math">
import Vec2 from "../math/Vec2";
import A1TransformCenteredController from "../mvc/controllers/A1TransformCenteredController";
//</editor-fold>

export default class A1Component extends AShape2DEditorComponent{
    /***
     * The component controller is the root of your controller hierarchy.
     * It's main function is to be a parent to controllers that get added later,
     * and to play host to supplemental controllers that handle interactions with
     * the context (for example, a controller that responds to the user clicking the background)
     * @type {AComponentController2D}
     */
    static ComponentControllerClass = AComponentController2D;


    /***
     * The ModelClassMap specifies what controller, view, and (potentially) model classes should be created
     * when new models are added to the scene. The default modelClass may also be used by supplemental
     * controllers that create new models.
     * @type {{default: {controllerClass: A1Controller, modelClass: A1Model, viewClass: A1View}}}
     */
    static ModelClassMap = {
        'default': {
            viewClass: A1View,
            controllerClass: A1Controller,
            modelClass: A1Model
        }
    }

    /**
     * You shouldn't have to change the constructor, but, rest assured, it's there...
     * @param props
     */
    constructor(props)
    {
        super(props);
    }

    initComponent(args){
        super.initComponent(args);
    }

    /**
     * startControllers is called after the component mounts. Default controllers will have been created, but not activated.
     * Here, you can create additional controllers, and choose which ones to activate.
     *
     * @param args
     */
    startControllers(args) {
        super.startControllers(args);
    }

    /**
     * Initialize supplemental controllers
     */
    initSupplementalComponentControllers(){
        super.initSupplementalComponentControllers();
    }

    /**
     * Initialize supplemental controllers that apply to the selected shape.
     * @nota-bene We override the parent method here.
     */
    initSupplementalSelectionControllers(){
        this.setController('translate', new A1DragOriginController({component: this}));
        this.setController('transform', new A1TransformController({component: this}));
        this.setController('scale poorly', new A1ScalePoorlyController({component: this}));
        this.setController('transform centered', new A1TransformCenteredController({component: this}));
        this.setCurrentEditMode('transform');
    }

    //##################//--App State--\\##################
    //<editor-fold desc="App State">
    setCurrentEditMode(value){
        this.setAppState('currentEditMode', value);
    }

    getCurrentEditMode(){
        return this.getAppState('currentEditMode');
    }

    initAppState(){
        super.initAppState();
        const self = this;

        // initialize app state
        this.setAppState('onRunScriptButtonClick', this.runScript);
        this.setAppState('onRandomShapeButtonClick', this.addRandomShape);
        this.setAppState('saveSVG', this.saveSVG);
        this.setAppState('onSurpriseShapeButtonClick', this.addSurpriseShape);
        // set functions to call when certain app state changes
        this.addAppStateListener('currentEditMode', function(currentEditMode){
            self.setEditMode(currentEditMode);
        })
        this.setAppState('availableEditModes',
            ['transform w/anchor', `transform centered`, 'edit', 'scale poorly']
        );

    }

    /**
     * These modes will appear as options in the mode selection widget.
     * Hard coded for now. You can override this and add new modes if you want to experiment
     * in creative portion of the assignment.
     * @returns {string[]}
     */
    getAvailableEditModes(){
        return this.getAppState('availableEditModes');
    }

    //</editor-fold>
    //##################\\--App State--//##################



    /**
     * Set the editting mode, and activate or deactivate controllers based on what the new mode is.
     * @param mode
     */
    setEditMode(mode){

        if(mode && mode===this._lastEditMode){
            return;
        }
        this._lastEditMode=mode;
        this.detachSelectionControllers();
        switch(mode){
            case null:
                this.currentSelectionModeControllers = [
                ];
                break;
            case 'edit':
                this.currentSelectionModeControllers = [
                    this.getController('editVertices'),
                    this.getController('translate')
                ];
                break;
            case 'transform w/anchor':
                this.currentSelectionModeControllers = [
                    this.getController('transform'),
                    this.getController('translate')
                ];
                break;
            case 'transform centered':
                this.currentSelectionModeControllers = [
                    this.getController('transform centered'),
                    this.getController('translate')
                ];
                break;
            default:
                this.currentSelectionModeControllers = [
                    this.getController(mode),
                    this.getController('translate')
                ];
                break;
        }

    }

    /**
     * Select a shape.
     * @param args
     */
    selectShape(args) {
        super.selectShape(args);
    }

    /**
     * Save the svg corresponding to this component.
     * This function is private; the public saveSVG can be set to this or to
     * a function provided in props.
     * @private
     */
    _saveContextSVG(){
        this.getGraphicsContext().saveSVG();
    }

    /** Get set saveSVG */
    set saveSVG(value){this._saveSVG = value;}
    get saveSVG(){return this._saveSVG ? this._saveSVG : this._saveContextSVG;}


    /**
     * Bind methods that might be used as callbacks.
     */
    bindMethods() {
        super.bindMethods();
        this.setCurrentEditMode = this.setCurrentEditMode.bind(this);
        this.runScript = this.runScript.bind(this);
        this._saveContextSVG = this._saveContextSVG.bind(this);
        this.addRandomShape = this.addRandomShape.bind(this);
        this.addSurpriseShape = this.addSurpriseShape.bind(this);
    }

    /**
     * When you are testing your code, this function may come in handy...
     * It creates a shape with random vertices and color, and adds it to the scene.
     * @param model
     */
    addRandomShapeTo(model){

        const newModel = new A1Model();
        newModel.setVertices(Vec2.RandomVecs(10, 250, 200));
        newModel.renormalizeVertices(true);
        model.addChild(newModel);
        var randomColor = '#'+(Math.floor(Math.random()*16777215).toString(16));
        newModel.setAttribute('fill', randomColor);
    }

    addSurpriseShapeTo(model){
        let n = Math.floor(Math.random() * 4 + 1);

        //white background
        const newModelB = new A1Model();
        newModelB.setVertices([new Vec2(6.5, 8), new Vec2(6.5, 487), new Vec2(487, 488), new Vec2(487, 8)]);
        newModelB.renormalizeVertices(true);
        model.addChild(newModelB);
        newModelB.setAttribute('fill', "#ffffff");
        newModelB.setAttribute('stroke', "#ffffff");

        //heart
        if (n == 1) {

            const newModel = new A1Model();
            newModel.setVertices([new Vec2(251, 186), new Vec2(288, 138), new Vec2(335, 124), new Vec2(368, 166),
                new Vec2(364, 235), new Vec2(253, 361), new Vec2(137, 231), new Vec2(136, 169), new Vec2(165, 126),
                new Vec2(211, 139)]);
            newModel.renormalizeVertices(true);
            model.addChild(newModel);
            var randomColor = '#' + (Math.floor(Math.random() * 16777215).toString(16));
            newModel.setAttribute('fill', randomColor);
        }

        //pikachu
        else if(n == 2) {
            //body -----------------------------------------------------------
            const newModel1 = new A1Model();
            newModel1.setVertices([new Vec2(115.5, 414), new Vec2(380.5, 412), new Vec2(387.5, 347), new Vec2(358.5, 217),
                new Vec2(341.5, 185), new Vec2(388.5, 155), new Vec2(425.5, 79), new Vec2(344.5, 110), new Vec2(305.5, 137),
                new Vec2(244.5, 133), new Vec2(195.5, 137), new Vec2(163.5, 117), new Vec2(74.5, 78), new Vec2(119.5, 150),
                new Vec2(150.5, 178), new Vec2(141.5, 195), new Vec2(114.5, 290), new Vec2(136.5, 335)]);
            newModel1.renormalizeVertices(true);
            model.addChild(newModel1);
            newModel1.setAttribute('fill', "#ffd100");
            //left ear -------------------------------------------------------
            const newModel2 = new A1Model();
            newModel2.setVertices([new Vec2(123.5, 99), new Vec2(130.5, 143), new Vec2(134.5, 163), new Vec2(118.5, 148),
                new Vec2(73.5, 76)]);
            newModel2.renormalizeVertices(true);
            model.addChild(newModel2);
            newModel2.setAttribute('fill', "#8b2a2a");
            //right ear-------------------------------------------------------
            const newModel3 = new A1Model();
            newModel3.setVertices([new Vec2(393.5, 91), new Vec2(383.5, 147), new Vec2(375.5, 163), new Vec2(388.5, 155),
                new Vec2(427.5, 77)]);
            newModel3.renormalizeVertices(true);
            model.addChild(newModel3);
            newModel3.setAttribute('fill', "#8b2a2a");
            //right eye-------------------------------------------------------
            const newModel4 = new A1Model();
            newModel4.setVertices([new Vec2(283.5, 206), new Vec2(281.5, 213), new Vec2(282.5, 220),
                new Vec2(288.5, 226), new Vec2(295.5, 224), new Vec2(300.5, 219), new Vec2(298.5, 208),
                new Vec2(291.5, 204)]);
            newModel4.renormalizeVertices(true);
            model.addChild(newModel4);
            newModel4.setAttribute('fill', "#8b2a2a");

            const newModel5 = new A1Model();
            newModel5.setVertices([new Vec2(285.5, 209), new Vec2(284.5, 213), new Vec2(286.5, 215),
                new Vec2(290.5, 213), new Vec2(290.5, 210), new Vec2(287.5, 208)]);
            newModel5.renormalizeVertices(true);
            model.addChild(newModel5);
            newModel5.setAttribute('fill', "#ffffff");
            newModel5.setAttribute('stroke', "#ffffff");
            //left eye-------------------------------------------------------
            const newModel6 = new A1Model();
            newModel6.setVertices([new Vec2(192.611, 204), new Vec2(183.722, 206.421), new Vec2(181.5, 213.684),
                new Vec2(183.833, 222.157), new Vec2(189.388, 226), new Vec2(197.055, 224.578), new Vec2(201.5, 218.526),
                new Vec2(199.5, 208.631)]);
            newModel6.renormalizeVertices(true);
            model.addChild(newModel6);
            newModel6.setAttribute('fill', "#8b2a2a");

            const newModel7 = new A1Model();
            newModel7.setVertices([new Vec2(186.5, 207), new Vec2(184.5, 208), new Vec2(183.5, 212),
                new Vec2(186.5, 214), new Vec2(189.5, 212), new Vec2(189.5, 208)]);
            newModel7.renormalizeVertices(true);
            model.addChild(newModel7);
            newModel7.setAttribute('fill', "#ffffff");
            newModel7.setAttribute('stroke', "#ffffff");
            //nose-------------------------------------------------------
            const newModel8 = new A1Model();
            newModel8.setVertices([new Vec2(226.5, 239), new Vec2(230.5, 236), new Vec2(238.5, 237), new Vec2(241.5, 239),
                new Vec2(237.5, 244), new Vec2(230.5, 244)]);
            newModel8.renormalizeVertices(true);
            model.addChild(newModel8);
            newModel8.setAttribute('fill', "#8b2a2a");
            //left cheek-------------------------------------------------------
            const newModel9 = new A1Model();
            newModel9.setVertices([new Vec2(152.833, 241.09), new Vec2(142, 241.09), new Vec2(135.5, 247.636),
                new Vec2(135.5, 255.272), new Vec2(143.083, 260.727), new Vec2(152.833, 260.727),
                new Vec2(159.333, 256.363), new Vec2(160.416, 253.09), new Vec2(161.5, 250.909),
                new Vec2(160.416, 244.363)]);
            newModel9.renormalizeVertices(true);
            model.addChild(newModel9);
            newModel9.setAttribute('fill', "#f56923" );
            newModel9.setAttribute('stroke', "#d02a02");
            //right cheek-------------------------------------------------------
            const newModel10 = new A1Model();
            newModel10.setVertices([new Vec2(318.071, 239.882), new Vec2(311.642, 246.588), new Vec2(312.714, 255.529),
                new Vec2(319.142, 261.117), new Vec2(328.785, 261.117), new Vec2(335.214, 256.647),
                new Vec2(337.357, 251.058), new Vec2(337.357, 244.352), new Vec2(330.928, 239.882)]);
            newModel10.renormalizeVertices(true);
            model.addChild(newModel10);
            newModel10.setAttribute('fill', "#f56923" );
            newModel10.setAttribute('stroke', "#d02a02");
            //mouth-------------------------------------------------------
            const newModel11 = new A1Model();
            newModel11.setVertices([new Vec2(220.327, 269.333), new Vec2(219.051, 273.333), new Vec2(219.051, 278.666),
                new Vec2(224.155, 286.666), new Vec2(230.534, 289.333), new Vec2(243.293, 289.333),
                new Vec2(248.396, 284), new Vec2(250.948, 273.333), new Vec2(244.568, 264), new Vec2(233.086, 262.666),
                new Vec2(225.431, 264)]);
            newModel11.renormalizeVertices(true);
            model.addChild(newModel11);
            newModel11.setAttribute('fill', "#eb836a");
            newModel11.setAttribute('stroke', "#d02a02");
        }

        //steve
        else if (n == 3){
            //skin-------------------------------------------------------
            const newModel1 = new A1Model();
            newModel1.setVertices([new Vec2(122.5, 105), new Vec2(122.5, 318), new Vec2(376.5, 318),
                new Vec2(376.5, 105)]);
            newModel1.renormalizeVertices(true);
            model.addChild(newModel1);
            newModel1.setAttribute('fill', "#ffe5b2");
            //hair-------------------------------------------------------
            const newModel2 = new A1Model();
            newModel2.setVertices([new Vec2(122.5, 94), new Vec2(376.5, 95), new Vec2(376.5, 179), new Vec2(345.5, 179),
                new Vec2(345.5, 151), new Vec2(345.5, 151), new Vec2(154.5, 151), new Vec2(154.5, 179),
                new Vec2(122.5, 179)]);
            newModel2.renormalizeVertices(true);
            model.addChild(newModel2);
            newModel2.setAttribute('fill', "#8b572a");
            //left eye-------------------------------------------------------
            const newModel3 = new A1Model();
            newModel3.setVertices([new Vec2(156.5, 205), new Vec2(156.5, 229), new Vec2(212.5, 229),
                new Vec2(212.5, 205)]);
            newModel3.renormalizeVertices(true);
            model.addChild(newModel3);
            newModel3.setAttribute('fill', "#ffffff");
            newModel3.setAttribute('stroke', "#ffffff");

            const newModel4 = new A1Model();
            newModel4.setVertices([new Vec2(189.5,205), new Vec2(189.5, 229), new Vec2(212.5, 229),
                new Vec2(212.5, 205)]);
            newModel4.renormalizeVertices(true);
            model.addChild(newModel4);
            newModel4.setAttribute('fill', "#9ECFFF" );
            newModel4.setAttribute('stroke', "#4a90e2");
            //right eye-------------------------------------------------------
            const newModel5 = new A1Model();
            newModel5.setVertices([new Vec2(285.5, 206), new Vec2(285.5, 230), new Vec2(341.5, 230),
                new Vec2(341.5, 206)]);
            newModel5.renormalizeVertices(true);
            model.addChild(newModel5);
            newModel5.setAttribute('fill', "#ffffff");
            newModel5.setAttribute('stroke', "#ffffff");

            const newModel6 = new A1Model();
            newModel6.setVertices([new Vec2(285.5, 206), new Vec2(285.5, 230), new Vec2(308.5, 230),
                new Vec2(308.5, 206)]);
            newModel6.renormalizeVertices(true);
            model.addChild(newModel6);
            newModel6.setAttribute('fill', "#9ECFFF" );
            newModel6.setAttribute('stroke', "#4a90e2");

            //nose-------------------------------------------------------
            const newModel7 = new A1Model();
            newModel7.setVertices([new Vec2(212.5, 231), new Vec2(212.5, 258), new Vec2(284.5, 258),
                new Vec2(284.5,231)]);
            newModel7.renormalizeVertices(true);
            model.addChild(newModel7);
            newModel7.setAttribute('fill', "#ff785a" );
            newModel7.setAttribute('stroke', "#d0021b");
            //beard-------------------------------------------------------
            const newModel8 = new A1Model();
            newModel8.setVertices([new Vec2(212.5, 259), new Vec2(185.5, 259), new Vec2(185.5, 317),
                new Vec2(313.5, 317), new Vec2(313.5, 259), new Vec2(284.5, 259), new Vec2(284.5, 280),
                new Vec2(212.5, 280)]);
            newModel8.renormalizeVertices(true);
            model.addChild(newModel8);
            newModel8.setAttribute('fill', "#8b572a");
            //shirt-------------------------------------------------------
            const newModel9 = new A1Model();
            newModel9.setVertices([new Vec2(123.5, 317), new Vec2(59.5, 317), new Vec2(59.5, 419), new Vec2(442.5, 420),
                new Vec2(442.5, 317)]);
            newModel9.renormalizeVertices(true);
            model.addChild(newModel9);
            newModel9.setAttribute('fill', "#50e3c2");
            //neck-------------------------------------------------------
            const newModel10 = new A1Model();
            newModel10.setVertices([new Vec2(185.5, 316), new Vec2(185.5, 341), new Vec2(221.5, 341),
                new Vec2(221.5, 359), new Vec2(275.5, 359), new Vec2(275.5, 341), new Vec2(313.5, 341),
                new Vec2(313.5, 317)]);
            newModel10.renormalizeVertices(true);
            model.addChild(newModel10);
            newModel10.setAttribute('fill', "#d4a951");
        }

        //gudetama
        else {
            //egg white-------------------------------------------------------
            const newModel1 = new A1Model();
            newModel1.setVertices([new Vec2(148.5, 235), new Vec2(107.5, 252), new Vec2(38.5, 267),
                new Vec2(16.5, 303), new Vec2(23.5, 334), new Vec2(42.5, 361), new Vec2(103.5, 374),
                new Vec2(133.5, 392), new Vec2(163.5, 423), new Vec2(207.5, 438), new Vec2(272.5, 433),
                new Vec2(321.5, 414), new Vec2(410.5, 378), new Vec2(452.5, 371), new Vec2(479.5, 349),
                new Vec2(481.5, 320), new Vec2(480.5, 286), new Vec2(425.5, 269), new Vec2(366.5, 228)]);
            newModel1.renormalizeVertices(true);
            model.addChild(newModel1);
            newModel1.setAttribute('fill', "#ffffff");
            newModel1.setAttribute('linewidth', "6.2");
            //egg white shadow-------------------------------------------------------

            //body-------------------------------------------------------
            const newModel3 = new A1Model();
            newModel3.setVertices([new Vec2(161.5, 119), new Vec2(195.5, 92), new Vec2(245.5, 81), new Vec2(298.5, 96),
                new Vec2(345.5, 129), new Vec2(366.5, 224), new Vec2(359.499, 335.999), new Vec2(342.499, 363),
                new Vec2(299.5, 374), new Vec2(266.499, 383), new Vec2(252.5, 375), new Vec2(258.5, 363.999),
                new Vec2(274.5, 363), new Vec2(294.499, 340), new Vec2(279.499, 354), new Vec2(204.5, 340),
                new Vec2(164.5, 348.999), new Vec2(141.5, 354), new Vec2(126.5, 349), new Vec2(119.5, 338),
                new Vec2(132.5, 332), new Vec2(142.5, 333), new Vec2(152.5, 330), new Vec2(157.499, 305),
                new Vec2(150.5, 268.999), new Vec2(148.5, 216), new Vec2(152.5, 166)]);
            newModel3.renormalizeVertices(true);
            model.addChild(newModel3);
            newModel3.setAttribute('fill', "#f5a623");
            newModel3.setAttribute('linewidth', "6.2");
            //shine-------------------------------------------------------
            const newModel4 = new A1Model();
            newModel4.setVertices([new Vec2(341.5, 156.999), new Vec2(335.5 ,153.999), new Vec2(331.5, 160.999),
                new Vec2(333.499, 174.999), new Vec2( 338.5, 187.999), new Vec2(343.5, 195.999), new Vec2(348.5, 197),
                new Vec2(350.5, 187.999), new Vec2(346.5, 169.999)]);
            newModel4.renormalizeVertices(true);
            model.addChild(newModel4);
            newModel4.setAttribute('fill', "#ffffff");
            newModel4.setAttribute('stroke', "#ffffff");
            newModel4.setAttribute('linewidth', "6.2");
            //left arm-------------------------------------------------------
            const newModel5 = new A1Model();
            newModel5.setVertices([new Vec2(148.499, 206), new Vec2(135.5, 169), new Vec2(137.499, 132.999),
                new Vec2(147.499, 111.999), new Vec2(162.499, 107.999), new Vec2(175.5, 110.999),
                new Vec2(177.5, 119.999), new Vec2(171.5, 127.999), new Vec2(162.5, 131), new Vec2(156.5, 136),
                new Vec2(150.5, 165)]);
            newModel5.renormalizeVertices(true);
            model.addChild(newModel5);
            newModel5.setAttribute('fill', "#f5a623");
            newModel5.setAttribute('linewidth', "6.2");
            //right arm-------------------------------------------------------
            const newModel6 = new A1Model();
            newModel6.setVertices([new Vec2(304.5, 231.999), new Vec2(292.5 ,244.999), new Vec2(276.5,250.999),
                new Vec2(271.5, 260.999), new Vec2(280.5, 265.999), new Vec2(294.5, 263.999), new Vec2(307.5, 257.999),
                new Vec2(322.5, 247.999)]);
            newModel6.renormalizeVertices(true);
            model.addChild(newModel6);
            newModel6.setAttribute('fill', "#f5a623");
            newModel6.setAttribute('linewidth', "6.2");
            //right arm2-------------------------------------------------------
            const newModel7 = new A1Model();
            newModel7.setVertices([new Vec2(310.5, 220.999), new Vec2(303.5, 241), new Vec2(312.5 ,250),
                new Vec2(333.5, 239)]);
            newModel7.renormalizeVertices(true);
            model.addChild(newModel7);
            newModel7.setAttribute('fill', "#f5a623");
            newModel7.setAttribute('stroke', "#f5a623");
            newModel7.setAttribute('linewidth', "6.2");
            //left eye-------------------------------------------------------
            const newModel8 = new A1Model();
            newModel8.setVertices([new Vec2(186.5, 150), new Vec2(190.5 ,146), new Vec2(198.5, 145),
                new Vec2(202.499, 148), new Vec2(199.5, 151), new Vec2(190.5, 153)]);
            newModel8.renormalizeVertices(true);
            model.addChild(newModel8);
            newModel8.setAttribute('fill', "#000000");
            newModel8.setAttribute('linewidth', "6.2");
            //right eye-------------------------------------------------------
            const newModel9 = new A1Model();
            newModel9.setVertices([new Vec2(253.5, 144.999), new Vec2(256.5, 142.999), new Vec2(266.5, 143.999),
                new Vec2(269.5, 147.999), new Vec2(265.5, 151), new Vec2(256.5, 150)]);
            newModel9.renormalizeVertices(true);
            model.addChild(newModel9);
            newModel9.setAttribute('fill', "#000000");
            newModel9.setAttribute('linewidth', "6.2");
            //mouth-------------------------------------------------------
            const newModel10 = new A1Model();
            newModel10.setVertices([new Vec2(215.5, 170.999), new Vec2(221.5 ,165.999), new Vec2(228.5, 163.999),
                new Vec2(234.5, 165.999), new Vec2(240.5, 170.999), new Vec2(241.499, 173.999),
                new Vec2(237.5, 174.999), new Vec2(220.5, 175)]);
            newModel10.renormalizeVertices(true);
            model.addChild(newModel10);
            newModel10.setAttribute('fill', "#ffffff");
            newModel10.setAttribute('linewidth', "4.2");

        }


    }

    addSurpriseShape(){
        this.addSurpriseShapeTo(this.model);
    }
    /**
     * The "run script" button will be hooked up to this function. You are welcome to play with it as
     * a way to test your code.
     */
    runScript(){
        this.addRandomShape();
    }

    addRandomShape(){
        this.addRandomShapeTo(this.model);
    }
}