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
var Input;
(function (Input) {
    var KB;
    (function (KB) {
        var KEY;
        (function (KEY) {
            KEY[KEY["A"] = 65] = "A";
            KEY[KEY["D"] = 68] = "D";
            KEY[KEY["W"] = 87] = "W";
            KEY[KEY["S"] = 83] = "S";
            KEY[KEY["LEFT"] = 37] = "LEFT";
            KEY[KEY["RIGHT"] = 39] = "RIGHT";
            KEY[KEY["UP"] = 38] = "UP";
            KEY[KEY["DOWN"] = 40] = "DOWN";
            KEY[KEY["ENTER"] = 13] = "ENTER";
            KEY[KEY["SPACE"] = 32] = "SPACE";
            KEY[KEY["NUM_1"] = 49] = "NUM_1";
            KEY[KEY["NUM_2"] = 50] = "NUM_2";
            KEY[KEY["NUM_3"] = 51] = "NUM_3";
            KEY[KEY["NUM_4"] = 52] = "NUM_4";
            KEY[KEY["NUM_5"] = 53] = "NUM_5";
            KEY[KEY["C"] = 67] = "C";
        })(KEY = KB.KEY || (KB.KEY = {}));
        var META_KEY;
        (function (META_KEY) {
            META_KEY[META_KEY["UP"] = 0] = "UP";
            META_KEY[META_KEY["DOWN"] = 1] = "DOWN";
            META_KEY[META_KEY["LEFT"] = 2] = "LEFT";
            META_KEY[META_KEY["RIGHT"] = 3] = "RIGHT";
            META_KEY[META_KEY["ACTION"] = 4] = "ACTION";
        })(META_KEY = KB.META_KEY || (KB.META_KEY = {}));
        KB.KEY_BIND = [];
        KB.KEY_BIND[META_KEY.UP] = [KEY.W, KEY.UP];
        KB.KEY_BIND[META_KEY.DOWN] = [KEY.S, KEY.DOWN];
        KB.KEY_BIND[META_KEY.LEFT] = [KEY.A, KEY.LEFT];
        KB.KEY_BIND[META_KEY.RIGHT] = [KEY.D, KEY.RIGHT];
        KB.KEY_BIND[META_KEY.ACTION] = [KEY.SPACE, KEY.ENTER];
        var _isDown = [];
        var _isUp = [];
        var _wasDown = [];
        for (var i = 0; i < 256; i++) {
            _isUp[i] = true;
        }
        function isDown(keyCode) {
            return (_isDown[keyCode]);
        }
        KB.isDown = isDown;
        function wasDown(keyCode) {
            var result = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return result;
        }
        KB.wasDown = wasDown;
        function clearInputQueue() {
            for (var key in _wasDown) {
                _wasDown[key] = false;
            }
        }
        KB.clearInputQueue = clearInputQueue;
        function keyDown(event) {
            var keyCode = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode]) {
                _wasDown[keyCode] = true;
            }
            _isUp[keyCode] = false;
        }
        KB.keyDown = keyDown;
        function keyUp(event) {
            var keyCode = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }
        KB.keyUp = keyUp;
        function isBindDown(key) {
            var result = false;
            for (var _i = 0, _a = KB.KEY_BIND[key]; _i < _a.length; _i++) {
                var k = _a[_i];
                result = result || _isDown[k];
            }
            return result;
        }
        KB.isBindDown = isBindDown;
        function wasBindDown(key) {
            var result = false;
            for (var _i = 0, _a = KB.KEY_BIND[key]; _i < _a.length; _i++) {
                var k = _a[_i];
                result = result || _wasDown[k];
                _wasDown[k] = false;
            }
            return result;
        }
        KB.wasBindDown = wasBindDown;
    })(KB = Input.KB || (Input.KB = {}));
})(Input || (Input = {}));
var Game = (function () {
    function Game(window, canvas, audioContext) {
        this._canvas = canvas;
        this._window = window;
        this._audioContext = audioContext;
        ImageCache.Loader.add("sheet", "./sheet.png");
        ImageCache.Loader.load(this.init.bind(this));
    }
    Game.prototype.init = function () {
        this.engine = new Engine(this._canvas);
        this.bindings();
        this.engine.gsm.register('main-menu', new MainMenu(this));
        this.engine.gsm.register('game-screen', new GameScreen(this));
        this.engine.gsm.push('main-menu');
        this.engine.run();
    };
    Game.prototype.bindings = function () {
        this._window.addEventListener("resize", this.onResize.bind(this), false);
        this.onResize();
        this._window.onkeydown = Input.KB.keyDown;
        this._window.onkeyup = Input.KB.keyUp;
        this._window.onblur = this.engine.pause.bind(this.engine);
        this._window.onfocus = this.engine.unpause.bind(this.engine);
        this.audioEngine = new AudioEngine(this._audioContext);
    };
    Game.prototype.onResize = function () {
        var scaleX = window.innerWidth / this._canvas.width;
        var scaleY = window.innerHeight / this._canvas.height;
        var scaleToFit = Math.min(scaleX, scaleY) | 0;
        scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
        var size = [this._canvas.width * scaleToFit, this._canvas.height * scaleToFit];
        var offset = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
        var stage = document.getElementById("stage");
        var rule = "translate(" + (~~offset[0]) + "px, " + (~~offset[1]) + "px) scale(" + (~~scaleToFit) + ")";
        stage.style.transform = rule;
        stage.style.webkitTransform = rule;
    };
    return Game;
}());
(function (Game) {
    Game.GAME_PIXEL_WIDTH = 512;
    Game.GAME_PIXEL_HEIGHT = 288;
    Game.TILE_SIZE = 8;
})(Game || (Game = {}));
var GameState = (function () {
    function GameState(game) {
        this.game = game;
        this.redraw = true;
        this.requestingClear = false;
    }
    GameState.prototype.transitionIn = function () {
        this.redraw = true;
        this.update(0);
    };
    GameState.prototype.transitionOut = function () {
        this.redraw = true;
        this.update(0);
    };
    return GameState;
}());
var GameStateManager = (function () {
    function GameStateManager() {
        this.stateCollection = {};
        this.stateStack = [];
    }
    GameStateManager.prototype.register = function (stateName, gameState) {
        this.stateCollection[stateName] = gameState;
    };
    Object.defineProperty(GameStateManager.prototype, "current", {
        get: function () {
            return this.stateStack[this.stateStack.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    GameStateManager.prototype.push = function (stateName) {
        this.current && this.current.transitionOut();
        this.stateStack.push(this.stateCollection[stateName]);
        this.current && this.current.transitionIn();
    };
    GameStateManager.prototype.pop = function () {
        this.current && this.current.transitionOut();
        this.stateStack.pop();
        this.current && this.current.transitionIn();
    };
    return GameStateManager;
}());
var Engine = (function () {
    function Engine(canvas) {
        this.clearScreen = false;
        this.redraw = false;
        this.systemPause = false;
        this.screen = canvas;
        this.ctx = this.screen.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.screen.width;
        this.buffer.height = this.screen.height;
        this.bufferCtx = this.buffer.getContext("2d");
        this.bufferCtx.mozImageSmoothingEnabled = false;
        this.bufferCtx.imageSmoothingEnabled = false;
        this.gsm = new GameStateManager();
    }
    Engine.prototype.update = function (delta) {
        if (!this.systemPause) {
            this.gsm.current.update(delta);
        }
    };
    Engine.prototype.draw = function () {
        if (this.clearScreen || this.gsm.current.requestingClear) {
            this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.bufferCtx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.clearScreen = this.gsm.current.requestingClear = false;
        }
        if (!this.systemPause && (this.redraw || this.gsm.current.redraw)) {
            this.gsm.current.draw(this.bufferCtx);
            this.ctx.drawImage(this.buffer, 0, 0, Game.GAME_PIXEL_WIDTH, Game.GAME_PIXEL_HEIGHT, 0, 0, Game.GAME_PIXEL_WIDTH, Game.GAME_PIXEL_HEIGHT);
            this.redraw = this.gsm.current.redraw = false;
        }
        else if (this.systemPause && this.redraw) {
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, Game.GAME_PIXEL_WIDTH, Game.GAME_PIXEL_HEIGHT);
            this.ctx.globalAlpha = 1.0;
            this.redraw = this.gsm.current.redraw = false;
        }
    };
    Engine.prototype.loop = function () {
        var now = window.performance.now();
        var delta = (now - this.then);
        this.then = now;
        this.update(delta);
        this.draw();
        this.loopHandle = window.requestAnimationFrame(this.loop.bind(this));
    };
    Engine.prototype.run = function () {
        this.loopHandle = window.requestAnimationFrame(this.loop.bind(this));
    };
    Engine.prototype.stop = function () {
        window.cancelAnimationFrame(this.loopHandle);
    };
    Engine.prototype.pause = function () {
        this.systemPause = true;
        this.redraw = true;
    };
    Engine.prototype.unpause = function () {
        this.systemPause = false;
        this.gsm.current.redraw = this.clearScreen = true;
    };
    return Engine;
}());
var AudioEngine = (function () {
    function AudioEngine(audioContext) {
        this.audioContext = audioContext;
    }
    AudioEngine.prototype.beep = function (beep) {
        var ctx = this.audioContext;
        var osc = ctx.createOscillator();
        var gainOsc = ctx.createGain();
        var vol = beep.vol || 1;
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
    };
    return AudioEngine;
}());
var Beep = (function () {
    function Beep(freq1, freq2, shape, dur, vol) {
        this.freq1 = freq1;
        this.freq2 = freq2;
        this.shape = shape;
        this.dur = dur;
        this.vol = vol;
    }
    return Beep;
}());
var Component = (function () {
    function Component(name) {
        this.name = name;
    }
    return Component;
}());
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
var GameEntity = (function () {
    function GameEntity() {
        this.components = {};
        if (!GameEntity.autoID) {
            GameEntity.autoID = 0;
        }
        this.id = GameEntity.autoID++;
        return this;
    }
    GameEntity.prototype.addComponent = function (component) {
        this.components[component.name] = component;
        return this;
    };
    return GameEntity;
}());
var ImageCache;
(function (ImageCache) {
    var cache = {};
    function getTexture(name) {
        return cache[name];
    }
    ImageCache.getTexture = getTexture;
    var toLoad = {};
    var loadCount = 0;
    var Loader;
    (function (Loader) {
        function add(name, url) {
            toLoad[name] = url;
            loadCount++;
        }
        Loader.add = add;
        function load(callback) {
            var async = { counter: 0, loadCount: 0, callback: callback };
            var done = function (async) { if ((async.counter++) === async.loadCount) {
                async.callback();
            } };
            for (var img in toLoad) {
                cache[img] = new Image();
                cache[img].src = toLoad[img];
                cache[img].onload = done.bind(this, async);
                delete toLoad[img];
            }
            loadCount = 0;
        }
        Loader.load = load;
    })(Loader = ImageCache.Loader || (ImageCache.Loader = {}));
})(ImageCache || (ImageCache = {}));
var SpriteSheet = (function () {
    function SpriteSheet(imageName, sheetName, tileSize, gutter, subsheet, offset) {
        if (gutter === void 0) { gutter = 0; }
        if (subsheet === void 0) { subsheet = new Dm(0, 0); }
        if (offset === void 0) { offset = new Pt(0, 0); }
        this.sprites = [];
        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }
    SpriteSheet.prototype.reColourize = function (index, r, g, b, a) {
        var spriteCtx = this.sprites[index].getContext("2d");
        var colourData = spriteCtx.getImageData(0, 0, this.tileSize, this.tileSize);
        for (var i = 0; i < (this.tileSize * this.tileSize) * 4; i += 4) {
            colourData.data[i] = r || colourData.data[i];
            colourData.data[i + 1] = g || colourData.data[i + 1];
            colourData.data[i + 2] = b || colourData.data[i + 2];
            colourData.data[i + 3] = a || colourData.data[i + 3];
        }
        var sprite = document.createElement("canvas");
        sprite.width = sprite.height = this.tileSize;
        sprite.getContext("2d").putImageData(colourData, 0, 0);
        return sprite;
    };
    SpriteSheet.prototype.storeSprites = function (callback) {
        if (callback === void 0) { callback = null; }
        this.spritesPerRow = ((this.subsheet.w === 0 || this.subsheet.h === 0) ? (this.image.width / this.tileSize) : this.subsheet.w);
        this.spritesPerCol = ((this.subsheet.w === 0 || this.subsheet.h === 0) ? (this.image.height / this.tileSize) : this.subsheet.h);
        var sprite;
        for (var y = 0; y < this.spritesPerCol; y++) {
            for (var x = 0; x < this.spritesPerRow; x++) {
                sprite = this.sprites[x + (y * this.spritesPerRow)] = document.createElement("canvas");
                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                sprite.getContext("2d").drawImage(this.image, ((this.tileSize + this.gutter) * x) + this.offset.x, ((this.tileSize + this.gutter) * y) + this.offset.y, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    };
    return SpriteSheet;
}());
var SpriteSheetManager;
(function (SpriteSheetManager) {
    var sheets = {};
    function storeSheet(sheet) {
        sheets[sheet.name] = sheet;
    }
    SpriteSheetManager.storeSheet = storeSheet;
    function spriteSheet(name) {
        return sheets[name];
    }
    SpriteSheetManager.spriteSheet = spriteSheet;
})(SpriteSheetManager || (SpriteSheetManager = {}));
var GameScreen = (function (_super) {
    __extends(GameScreen, _super);
    function GameScreen(game) {
        return _super.call(this, game) || this;
    }
    GameScreen.prototype.transitionIn = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    GameScreen.prototype.transitionOut = function () {
        _super.prototype.transitionOut.call(this);
    };
    GameScreen.prototype.update = function (delta) {
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            this.game.engine.gsm.pop();
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.UP)) {
            this.game.audioEngine.beep(new Beep(300, 2000, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.DOWN)) {
            this.game.audioEngine.beep(new Beep(150, 400, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.LEFT)) {
            this.game.audioEngine.beep(new Beep(1500, 7500, 'square', 1, 1));
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.RIGHT)) {
            this.game.audioEngine.beep(new Beep(50, 3000, 'square', 1, 1));
        }
    };
    GameScreen.prototype.draw = function (ctx) {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.fillStyle = "blue";
            ctx.fillRect(0, 0, ~~(Game.GAME_PIXEL_WIDTH), ~~(Game.GAME_PIXEL_HEIGHT));
            ctx.globalAlpha = 0.75;
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "yellow";
            ctx.lineWidth = 2;
            ctx.fillText("This is the game screen, baby.", ~~((Game.GAME_PIXEL_WIDTH / 2) | 0), ~~(64));
        }
    };
    return GameScreen;
}(GameState));
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu(game) {
        var _this = _super.call(this, game) || this;
        _this.selectedIndex = 0;
        _this.menuOptions = ["Start", "Options", "Exit"];
        return _this;
    }
    MainMenu.prototype.transitionIn = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    MainMenu.prototype.transitionOut = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    MainMenu.prototype.update = function (delta) {
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            switch (this.selectedIndex) {
                case 0:
                    this.game.engine.gsm.push('game-screen');
                    break;
                case 1:
                    break;
                default:
                    window.location.reload();
                    break;
            }
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.DOWN)) {
            this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            this.redraw = this.requestingClear = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.UP)) {
            if (this.selectedIndex === 0) {
                this.selectedIndex = this.menuOptions.length - 1;
            }
            else {
                this.selectedIndex = (this.selectedIndex - 1) % 3;
            }
            this.redraw = this.requestingClear = true;
        }
    };
    MainMenu.prototype.draw = function (ctx) {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.font = "18px Verdana";
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.fillText("js13k 2017", ~~((Game.GAME_PIXEL_WIDTH / 2) | 0), ~~(64));
            for (var i = 0; i < this.menuOptions.length; i++) {
                ctx.fillText(this.menuOptions[i], ~~((Game.GAME_PIXEL_WIDTH / 2) | 0), ~~(((Game.GAME_PIXEL_HEIGHT) | 0) - (this.menuOptions.length * 36) + (i * 36)));
            }
            ctx.strokeRect(~~(Game.GAME_PIXEL_WIDTH / 2 - 75), ~~((Game.GAME_PIXEL_HEIGHT) - ((this.menuOptions.length) * 36) + (this.selectedIndex * 36) - 18), 150, 24);
        }
    };
    return MainMenu;
}(GameState));
