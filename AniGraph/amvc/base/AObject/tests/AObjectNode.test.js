import AObjectNode from "../AObjectNode";

export function AObjectNodeTest(aClass){
    return test('AObjectNode test for: '+aClass.contructor.name, () => {
        TestAObjectNodeClass(aClass);
    });
}

export function TestAObjectNodeClass(aClass){
    const name = aClass.constructor.name;
    var newob = new aClass({name: name});
    expect(newob.name).toBe(name);
}

// AObjectNodeTest(AObjectNode);

test('AObjectNode test for: '+name, () => {
    TestAObjectNodeClass(AObjectNode);
});

