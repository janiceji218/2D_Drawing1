/*
 * Copyright (c) 2020. Abe Davis
 */

import {Vec2 as _Vec2} from "../../AniGraph/math/Vector";

export default class Vec2 extends _Vec2{
    /**
     * Calculates the minimum and maximum values in each dimensions, returning:
     * [new Vec2(minX,minY), new Vec2(maxX,maxY)]
     * @param pointList
     * @param ndimensions
     * @returns {[minValuesCornerPoint, maxValuesCornerPoint]}
     * @constructor
     */
    static GetPointBounds(pointList, ndimensions){
        if(ndimensions!==undefined){console.assert(pointList[0].elements.length===ndimensions, "points have wrong number of dimensions!");}
        const bmin = pointList[0].dup();
        const bmax = pointList[0].dup();
        pointList.map(v=>{
            var n = v.elements.length;
            console.assert(n===bmin.elements.length, "Points in list have inconsistent numbers of dimensions");
            for (let i = 0; i < n; i++){
                if(v.elements[i]<bmin.elements[i]){
                    bmin.elements[i]=v.elements[i];
                }
                if(v.elements[i]>bmax.elements[i]){
                    bmax.elements[i]=v.elements[i];
                }
            }
        })
        return [bmin, bmax];
    }
}