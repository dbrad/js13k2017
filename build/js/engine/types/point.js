var Pt = (function () {
    function Pt(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Pt.from = function (x, y) {
        return new Pt(x, y);
    };
    return Pt;
}());
