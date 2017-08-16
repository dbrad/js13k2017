var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var ECS;
(function (ECS) {
    var AABB = (function (_super) {
        __extends(AABB, _super);
        function AABB(_a) {
            var _b = _a.w, w = _b === void 0 ? 0 : _b, _c = _a.h, h = _c === void 0 ? 0 : _c;
            var _this = _super.call(this, 'aabb') || this;
            _this.value = new Dm(w, h);
            return _this;
        }
        return AABB;
    }(Component));
    ECS.AABB = AABB;
    var Pos = (function (_super) {
        __extends(Pos, _super);
        function Pos(_a) {
            var _b = _a.x, x = _b === void 0 ? 0 : _b, _c = _a.y, y = _c === void 0 ? 0 : _c;
            var _this = _super.call(this, 'position') || this;
            _this.value = new Pt(x, y);
            return _this;
        }
        return Pos;
    }(Component));
    ECS.Pos = Pos;
    var Style = (function (_super) {
        __extends(Style, _super);
        function Style(colour) {
            var _this = _super.call(this, 'style') || this;
            _this.value = colour;
            return _this;
        }
        return Style;
    }(Component));
    ECS.Style = Style;
    var Sprite = (function (_super) {
        __extends(Sprite, _super);
        function Sprite(sprite) {
            var _this = _super.call(this, 'sprite') || this;
            _this.value = sprite;
            return _this;
        }
        return Sprite;
    }(Component));
    ECS.Sprite = Sprite;
    var Tag = (function (_super) {
        __extends(Tag, _super);
        function Tag(tag, value) {
            var _this = _super.call(this, tag) || this;
            _this.value = value;
            return _this;
        }
        return Tag;
    }(Component));
    ECS.Tag = Tag;
    var Flag = (function (_super) {
        __extends(Flag, _super);
        function Flag(name, value) {
            var _this = _super.call(this, name) || this;
            _this.value = value;
            return _this;
        }
        return Flag;
    }(Component));
    ECS.Flag = Flag;
})(ECS || (ECS = {}));
