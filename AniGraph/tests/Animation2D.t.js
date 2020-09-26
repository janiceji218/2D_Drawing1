// import Animation2D from "../Animation2D";
// import GraphicElement2D from "../GraphicElement2D/GraphicElement2D"
//
// test('Test get/set/add Elements for Animation2D', () => {
//     var a2d = new Animation2D({name: 'test_animation'});
//     const n_elems = 10;
//     var testElements = [];
//     for(let i=0;i<n_elems;i++){
//         testElements.push(new GraphicElement2D.model({name: "testElement"+String(i)}));
//     }
//
//     for(let j=0;j<testElements.length;j++){
//         a2d.addElement(testElements[j]);
//     }
//     expect(a2d.getElements().length).toBe(n_elems);
//
//     for(let k=0;k<n_elems;k++){
//         expect(a2d.getElements()[k]).toBe(testElements[k]);
//         expect(a2d.getElements()[k].name).toBe('testElement'+String(k));
//     }
// });