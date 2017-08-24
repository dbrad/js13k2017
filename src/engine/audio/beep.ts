/**
 * @class Beep
 * @desc Class used to wrap the information passed in to generate a beep in the audio engine.
 */
class Beep {
    /**
     * @type {number}
     * @memberof Beep
     */
    freq1: number;

    /**
     * @type {number}
     * @memberof Beep
     */
    freq2: number;

    /**
     * @type {OscillatorType}
     * @memberof Beep
     */
    shape: OscillatorType;

    /**
     * @type {number}
     * @memberof Beep
     */
    dur: number;

    /**
     * @type {number}
     * @memberof Beep
     */
    vol: number;

    /**
     * Creates an instance of Beep.
     * @param {number} freq1 
     * @param {number} freq2 
     * @param {OscillatorType} shape 
     * @param {number} dur 
     * @param {number} vol 
     * @memberof Beep
     */
    constructor(freq1: number, freq2: number, shape: OscillatorType, dur: number, vol: number) {
        this.freq1 = freq1;
        this.freq2 = freq2;
        this.shape = shape;
        this.dur = dur;
        this.vol = vol;
    }
}