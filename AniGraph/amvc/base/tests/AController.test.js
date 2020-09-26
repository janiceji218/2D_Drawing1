import AController from "../mvc/AController"
import AGraphicsContext2D from "../../2d/contexts/AGraphicsContext2D";
import AComponent from "../../../components/AComponent";

export function AControllerTest(aClass){
    return test('AController test for: '+aClass.constructor.name, () => {
        TestAControllerClass(aClass);
    });
}

export function TestAControllerClass(aClass){
    var ob = new aClass({component: new AComponent()});
    expect(1).toBe(1);
}


test('Test AController', () => {
    TestAControllerClass(AController);
});





