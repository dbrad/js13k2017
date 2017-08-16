class Pt {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static from(x: number, y: number) {
        return new Pt(x, y);
    }
}
