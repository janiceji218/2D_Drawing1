import AView from "../mvc/AView"
import {TestAObjectClass} from "../AObject/tests/AObject.test";
import AModel from "../mvc/AModel";


export function AViewTest(aClass){
    const name = aClass.constructor.name;
    return test('AView test for: '+name, () => {
        TestAViewClass(aClass);
    });
}

export function TestAViewClass(aClass){
    TestAObjectClass(aClass);
    const name = aClass.constructor.name;
    var newob = new aClass({name: name});
    expect(newob.name).toBe(name);
}


test('Test AModel', () => {
    TestAViewClass(AModel);
});
