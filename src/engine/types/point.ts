class Pt {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    static from(p: Pt) {
        let _p: Pt = new Pt();
        _p.x = p.x;
        _p.y = p.y;
        return _p;
    }
}
