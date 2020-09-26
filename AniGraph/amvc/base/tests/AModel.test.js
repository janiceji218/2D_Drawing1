import {TestAObjectClass} from "../AObject/tests/AObject.test";
import AModel from "../mvc/AModel";


export function AModelTest(aClass){
    const name = aClass.constructor.name;
    return test('AModel test for: '+name, () => {
        TestAModelClass(aClass);
    });
}

export function TestAModelClass(aClass){
    TestAObjectClass(aClass);
    const name = aClass.constructor.name;
    var newob = new aClass({name: name});
    expect(newob.name).toBe(name);
}


test('Test AModel', () => {
    TestAModelClass(AModel);
});