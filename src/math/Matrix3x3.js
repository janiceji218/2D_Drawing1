/*
 * Copyright (c) 2020. Abe Davis
 */

import {default as _Matrix3x3} from "../../AniGraph/math/Matrix3x3";

export default class Matrix3x3 extends _Matrix3x3{
    /**
     * Given an object with the keys 'origin', 'rotation', 'translation', and 'scale', compute
     * the corresponding matrix
     * @param args
     * @returns {*}
     * @constructor
     */
    static FromProperties(args){
        const margs = args;
        const o= Matrix3x3.Translation(margs.origin);
        const r = Matrix3x3.Rotation(margs.rotation);
        const s = Matrix3x3.Scale(margs.scale);
        const t= Matrix3x3.Translation(margs.translation);
        return o.times(r).times(s).times(t);
    }

}