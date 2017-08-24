/**
 * @class AudioEngine
 */
class AudioEngine {
    /**
     * @private
     * @type {AudioContext}
     * @memberof AudioEngine
     */
    private audioContext: AudioContext;
    /**
     * Creates an instance of AudioEngine.
     * @param {AudioContext} audioContext 
     * @memberof AudioEngine
     */
    constructor(audioContext: AudioContext) {
        this.audioContext = audioContext;
    }
    /**
     * @param {Beep} beep 
     * @memberof AudioEngine
     */
    beep(beep: Beep): void {
        let ctx: AudioContext = this.audioContext;
        let osc: OscillatorNode = ctx.createOscillator();
        let gainOsc: GainNode = ctx.createGain();
        let vol: number = beep.vol || 1;
        osc.type = beep.shape;
        osc.frequency.setValueAtTime(beep.freq1, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(beep.freq2, ctx.currentTime + beep.dur / 2);
        osc.frequency.exponentialRampToValueAtTime(beep.freq1, ctx.currentTime + beep.dur);
        gainOsc.gain.setValueAtTime(vol, ctx.currentTime);
        gainOsc.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + beep.dur);
        osc.connect(gainOsc);
        gainOsc.connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + beep.dur);
    }
}