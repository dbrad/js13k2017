class Beep {
    freq1: number;
    freq2: number;
    shape: OscillatorType;
    dur: number;
    vol: number;

    constructor(freq1: number, freq2: number, shape: OscillatorType, dur: number, vol: number) {
        this.freq1 = freq1;
        this.freq2 = freq2;
        this.shape = shape;
        this.dur = dur;
        this.vol = vol;
    }
}