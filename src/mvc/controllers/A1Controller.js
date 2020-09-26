import AShape2DController from "../../../AniGraph/amvc/2d/ashape/mvc/AShape2DController";
import A1Model from "../A1Model";
import A1View from "../views/A1View";


export default class A1Controller extends AShape2DController{
    getModelClassMap(){
        return {
            'default': {
                controllerClass: A1Controller,
                viewClass: A1View,
                modelClass: A1Model
            }
        }
    }

}