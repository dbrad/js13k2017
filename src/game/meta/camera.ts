/**
 * @class Camera
 */
class Camera {
    /**
     * @name position
     * @type {Pt}
     * @memberof Camera
     */
    p: Pt;
    /**
     * @name size
     * @type {Dm}
     * @memberof Camera
     */
    s: Dm;
    /**
     * @name zoom
     * @type {boolean}
     * @memberof Camera
     */
    z: boolean;
    /**
     * Creates an instance of Camera.
     * @param {Pt} p 
     * @param {Dm} s 
     * @memberof Camera
     */
    constructor(p: Pt, s: Dm) {
        this.p = p;
        this.s = s;
    }
}