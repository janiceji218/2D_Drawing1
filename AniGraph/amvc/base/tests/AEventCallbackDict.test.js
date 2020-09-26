import AObject from "../AObject/AObject";
import AEventCallbackDict from "../events/beta/AEventCallbackDict";

export function AEventCallbackDictTest(aClass){
    return test('AEventCallbackDict test for: '+name, () => {
        TestAEventCallbackDictClass(aClass);
    });
}

export function TestAEventCallbackDictClass(aClass){
    const name = aClass.constructor.name;
    var newob = new aClass({name: name});

    var counter = 0;

    function addToCounter(amount){
        counter = counter+amount;
    }
    newob.addCallback(addToCounter);

    newob.signalEvent(1);
    newob.signalEvent(10);
    newob.signalEvent(100);
    newob.signalEvent(1000);
    expect(counter).toBe(1111);
}

// AObjectTest(AObject);

test('AEventCallbackDict test for: '+name, () => {
    TestAEventCallbackDictClass(AEventCallbackDict);
});

