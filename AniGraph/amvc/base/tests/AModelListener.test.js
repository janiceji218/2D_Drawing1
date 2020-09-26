import {TestAObjectClass} from "../AObject/tests/AObject.test";
import AModelListener from "../mvc/AModelListener";
import AObject from "../AObject/AObject";


export function AModelListenerTest(aClass){
    const name = aClass.constructor.name;
    return test('AModelListener test for: '+name, () => {
        TestAModelListenerClass(aClass);
    });
}

export function TestAModelListenerClass(aClass){
    TestAObjectClass(aClass);
    const name = aClass.constructor.name;
    var newob = new aClass({name: name});
    expect(newob.name).toBe(name);
}

describe('Test Model Listener:', () => {
    test('Test AModelListener', () => {
        TestAModelListenerClass(AModelListener);
    });
});