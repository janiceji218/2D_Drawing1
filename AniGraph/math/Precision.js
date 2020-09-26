/***
 * Convenience class for specifying and dealing with some precision issues.
 */
export default class Precision{
    static tinyValue=1e-6;
    static SMALLEST = 2*Number.MIN_VALUE;
    static isTiny(a){return Math.abs(a)<=this.tinyValue;}
    static signedTiny(a, epsilon){
        const tinyValue = epsilon ? epsilon : this.tinyValue;
        if(!this.isTiny(a)){
            return a;
        }else{
            return (a>=0)? tinyValue : -tinyValue;
        }
    }
    static PEQ(a,b){
        return Math.abs(a-b)<this.tinyValue;
    }
}


