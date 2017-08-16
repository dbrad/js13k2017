class Dm {
    w: number;
    h: number;
    constructor(w: number = 0, h: number = 0) {
        this.w = w;
        this.h = h;
    }

    static from(w: number, h: number) {
        return new Dm(w, h);
    }
}
