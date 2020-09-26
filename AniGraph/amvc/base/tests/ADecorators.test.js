// import {TestAObjectClass} from "./AObject.test";
//
// // Learn about decorators here
// // https://medium.com/jspoint/a-minimal-guide-to-ecmascript-decorators-55b70338215e
//
// import {changeDescriptor} from "../utils/ADecorators";
//
//
// function ClassDecorator() {
//     return function( target ) {
//         // add new element
//         const name='decoratedclassfunction';
//         function callback(){
//             // console.log("in "+name);
//             return this.constructor.name;
//         }
//
//         target.elements.push( {
//             kind: 'method',
//             key: name,
//             placement: 'prototype',
//             descriptor: {
//                 value: callback,
//                 writable: false,
//                 configurable: false,
//                 enumerable: false,
//             }
//         } );
//
//         return target;
//     }
// }
//
//
//
//
//
//
// class Porridge {
//     constructor(viscosity = 10) {
//         this.viscosity = viscosity;
//     }
//
//     stir() {
//         if (this.viscosity > 15) {
//             console.log('This is pretty thick stuff.');
//         } else {
//             console.log('Spoon goes round and round.');
//         }
//     }
// }
//
// @ClassDecorator()
// class Oatmeal extends Porridge {
//     // @readOnly
//     @changeDescriptor('writable', false)
//     viscosity = 20;
//
//     constructor(flavor) {
//         super();
//         this.flavor = flavor;
//     }
// }
//
// test('AModelListener test for: '+name, () => {
//     var om = new Oatmeal('datflav');
//     om.decoratedclassfunction();
//     expect(om.viscosity).toBe(20);
// });
