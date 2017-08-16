var Dm = (function () {
    function Dm(w, h) {
        if (w === void 0) { w = 0; }
        if (h === void 0) { h = 0; }
        this.w = w;
        this.h = h;
    }
    Dm.from = function (w, h) {
        return new Dm(w, h);
    };
    return Dm;
}());
