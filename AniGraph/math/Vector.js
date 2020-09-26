import Precision from "./Precision";

const PRECISION = 1e-6;

export default class Vector{
    constructor(elements){
        this.setElements(elements);
    }

    get nDimensions (){return this.elements.length;}

    L2(){
        return Math.sqrt(this.dot(this));
    }

    equalTo(vector){
        var n = this.elements.length;
        var V = vector.elements || vector;
        if(n !== V.length){
            return false;
        }
        while(n--){
            if (Math.abs(this.elements[n] - V[n]) > PRECISION){
                return false;
            }
        }
        return true;
    }

    dup(){
        return new this.constructor(this.elements);
    }

    getHomogeneousPoint(){
        const rval = this.dup();
        rval.elements.push(1);
        return rval;
    }
    getHomogeneousVector(){
        const rval = this.dup();
        rval.elements.push(0);
        return rval;
    }

    getNonHomogeneous(){
        const rval = this.dup();
        const h = rval.elements.pop();
        if(h==0){
            return rval;
        }else{
            return rval.times(1.0/h);
        }
    }


    getMapped (fn, context){
        var elements = [];
        this.forEach(function(x, i){
            elements.push(fn.call(context, x, i));
        });
        return new this.constructor(elements);
    }

    forEach (fn, context){
        var n = this.elements.length;
        for (let i = 0; i < n; i++){
            fn.call(context, this.elements[i], i+1);
        }
    }

    normalize(){var r=this.L2();
        if(r===0){
            return this;
        }
        var n = this.elements.length;
        var rinv = 1.0/r;
        for (let i = 0; i < n; i++){
            this.elements[i]=this.elements[i]*rinv;
        }
    }

    getNormalized(){
        var r = this.L2();
        if (r === 0){
            return this.dup();
        }
        return this.getMapped(function(x){
            return x/r;
        });
    }

    plus(vector){
        var V = vector.elements || vector;
        if (this.elements.length !== V.length) {
            return null;
        }
        return this.getMapped(function(x, i) { return x + V[i-1]; });
    }

    minus (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length){
            return null;
        }
        return this.getMapped(function(x, i){
            return x - V[i-1];
        });
    }

    addVector (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length)
        {
            return null;
        }
        var n = this.nDimensions;
        for (let i = 0; i < n; i++)
        {
            this.elements[i]=this.elements[i]+vector.elements[i];
        }
        return this;
    }

    subtractVector (vector)
    {
        var V = vector.elements || vector;
        if (this.elements.length !== V.length)
        {
            return null;
        }
        var n = this.nDimensions;
        for (let i = 0; i < n; i++)
        {
            this.elements[i]=this.elements[i]-vector.elements[i];
        }
        return this;
    }

    times(k){
        return this.getMapped(function(x){
            return x*k;
        });
    }

    dot(vector){
        var V = vector.elements || vector;
        var i, product = 0, n = this.elements.length;
        if(n !== V.length){
            return null;
        }
        while(n--){
            product += this.elements[n] * V[n];
        }
        return product;
    }

    cross(vector)
    {
        var B = vector.elements || vector;
        if (this.elements.length !== 3 || B.length !== 3){
            return null;
        }
        var A = this.elements;
        return new this.constructor([
            (A[1] * B[2]) - (A[2] * B[1]),
            (A[2] * B[0]) - (A[0] * B[2]),
            (A[0] * B[1]) - (A[1] * B[0])
        ]);
    }

    max()
    {
        var m = 0, i = this.elements.length;
        while (i--){
            if (Math.abs(this.elements[i]) > Math.abs(m))
            {
                m = this.elements[i];
            }
        }
        return m;
    }

    indexOf(x)
    {
        var index = null, n = this.elements.length;
        for (let i = 0; i < n; i++){
            if (index === null && this.elements[i] === x)
            {
                index = i + 1;
            }
        }
        return index;
    }

    getRounded(){
        return this.getMapped(function(x){
            return Math.round(x);
        });
    }

    snapTo(x){
        return this.getMapped(function(y){
            return (Math.abs(y - x) <= PRECISION) ? x : y;
        });
    }

    distanceFrom(obj){
        if (obj.anchor || (obj.start && obj.end)){
            return obj.distanceFrom(this);
        }
        var V = obj.elements || obj;
        if (V.length !== this.elements.length){
            return null;
        }
        var sum = 0, part;
        this.forEach(function(x, i){
            part = x - V[i-1];
            sum += part * part;
        });
        return Math.sqrt(sum);
    }

    inspect(){
        return '[' + this.elements.join(', ') + ']';
    }

    setElements(els){
        if(els.elements){this.elements = els.elements.slice(); return this;}
        else{
            this.elements = els.slice();
            return this;
        }
    }

    flatten(){
        return this.elements;
    }

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

export class Vec2 extends Vector{
    constructor(x,y) {
        if(x===undefined){
            super([0,0]);
        }else if(Array.isArray(x)){
            console.assert(y===undefined, {inputs: [x,y], errorMsg: "problem with Vec2 inputs"});
            super(x);
        }else if(x.elements!==undefined) {
            super(x.elements);
        }else{
            super([x,y]);
        }
        if(typeof x == 'number' && y===undefined){
            super([x,x]);
        }
        // console.assert(elements.length===2, "Cannot create Vec2 with length "+elements.length);
    }

    plus(...args){
        const v2 = new Vec2(...args);
        return new Vec2(this.x+v2.x, this.y+v2.y);
    }
    minus(...args){
        const v2 = new Vec2(...args);
        return new Vec2(this.x-v2.x, this.y-v2.y);
    }

    toString(){
        return `Vec2(${this.x},${this.y})`;
    }

    getAsPoint2D(){
        return new Point2D(this.x, this.y);
    }
    getHomogeneousVector2D(){
        return new Vec3(this.x, this.y, 0);
    }

    getHomogeneousPoint2D(){
        return new Point2D(this.x, this.y);
    }

    getNonHomogeneous(){
        throw new Error("Don't de-homogenize Vec2's");
    }


    set x(value){this.elements[0]=value;}
    get x(){return this.elements[0];}
    set y(value){this.elements[1]=value;}
    get y(){return this.elements[1];}

    hcross(v2){
        const det = this.x*v2.y-this.y*v2.x;
        return new Vec2([det*(this.y-v2.y), det*(this.x-v2.x)]);
    }
    sstring(){
        return `[${this.x},${this.y}]`;
    }

    static RandomVecs(n, mean=0, range=1){
        const vscale = new Vec2(range);
        const vmean = new Vec2(mean)
        const rvals = [];
        for(let i=0;i<n;i++){
            rvals.push(new Vec2(vmean.x+(Math.random()-0.5)*vscale.x, vmean.y+(Math.random()-0.5)*vscale.y));
        }
        return rvals;
    }

}


export class Vec3 extends Vector{

    constructor(x,y,z){
        if(x===undefined){
            super([0,0,0]);
        }else if(Array.isArray(x)){
            console.assert(y===undefined, {inputs: [x,y,z], errorMsg: "problem with Vec3 inputs"});
            if(x.length===2){
                super([x[0],x[1],1]);
            }else if(x.length===3){
                super(x);
            }else {
                throw Error(`cannot create Vec3 with array ${x} of length ${x.length}`);
            }
        }else if(x.elements!==undefined) {
            if(x.elements.length===2) {
                super([x.elements[0], x.elements[1], 1]);
            }else {
                super(x.elements);
            }
        }else{
            super([x,y,z]);
        }
    }


    plus(...args){
        const v3 = new Vec3(...args);
        return new Vec3(this.x+v3.x, this.y+v3.y, this.z+v3.z);
    }
    minus(...args){
        const v3 = new Vec3(...args);
        return new Vec3(this.x-v3.x, this.y-v3.y, this.z-v3.z);
    }

    toString(){
        return `Vec3(${this.x},${this.y},${this.z})`;
    }

    get x(){
        return this.elements[0];
    }
    get y(){
        return this.elements[1];
    }
    get z(){
        return this.elements[2];
    }
    get i(){
        return this.elements[0];
    }
    get j(){
        return this.elements[1];
    }
    get k(){
        return this.elements[2];
    }

    homogenize(){
        if(this.elements[2]===1 || this.elements[2]===0){
            return;
        }
        this.elements[0]=this.elements[0]/this.elements[2];
        this.elements[1]=this.elements[1]/this.elements[2];
        this.elements[2]=1;
    }

    getHomogenized(){
        const h = this.dup();
        h.homogenize();
        return h;
    }

    getAsPoint2D(){
        const p = this.getHomogenized();
        p.geoType = 'Point2D';
        return p;
    }

    getNonHomogeneous(){
        if(Precision.PEQ(this.z,0) || this.z==1){
            return new Vec2(this.x, this.y);
        }else{
            return new Vec2(this.x/this.z, this.y/this.z);
        }
    }

    sstring(){
        return `[${this.x},${this.y},${this.z}]`;
    }
}

export function Point2D(x,y){
    const p = new Vec2(x,y);
    p.geoType = 'Point2D';
    return p;
}