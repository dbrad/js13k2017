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
            KEY[KEY["ESC"] = 27] = "ESC";
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
    function Game() {
    }
    Object.defineProperty(Game, "i", {
        get: function () {
            if (!Game._i) {
                Game._i = new Game();
            }
            return Game._i;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Game, "gd", {
        get: function () {
            if (!Game.i._gc) {
                Game.i._gc = new GameData();
            }
            return Game.i._gc;
        },
        enumerable: true,
        configurable: true
    });
    Game.prototype.init = function (window, canvas, audioContext) {
        this._c = canvas;
        this._w = window;
        this._ac = audioContext;
        ImageCache.Loader.add("sheet", "./sheet.png");
        ImageCache.Loader.load(this.done.bind(this));
    };
    Game.prototype.done = function () {
        this.e = new Engine(this._c);
        this.bindings();
        this.e.gsm.reg('main-menu', new MainMenu());
        this.e.gsm.reg('game-screen', new GameScreen());
        this.e.gsm.reg('marker-menu', new MarkerMenu());
        this.e.gsm.push('main-menu');
        this.e.run();
    };
    Game.prototype.bindings = function () {
        this._w.addEventListener("resize", this.onResize.bind(this), false);
        this.onResize();
        this._w.onkeydown = Input.KB.keyDown;
        this._w.onkeyup = Input.KB.keyUp;
        this._w.onblur = this.e.pause.bind(this.e);
        this._w.onfocus = this.e.unpause.bind(this.e);
        this.ae = new AudioEngine(this._ac);
        SSM.storeSheet(new SpriteSheet('sheet', 'sprites', 8, 0, new Dm(5, 1)));
        SSM.storeSheet(new SpriteSheet('sheet', 'marker', 8, 0, new Dm(2, 1), new Pt(8, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'floor', 8, 0, new Dm(3, 1), new Pt(8 * 3, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'wall', 8, 0, new Dm(4, 1), new Pt(8 * 6, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'guide', 8, 0, new Dm(3, 1), new Pt(0, 8)));
        SSM.storeSheet(new SpriteSheet('sheet', 'objects', 8, 0, new Dm(3, 1), new Pt(8 * 3, 8)));
    };
    Game.prototype.onResize = function () {
        var scaleX = window.innerWidth / this._c.width;
        var scaleY = window.innerHeight / this._c.height;
        var scaleToFit = Math.min(scaleX, scaleY) | 0;
        scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
        var size = [this._c.width * scaleToFit, this._c.height * scaleToFit];
        var offset = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
        var stage = document.getElementById("stage");
        var rule = "translate(" + (~~offset[0]) + "px, " + (~~offset[1]) + "px) scale(" + (~~scaleToFit) + ")";
        stage.style.transform = rule;
        stage.style.webkitTransform = rule;
    };
    return Game;
}());
(function (Game) {
    Game.P_W = 512;
    Game.P_H = 288;
    Game.T_W = 64;
    Game.T_H = 36;
    Game.T_S = 8;
})(Game || (Game = {}));
var GameState = (function () {
    function GameState() {
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
    GameStateManager.prototype.reg = function (stateName, gameState) {
        this.stateCollection[stateName] = gameState;
    };
    Object.defineProperty(GameStateManager.prototype, "cur", {
        get: function () {
            return this.stateStack[this.stateStack.length - 1];
        },
        enumerable: true,
        configurable: true
    });
    GameStateManager.prototype.push = function (stateName) {
        this.cur && this.cur.transitionOut();
        this.stateStack.push(this.stateCollection[stateName]);
        this.cur && this.cur.transitionIn();
    };
    GameStateManager.prototype.pop = function () {
        this.cur && this.cur.transitionOut();
        this.stateStack.pop();
        this.cur && this.cur.transitionIn();
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
        this.ctx.webkitImageSmoothingEnabled = false;
        this.buffer = document.createElement("canvas");
        this.buffer.width = this.screen.width;
        this.buffer.height = this.screen.height;
        this.bufferCtx = this.buffer.getContext("2d");
        this.bufferCtx.mozImageSmoothingEnabled = false;
        this.bufferCtx.imageSmoothingEnabled = false;
        this.bufferCtx.webkitImageSmoothingEnabled = false;
        this.gsm = new GameStateManager();
    }
    Engine.prototype.update = function (delta) {
        if (!this.systemPause) {
            this.gsm.cur.update(delta);
        }
    };
    Engine.prototype.draw = function () {
        if (this.clearScreen || this.gsm.cur.requestingClear) {
            this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.bufferCtx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.clearScreen = this.gsm.cur.requestingClear = false;
        }
        if (!this.systemPause && (this.redraw || this.gsm.cur.redraw)) {
            this.bufferCtx.globalAlpha = 1.0;
            this.bufferCtx.mozImageSmoothingEnabled = false;
            this.bufferCtx.imageSmoothingEnabled = false;
            this.bufferCtx.webkitImageSmoothingEnabled = false;
            this.gsm.cur.draw(this.bufferCtx);
            this.ctx.globalAlpha = 1.0;
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.drawImage(this.buffer, 0, 0, Game.P_W, Game.P_H, 0, 0, Game.P_W, Game.P_H);
            this.redraw = this.gsm.cur.redraw = false;
        }
        else if (this.systemPause && this.redraw) {
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, Game.P_W, Game.P_H);
            this.ctx.globalAlpha = 1.0;
            this.redraw = this.gsm.cur.redraw = false;
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
        this.gsm.cur.redraw = this.clearScreen = true;
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
var Pt = (function () {
    function Pt(x, y) {
        if (x === void 0) { x = 0; }
        if (y === void 0) { y = 0; }
        this.x = x;
        this.y = y;
    }
    Pt.from = function (p) {
        var _p = new Pt();
        _p.x = p.x;
        _p.y = p.y;
        return _p;
    };
    return Pt;
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
                var ctx = sprite.getContext("2d");
                ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                ctx.drawImage(this.image, ((this.tileSize + this.gutter) * x) + this.offset.x, ((this.tileSize + this.gutter) * y) + this.offset.y, this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    };
    return SpriteSheet;
}());
var SSM;
(function (SSM) {
    var sheets = {};
    function storeSheet(sheet) {
        sheets[sheet.name] = sheet;
    }
    SSM.storeSheet = storeSheet;
    function spriteSheet(name) {
        return sheets[name];
    }
    SSM.spriteSheet = spriteSheet;
})(SSM || (SSM = {}));
var GameData = (function () {
    function GameData() {
        this.p = [];
        this.m = [];
        this.o = [];
        this.s = [];
        this.g = [];
        this.lm = [];
        this.lights = [];
        this.score = 0;
        this.t_score = 0;
        this.players = 0;
        this.markers = 0;
        this.P_OFF = 26;
        this.O_OFF = 16;
        this.M_OFF = 8;
    }
    GameData.prototype.setupGame = function (d) {
        var p;
        var g;
        var s;
        switch (d) {
            case diff.EASY:
                p = 2;
                g = 2;
                this.markers = 10;
                s = new Dm(100, 100);
                break;
            case diff.NORMAL:
                p = 2;
                g = 4;
                this.markers = 25;
                s = new Dm(175, 175);
                break;
            case diff.HARD:
                p = 4;
                g = 8;
                this.markers = 50;
                s = new Dm(250, 250);
                break;
            case diff.VHARD:
                p = 8;
                g = 16;
                this.markers = 100;
                s = new Dm(500, 500);
                break;
            default:
                p = 1;
                g = 2;
                this.markers = 10;
                s = new Dm(50, 50);
        }
        this.players = p;
        this.p.length = this.o.length = this.m.length = this.g.length = this.s.length = 0;
        this.buildObjBank(p, g, s);
        this.l = new Level(s);
        this.l.generate();
    };
    GameData.prototype.buildObjBank = function (p, g, s) {
        var seq = [0];
        var tot = ~~(s.w * s.h * 0.001);
        var t = ~~((tot - p - g) * .25);
        var m = ~~(tot - p - g - t);
        for (var i = 0; i < p; i++) {
            seq.push(1);
        }
        for (var i = 0; i < g; i++) {
            seq.push(2);
        }
        for (var i = 0; i < t; i++) {
            seq.push(3);
        }
        for (var i = 0; i < m; i++) {
            seq.push(4);
        }
        this.objectBank = randomized(seq, false);
    };
    GameData.prototype.addRandObj = function (o, s) {
        var obj = parseInt(this.objectBank());
        var p = new Pt(randomInt(o.x + 1, o.x + s.w - 2), randomInt(o.y + 1, o.y + s.h - 2));
        if (obj !== undefined) {
            switch (obj) {
                case 0:
                    this.exit = createObject(0);
                    this.addObject(this.exit, p);
                    break;
                case 1:
                    this.addSpawner(createSpawner('player'), p);
                    break;
                case 2:
                    this.addObject(createSwitch(), p);
                    break;
                case 3:
                    this.addObject(createObject(1), p);
                    this.t_score += 100000;
                    break;
                default:
                    this.addObject(createObject(2), p);
                    this.t_score += 1000;
                    break;
            }
        }
        else {
            this.addObject(createObject(2), p);
            this.t_score += 1000;
        }
    };
    GameData.prototype.addGuide = function (e, pos) {
        e.components["p-pos"].value = pos;
        e.components["p-origin"].value = Pt.from(pos);
        this.g.push(e);
    };
    GameData.prototype.addSpawner = function (e, pos) {
        e.components["p-pos"].value = pos;
        this.s.push(e);
    };
    GameData.prototype.addPlayer = function (e, pos) {
        e.components["p-pos"].value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.P;
        var ind = this.p.push(e);
        this.l.m[i] |= ((ind) << this.P_OFF);
    };
    GameData.prototype.addObject = function (e, pos) {
        e.components["p-pos"].value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.O;
        var ind = this.o.push(e);
        this.l.m[i] |= ((ind) << this.O_OFF);
    };
    GameData.prototype.addMarker = function (e, pos) {
        e.components["p-pos"].value = pos;
        var i = pos.x + (pos.y * this.l.s.w);
        this.l.m[i] |= TMASK.M;
        var ind = this.m.push(e);
        this.l.m[i] |= ((ind) << this.M_OFF);
    };
    GameData.prototype.movePlayer = function (op, np) {
        if (!this.l.m[op.x + (op.y * this.l.s.w)])
            return;
        var i = (this.l.m[op.x + (op.y * this.l.s.w)] >> this.P_OFF) - 1;
        this.removePlayer(op);
        if (this.l.m[np.x + (np.y * this.l.s.w)] == undefined)
            this.l.m[np.x + (np.y * this.l.s.w)] = 0;
        this.l.m[np.x + (np.y * this.l.s.w)] |= ((i + 1) << this.P_OFF);
        this.l.m[np.x + (np.y * this.l.s.w)] |= TMASK.P;
    };
    GameData.prototype.removePlayer = function (p) {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(15 << this.P_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.P);
    };
    GameData.prototype.removeMarker = function (p) {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(255 << this.M_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.M);
    };
    GameData.prototype.removeObject = function (p) {
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(1023 << this.O_OFF);
        this.l.m[p.x + (p.y * this.l.s.w)] &= ~(TMASK.O);
    };
    GameData.prototype.playerAt = function (p) {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.P) !== 0;
    };
    GameData.prototype.objectAt = function (p) {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.O) !== 0;
    };
    GameData.prototype.markerAt = function (p) {
        return (this.l.m[p.x + (p.y * this.l.s.w)] & TMASK.M) !== 0;
    };
    GameData.prototype.getObjectAt = function (p) {
        if (this.objectAt(p)) {
            var i = ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(15 << this.P_OFF)) >> this.O_OFF) - 1;
            return Game.gd.o[i];
        }
        return undefined;
    };
    GameData.prototype.getMarkerIndex = function (p) {
        if (this.markerAt(p)) {
            return ((this.l.m[p.x + (p.y * this.l.s.w)] & ~(16383 << this.O_OFF)) >> this.M_OFF) - 1;
        }
        return undefined;
    };
    GameData.prototype.getCurrPlayer = function () {
        for (var i in this.p) {
            if (this.p[i].components['input'] && this.p[i].components['input'].value === true) {
                return this.p[i];
            }
        }
        return undefined;
    };
    return GameData;
}());
var Camera = (function () {
    function Camera(p, s) {
        this.p = p;
        this.s = s;
    }
    return Camera;
}());
var cP = (function (_super) {
    __extends(cP, _super);
    function cP(name, p) {
        if (p === void 0) { p = new Pt(); }
        var _this = _super.call(this, 'p-' + name) || this;
        _this.value = p;
        return _this;
    }
    return cP;
}(Component));
var cSprite = (function (_super) {
    __extends(cSprite, _super);
    function cSprite(sprite) {
        var _this = _super.call(this, 'sprite') || this;
        _this.r = 0;
        _this.value = sprite;
        return _this;
    }
    return cSprite;
}(Component));
var cTag = (function (_super) {
    __extends(cTag, _super);
    function cTag(tag, value) {
        var _this = _super.call(this, tag) || this;
        _this.value = value;
        return _this;
    }
    return cTag;
}(Component));
var cFlag = (function (_super) {
    __extends(cFlag, _super);
    function cFlag(name, value) {
        var _this = _super.call(this, name) || this;
        _this.value = value;
        return _this;
    }
    return cFlag;
}(Component));
var cLight = (function (_super) {
    __extends(cLight, _super);
    function cLight(light) {
        var _this = _super.call(this, 'light') || this;
        _this.value = light;
        return _this;
    }
    return cLight;
}(Component));
var cSound = (function (_super) {
    __extends(cSound, _super);
    function cSound(name, beep) {
        var _this = _super.call(this, 's-' + name) || this;
        _this.value = beep;
        return _this;
    }
    return cSound;
}(Component));
var cTimer = (function (_super) {
    __extends(cTimer, _super);
    function cTimer(name, interval) {
        var _this = _super.call(this, 't-' + name) || this;
        _this.cur = 0;
        _this.value = interval;
        return _this;
    }
    return cTimer;
}(Component));
function createPlayer() {
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cP('move'));
    p.addComponent(new cSound('move', new Beep(50, 5, 'sine', .25, 1)));
    p.addComponent(new cTimer('move', 125));
    p.addComponent(new cLight(new Light(new Pt(), 0.75, 5)));
    p.addComponent(new cFlag('input', false));
    p.addComponent(new cSprite(SSM.spriteSheet("sprites").sprites[0]));
    return p;
}
function createGuidingLight() {
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cP('origin'));
    p.addComponent(new cTimer('move', 150));
    p.addComponent(new cLight(new Light(new Pt(), 0.35, 7)));
    p.addComponent(new cSprite(SSM.spriteSheet("guide").sprites[0]));
    return p;
}
function createMarker(t, r) {
    if (r === void 0) { r = 0; }
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    var s = new cSprite(SSM.spriteSheet("marker").sprites[t]);
    p.addComponent(new cLight(new Light(new Pt(), 0.15, 4)));
    s.r = r;
    p.addComponent(s);
    return p;
}
function createSpawner(t) {
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cTag('type', t));
    p.addComponent(new cFlag('done', false));
    return p;
}
function createSwitch() {
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cFlag('active', false));
    p.addComponent(new cSprite(SSM.spriteSheet("guide").sprites[1]));
    p.addComponent(new cTag('type', 'switch'));
    p.addComponent(new cSound('interact', new Beep(1900, 1, 'square', 0.1, 1)));
    return p;
}
function createObject(s) {
    var p = new GameEntity();
    p.addComponent(new cP('pos'));
    p.addComponent(new cSprite(SSM.spriteSheet("objects").sprites[s]));
    p.addComponent(new cSound('collide', new Beep(50, 5, 'sine', .25, 1)));
    var t = (function (s) {
        switch (s) {
            case 0:
                return 'exit';
            case 1:
                return 'chest';
            case 2:
                return 'gold';
            default:
                return 'unknown';
        }
    })(s);
    p.addComponent(new cTag('type', t));
    return p;
}
var TMASK;
(function (TMASK) {
    TMASK.W = 1;
    TMASK.O = 2;
    TMASK.M = 4;
    TMASK.P = 8;
    TMASK.FLOOR = 16;
    TMASK.WALL = 32;
    TMASK.S_WALL = 64;
})(TMASK || (TMASK = {}));
var Level = (function () {
    function Level(s) {
        if (s === void 0) { s = new Dm(50, 50); }
        this.m = [];
        this.r = true;
        this.s = s;
        this.rc = document.createElement("canvas");
        this.rc.width = (s.w * Game.T_S);
        this.rc.height = (s.h * Game.T_S);
        this.ctx = this.rc.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
    }
    Level.prototype.calcOrigin = function (r, d) {
        var N = d.w === WALL.N, S = d.w === WALL.S, E = d.w === WALL.E, W = d.w === WALL.W;
        var x = d.p.x
            - (N || S ? ~~(r.s.w / 2) : 0)
            + (E ? 1 : W ? 0 : 0)
            - (W ? r.s.w : 0);
        var y = d.p.y
            - (E || W ? ~~(r.s.h / 2) : 0)
            + (N ? 0 : S ? 1 : 0)
            - (N ? r.s.h : 0);
        return new Pt(x, y);
    };
    Level.prototype.addDoor = function (r, d) {
        this.m[d.p.x + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
        if (d.w === WALL.N || d.w === WALL.S) {
            this.m[(d.p.x - 1) + (d.p.y * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
            this.m[(d.p.x + 1) + (d.p.y * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
            this.m[d.p.x + ((d.p.y - 1) * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[d.p.x + ((d.p.y + 1) * this.s.h)] = TMASK.FLOOR | TMASK.W;
        }
        else {
            this.m[(d.p.x - 1) + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[(d.p.x + 1) + (d.p.y * this.s.h)] = TMASK.FLOOR | TMASK.W;
            this.m[d.p.x + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x - 1 + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x + 1 + ((d.p.y - 1) * this.s.h)] = TMASK.WALL;
            this.m[d.p.x + ((d.p.y + 1) * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
        }
    };
    Level.prototype.scan = function (r, d) {
        var result = true;
        var N = d.w === WALL.N, S = d.w === WALL.S, E = d.w === WALL.E, W = d.w === WALL.W;
        var o = this.calcOrigin(r, d);
        var x = o.x;
        var y = o.y;
        var w = r.s.w + (E || W ? 1 : 0);
        var h = r.s.h + (N || S ? 1 : 0);
        result = (x > 0 && y > 0 && x < this.s.w - r.s.w && y < this.s.h - r.s.h);
        for (var x0 = x; x0 < (x + w) && result; x0++) {
            for (var y0 = y; y0 < (y + h) && result; y0++) {
                result = result && this.m[x0 + (y0 * this.s.h)] === undefined;
            }
        }
        return result;
    };
    Level.prototype.roomToMap = function (r, o) {
        r.p.x = o.x;
        r.p.y = o.y;
        for (var mx = o.x, rx = 0; rx < r.s.w; rx++) {
            for (var my = o.y, ry = 0; ry < r.s.h; ry++) {
                if (ry === 0 && rx !== 0 && rx !== r.s.w - 1) {
                    this.m[mx + (my * this.s.h)] = TMASK.WALL;
                }
                else if (rx === 0 || ry === 0 || rx === r.s.w - 1 || ry === r.s.h - 1) {
                    this.m[mx + (my * this.s.h)] = TMASK.WALL | TMASK.S_WALL;
                }
                else {
                    this.m[mx + (my * this.s.h)] = TMASK.FLOOR | TMASK.W;
                }
                my++;
            }
            mx++;
        }
    };
    Level.prototype.generate = function () {
        var placedRooms = [];
        var features = [];
        var tRoom;
        var tCorr;
        var lRoom;
        var tDW;
        var tDWC;
        var roomOrigin = new Pt();
        tRoom = lRoom = Room.makeRoom(25, 25);
        roomOrigin = new Pt(randomInt(0, this.s.w - tRoom.s.w), randomInt(0, this.s.h - tRoom.s.h));
        placedRooms.push(tRoom);
        this.roomToMap(tRoom, roomOrigin);
        Game.gd.addRandObj(roomOrigin, tRoom.s);
        while (placedRooms.length > 0) {
            while (lRoom.w.length > 0) {
                tDW = lRoom.getRandomWall();
                if (tDW === null)
                    break;
                tCorr = Room.makeCorridor((tDW.w === WALL.N || tDW.w === WALL.S));
                if (this.scan(tCorr, tDW)) {
                    roomOrigin = this.calcOrigin(tCorr, tDW);
                    this.roomToMap(tCorr, roomOrigin);
                    this.addDoor(tCorr, tDW);
                    while (tCorr.w.length > 0) {
                        tRoom = Room.makeRoom(25, 25);
                        tDWC = tCorr.getRandomWall();
                        if (tDWC === null)
                            break;
                        if (this.scan(tRoom, tDWC)) {
                            roomOrigin = this.calcOrigin(tRoom, tDWC);
                            this.roomToMap(tRoom, roomOrigin);
                            this.addDoor(tRoom, tDWC);
                            Game.gd.addRandObj(roomOrigin, tRoom.s);
                            placedRooms.push(tRoom);
                            lRoom = tRoom;
                        }
                    }
                }
            }
            if (placedRooms.length > 1) {
                placedRooms.pop();
                lRoom = placedRooms[placedRooms.length - 1];
            }
            else {
                placedRooms.pop();
            }
        }
    };
    Level.prototype.render = function (ctx) {
        var _this = this;
        var tn = randomized([0, 1, 1, 2]);
        var fn = randomized([0, 0, 0, 0, 0, 0, 1, 2]);
        this.m.forEach(function (t, i) {
            var ty = ~~(i / _this.s.w);
            var tx = i % _this.s.w;
            var tile;
            if (!t) {
                ctx.fillStyle = "#000000";
                ctx.fillRect(tx * Game.T_S, ty * Game.T_S, Game.T_S, Game.T_S);
            }
            else if (t & TMASK.WALL) {
                if (t & TMASK.S_WALL) {
                    tile = SSM.spriteSheet("wall").sprites[3];
                }
                else {
                    tile = SSM.spriteSheet("wall").sprites[tn()];
                }
            }
            else if (t & TMASK.FLOOR) {
                tile = SSM.spriteSheet("floor").sprites[fn()];
            }
            if (tile) {
                ctx.drawImage(tile, 0, 0, Game.T_S, Game.T_S, ~~(tx * Game.T_S), ~~(ty * Game.T_S), Game.T_S, Game.T_S);
            }
        });
    };
    Level.prototype.draw = function (ctx, c) {
        if (this.r) {
            this.render(this.ctx);
            this.r = false;
        }
        ctx.globalAlpha = 1;
        ctx.drawImage(this.rc, ~~(c.p.x * Game.T_S), ~~(c.p.y * Game.T_S), ~~(c.s.w * Game.T_S), ~~(c.s.h * Game.T_S), 0, 0, ~~((c.s.w) * Game.T_S * 2), ~~((c.s.h) * Game.T_S * 2));
    };
    return Level;
}());
var Light = (function () {
    function Light(p, i, r) {
        this.p = p;
        this.i = i;
        this.r = r;
    }
    Light.prototype.calc = function (m, s) {
        this.a = [];
        var es = Light.poc(this.p.x, this.p.y, this.r);
        for (var e in es) {
            var l = Light.pol(this.p.x, this.p.y, es[e].x, es[e].y);
            var mx = this.i / l.length;
            var haw = 0;
            for (var tl in l) {
                if (l[tl].x < 0 || l[tl].x >= s.w ||
                    l[tl].y < 0 || l[tl].y >= s.h) {
                    break;
                }
                var idx = ((l[tl].y * s.w) + l[tl].x);
                var st = mx * (l.length - parseInt(tl));
                if (m[idx] & TMASK.FLOOR && haw > 0) {
                    break;
                }
                if (!(idx in this.a) || this.a[idx] > st) {
                    this.a[idx] = 1 - (st > 1 ? 1 : st);
                }
                if (m[idx] & TMASK.S_WALL) {
                    break;
                }
                if (m[idx] & TMASK.WALL && haw > 1) {
                    break;
                }
                if (m[idx] & TMASK.WALL) {
                    haw++;
                }
                if (!m[idx]) {
                    break;
                }
            }
        }
    };
    Light.reLM = function (al, s) {
        var lm = [];
        for (var l in al) {
            for (var idx in al[l].a) {
                if (!lm[idx] || lm[idx] > al[l].a[idx]) {
                    lm[idx] = al[l].a[idx];
                }
            }
        }
        return lm;
    };
    Light.pol = function (x1, y1, x2, y2) {
        var l = [];
        var dx = Math.abs(x2 - x1);
        var dy = Math.abs(y2 - y1);
        var x = x1;
        var y = y1;
        var n = 1 + dx + dy;
        var xInc = (x1 < x2 ? 1 : -1);
        var yInc = (y1 < y2 ? 1 : -1);
        var e = dx - dy;
        dx *= 2;
        dy *= 2;
        while (n > 0) {
            l.push(new Pt(x, y));
            if (e > 0) {
                x += xInc;
                e -= dy;
            }
            else {
                y += yInc;
                e += dx;
            }
            n -= 1;
        }
        return l;
    };
    Light.poc = function (cx, cy, cr) {
        var l = [];
        var x = cr;
        var y = 0;
        var o2 = ~~(1 - x);
        while (y <= x) {
            l.push(new Pt(x + cx, y + cy));
            l.push(new Pt(y + cx, x + cy));
            l.push(new Pt(-x + cx, y + cy));
            l.push(new Pt(-y + cx, x + cy));
            l.push(new Pt(-x + cx, -y + cy));
            l.push(new Pt(-y + cx, -x + cy));
            l.push(new Pt(x + cx, -y + cy));
            l.push(new Pt(y + cx, -x + cy));
            y += 1;
            if (o2 <= 0) {
                o2 += (2 * y) + 1;
            }
            else {
                x -= 1;
                o2 += (2 * (y - x)) + 1;
            }
        }
        return l;
    };
    return Light;
}());
var Message;
(function (Message) {
    Message[Message["OPENING"] = 0] = "OPENING";
    Message[Message["CONTROLS"] = 1] = "CONTROLS";
    Message[Message["ENDING_0"] = 2] = "ENDING_0";
    Message[Message["ENDING_25"] = 3] = "ENDING_25";
    Message[Message["ENDING_50"] = 4] = "ENDING_50";
    Message[Message["ENDING_75"] = 5] = "ENDING_75";
    Message[Message["ENDING_100"] = 6] = "ENDING_100";
})(Message || (Message = {}));
(function (Message) {
    var _m = [];
    _m[Message.OPENING] = '';
    _m[Message.CONTROLS] = '';
    _m[Message.ENDING_0] = '';
    _m[Message.ENDING_25] = '';
    _m[Message.ENDING_50] = '';
    _m[Message.ENDING_75] = '';
    _m[Message.ENDING_100] = '';
    function getText(m) {
        return btoa(_m[m]);
    }
    Message.getText = getText;
})(Message || (Message = {}));
var WALL;
(function (WALL) {
    WALL[WALL["N"] = 0] = "N";
    WALL[WALL["E"] = 1] = "E";
    WALL[WALL["S"] = 2] = "S";
    WALL[WALL["W"] = 3] = "W";
})(WALL || (WALL = {}));
;
var ROOMTYPE;
(function (ROOMTYPE) {
    ROOMTYPE[ROOMTYPE["CORRIDOR"] = 0] = "CORRIDOR";
    ROOMTYPE[ROOMTYPE["ROOM"] = 1] = "ROOM";
})(ROOMTYPE || (ROOMTYPE = {}));
;
var Room = (function () {
    function Room(pos, size, roomType, walls) {
        if (pos === void 0) { pos = new Pt(); }
        if (size === void 0) { size = new Dm(); }
        if (roomType === void 0) { roomType = ROOMTYPE.ROOM; }
        if (walls === void 0) { walls = [WALL.N, WALL.E, WALL.S, WALL.W]; }
        this.p = pos;
        this.s = size;
        this.w = walls;
        this.t = roomType;
        this.w = shuffle(this.w);
    }
    Room.prototype.getRandomWall = function () {
        if (this.w.length === 0)
            return null;
        var randWall = this.w.pop();
        var p = new Pt();
        if (randWall === WALL.N) {
            p.x = this.p.x + Math.floor(this.s.w / 2);
            p.y = this.p.y - 1;
        }
        else if (randWall === WALL.S) {
            p.x = this.p.x + Math.floor(this.s.w / 2);
            p.y = this.p.y + this.s.h;
        }
        else if (randWall === WALL.W) {
            p.x = this.p.x - 1;
            p.y = this.p.y + Math.floor(this.s.h / 2);
        }
        else if (randWall === WALL.E) {
            p.x = this.p.x + this.s.w;
            p.y = this.p.y + Math.floor(this.s.h / 2);
        }
        return { p: p, w: randWall };
    };
    Room.makeRoom = function (mw, mh) {
        return new Room(new Pt(), new Dm(randomInt(7, mw), randomInt(7, mh)), ROOMTYPE.ROOM);
    };
    Room.makeCorridor = function (vertical) {
        return new Room(new Pt(), new Dm(vertical ? 5 : randomInt(9, 17), vertical ? randomInt(9, 17) : 5), ROOMTYPE.CORRIDOR);
    };
    return Room;
}());
function input(e) {
    var m = e.components['p-move'].value;
    var r;
    m.x = m.y = 0;
    if (Input.KB.isBindDown(Input.KB.META_KEY.UP)) {
        m.y -= 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.DOWN)) {
        m.y += 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.LEFT)) {
        m.x -= 1;
        r = true;
    }
    if (Input.KB.isBindDown(Input.KB.META_KEY.RIGHT)) {
        m.x += 1;
        r = true;
    }
    return r;
}
function exit(e) {
    var i = Game.gd.p.indexOf(e);
    if (i !== -1) {
        Game.gd.removePlayer(Pt.from(e.components['p-pos'].value));
        delete Game.gd.p[i];
        Game.gd.players -= 1;
    }
}
function activate(e) {
    var ec = e.components;
    if (ec['active'] && ec['active'].value === false) {
        ec['active'].value = true;
        ec['sprite'].value = SSM.spriteSheet("guide").sprites[2];
        Game.i.ae.beep(ec['s-interact'].value);
        Game.gd.addSpawner(createSpawner('guide'), Pt.from(ec['p-pos'].value));
    }
}
function spawn(e) {
    var ec = e.components;
    var p = Pt.from(ec['p-pos'].value);
    switch (ec['type'].value) {
        case 'player':
            Game.gd.addPlayer(createPlayer(), p);
            break;
        case 'guide':
            Game.gd.addGuide(createGuidingLight(), p);
            break;
        default:
            break;
    }
    var i = Game.gd.s.indexOf(e);
    if (i !== -1) {
        delete Game.gd.s[i];
    }
}
function pickup(e) {
    var i = Game.gd.o.indexOf(e);
    if (i !== -1) {
        Game.gd.removeObject(Pt.from(e.components['p-pos'].value));
        delete Game.gd.o[i];
        switch (e.components['type'].value) {
            case "chest":
                Game.gd.score += 100000;
                break;
            case "gold":
                Game.gd.score += 1000;
                break;
            default:
                break;
        }
    }
}
function collision(e, l) {
    var ec = e.components;
    var p = ec['p-pos'].value;
    var m = ec['p-move'].value;
    var t = new Pt(m.x, m.y);
    var r = false;
    if (!(l.m[p.x + m.x + ((p.y + m.y) * l.s.w)] & TMASK.W) || Game.gd.playerAt(new Pt(p.x + m.x, p.y + m.y))) {
        m.x = m.y = 0;
        r = true;
    }
    if (t.x !== 0 && (l.m[p.x + t.x + (p.y * l.s.w)] & TMASK.W) && !Game.gd.playerAt(new Pt(p.x + t.x, p.y))) {
        m.x = t.x;
        r = false;
    }
    else if (t.y !== 0 && (l.m[p.x + ((p.y + t.y) * l.s.w)] & TMASK.W) && !Game.gd.playerAt(new Pt(p.x, p.y + t.y))) {
        m.y = t.y;
        r = false;
    }
    return r;
}
function animate(e) {
    var ec = e.components;
    var s = ec['sprite'];
    var m = ec['p-move'].value;
    if (m.x !== 0 || m.y !== 0) {
        if (m.x === 1)
            s.r += 90;
        else if (m.x === -1)
            s.r -= 90;
        else if ((m.y === -1 || m.y === 1) && s.r % 180 !== 0)
            s.r = 0;
        else if ((m.y === -1 || m.y === 1) && s.r % 180 === 0)
            s.r += 180;
        if (Math.abs(s.r % 360) === 1)
            s.r = 0;
    }
}
function movement(e) {
    var ec = e.components;
    var p = ec['p-pos'];
    var m = ec['p-move'].value;
    if (m.x !== 0 || m.y !== 0) {
        var o = Pt.from(p.value);
        p.value.x += m.x;
        p.value.y += m.y;
        Game.gd.movePlayer(o, p.value);
        m.x = m.y = 0;
        return true;
    }
    return false;
}
function guideMove(e) {
    var ec = e.components;
    var ep = Game.gd.exit.components['p-pos'].value;
    var gp = ec['p-pos'].value;
    var dx = ep.x - gp.x;
    var dy = ep.y - gp.y;
    var adx = Math.abs(dx);
    var ady = Math.abs(dy);
    if (dx == 0 && dy == 0) {
        ec['p-pos'].value = Pt.from(ec['p-origin'].value);
    }
    else if (adx !== 0 && ady !== 0) {
        gp.x += dx > 0 ? 1 : -1;
        gp.y += dy > 0 ? 1 : -1;
    }
    else if (adx !== 0) {
        gp.x += dx > 0 ? 1 : -1;
    }
    else if (ady !== 0) {
        gp.y += dy > 0 ? 1 : -1;
    }
    var s = ec['sprite'];
    s.r += 15;
    if (s.r == 360)
        s.r = 0;
}
function drawEnt(ctx, e, c) {
    var p = e.components['p-pos'].value;
    if (p.x >= c.p.x && p.x < (c.p.x + c.s.w) && p.y >= c.p.y && p.y < (c.p.y + c.s.h)) {
        var sp = e.components['sprite'];
        var s = sp.value;
        ctx.save();
        ctx.translate(~~((p.x - c.p.x) * Game.T_S * 2) + Game.T_S, ~~((p.y - c.p.y) * Game.T_S * 2) + Game.T_S);
        ctx.rotate(sp.r * Math.PI / 180);
        ctx.drawImage(s, 0, 0, Game.T_S, Game.T_S, -Game.T_S, -Game.T_S, Game.T_S * 2, Game.T_S * 2);
        ctx.restore();
    }
}
function drawSpr(ctx, sp, p, s, r) {
    if (s === void 0) { s = 1; }
    if (r === void 0) { r = 0; }
    ctx.save();
    ctx.translate(~~(p.x * Game.T_S * s), ~~(p.y * Game.T_S * s));
    ctx.rotate(r * Math.PI / 180);
    ctx.drawImage(sp, 0, 0, Game.T_S, Game.T_S, -Game.T_S, -Game.T_S, Game.T_S * s, Game.T_S * s);
    ctx.restore();
}
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function randomized(s, r) {
    if (r === void 0) { r = true; }
    var seq = s;
    var repeat = r;
    var stack = shuffle(seq);
    return function () {
        if (stack.length === 0 && repeat)
            stack = shuffle(seq);
        else if (stack.length === 0 && !repeat)
            return undefined;
        return stack.pop();
    };
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    var arr = array.slice();
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
}
function isIn(p1, p2, p2d, pad) {
    return (p1.x >= p2.x - pad && p1.x <= p2.x + p2d.w + pad && p1.y >= p2.y - 10 && p1.y <= p2.y + p2d.h + pad);
}
var DialogWindow = (function (_super) {
    __extends(DialogWindow, _super);
    function DialogWindow() {
        return _super.call(this) || this;
    }
    DialogWindow.prototype.transitionIn = function () {
        _super.prototype.transitionIn.call(this);
    };
    DialogWindow.prototype.transitionOut = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    DialogWindow.prototype.update = function (delta) {
        this.requestingClear = this.redraw;
    };
    DialogWindow.prototype.draw = function (ctx) {
    };
    return DialogWindow;
}(GameState));
var diff;
(function (diff) {
    diff[diff["EASY"] = 0] = "EASY";
    diff[diff["NORMAL"] = 1] = "NORMAL";
    diff[diff["HARD"] = 2] = "HARD";
    diff[diff["VHARD"] = 3] = "VHARD";
})(diff || (diff = {}));
;
var GameScreen = (function (_super) {
    __extends(GameScreen, _super);
    function GameScreen() {
        var _this = _super.call(this) || this;
        _this.mt = 0;
        _this.ma = 1;
        _this.md = -0.15;
        _this.c = new Camera(new Pt(), new Dm(32, 17));
        return _this;
    }
    GameScreen.prototype.transitionIn = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    GameScreen.prototype.transitionOut = function () {
        _super.prototype.transitionOut.call(this);
    };
    GameScreen.prototype.update = function (delta) {
        if (Game.gd.p.length === 0) {
        }
        this.mt += delta;
        if (this.mt >= 250) {
            this.mt = 0;
            this.ma += this.md;
            if (this.ma >= 1.0 || this.ma <= 0.55) {
                this.md *= -1;
            }
            this.redraw = true;
        }
        for (var e in Game.gd.s) {
            spawn(Game.gd.s[e]);
        }
        for (var e in Game.gd.p) {
            var ent = Game.gd.p[e].components;
            var pe = Game.gd.p[e];
            if (!Game.gd.getCurrPlayer()) {
                ent['input'].value = true;
                var p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
                this.c.p.x = p.x - ~~(this.c.s.w / 2);
                this.c.p.y = p.y - ~~(this.c.s.h / 2);
            }
            if (ent['input'] && ent['input'].value && ent['t-move']) {
                var tm = ent['t-move'];
                tm.cur += delta;
                if (tm.cur >= tm.value) {
                    if (ent['p-move'] && input(pe)) {
                        tm.cur = 0;
                        if (ent['p-pos'] && !collision(pe, Game.gd.l)) {
                            ent['sprite'] && animate(pe);
                            if (movement(pe)) {
                                this.redraw = true;
                                var p = ent['p-pos'].value;
                                this.c.p.x = p.x - ~~(this.c.s.w / 2);
                                this.c.p.y = p.y - ~~(this.c.s.h / 2);
                                if (Game.gd.objectAt(p)) {
                                    var o = Game.gd.getObjectAt(p);
                                    switch (o.components['type'].value) {
                                        case 'gold':
                                            Game.i.ae.beep(new Beep(2500, 2500, 'square', 0.75, 1));
                                            pickup(o);
                                            break;
                                        case 'chest':
                                            Game.i.ae.beep(new Beep(635, 3, 'square', 0.1, 1));
                                            pickup(o);
                                            break;
                                        case 'switch':
                                            activate(o);
                                            break;
                                        case 'exit':
                                            exit(pe);
                                            break;
                                        default:
                                            break;
                                    }
                                }
                                else if (ent['s-move']) {
                                    Game.i.ae.beep(ent['s-move'].value);
                                }
                            }
                        }
                    }
                }
            }
        }
        for (var e in Game.gd.g) {
            var ent = Game.gd.g[e].components;
            var ge = Game.gd.g[e];
            var tm = ent['t-move'];
            tm.cur += delta;
            if (tm.cur >= tm.value) {
                tm.cur = 0;
                guideMove(ge);
                this.redraw = true;
            }
        }
        if (this.redraw) {
            Game.gd.lights.length = 0;
            for (var e in Game.gd.p) {
                var ent = Game.gd.p[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    var l = ent['light'].value;
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            for (var e in Game.gd.g) {
                var ent = Game.gd.g[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    var l = ent['light'].value;
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            for (var e in Game.gd.m) {
                var ent = Game.gd.m[e].components;
                if (ent['light'] && ent['p-pos'] && isIn(ent['p-pos'].value, this.c.p, this.c.s, 10)) {
                    var l = ent['light'].value;
                    l.p = ent['p-pos'].value;
                    l.calc(Game.gd.l.m, Game.gd.l.s);
                    Game.gd.lights.push(l);
                }
            }
            if (Game.gd.lights.length > 0)
                Game.gd.lm = Light.reLM(Game.gd.lights, Game.gd.l.s);
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION))
            Game.i.e.gsm.push('marker-menu');
        this.requestingClear = this.redraw;
    };
    GameScreen.prototype.draw = function (ctx) {
        var _this = this;
        if (this.redraw) {
            Game.gd.l.draw(ctx, this.c);
            ctx.globalAlpha = this.ma;
            Game.gd.m.forEach(function (e) {
                drawEnt(ctx, e, _this.c);
            });
            ctx.globalAlpha = 1;
            Game.gd.o.forEach(function (e) {
                drawEnt(ctx, e, _this.c);
            });
            Game.gd.p.forEach(function (e) {
                drawEnt(ctx, e, _this.c);
            });
            ctx.globalAlpha = 0.3;
            Game.gd.g.forEach(function (e) {
                drawEnt(ctx, e, _this.c);
            });
            ctx.globalAlpha = 1;
            {
                ctx.fillStyle = 'white';
                ctx.textAlign = 'left';
                ctx.font = '11px sans-serif';
                drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(0.5, 17.5), 2);
                drawSpr(ctx, SSM.spriteSheet("marker").sprites[1], new Pt(1.5, 17.5), 2);
                ctx.fillText(" x " + Game.gd.markers, Game.T_S * 4, Game.P_H - 4);
                var c = 0;
                for (var p in Game.gd.p) {
                    drawSpr(ctx, SSM.spriteSheet("sprites").sprites[0], new Pt(4.5 + (1 * c), 17.5), 2);
                    c++;
                }
                ctx.textAlign = 'right';
                ctx.fillText("$" + Game.gd.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), Game.P_W - 4, Game.P_H - 4);
            }
            if (Game.gd.lm.length > 0) {
                ctx.fillStyle = "#0d0d0d";
                for (var x = this.c.p.x, rx = 0; x < this.c.p.x + this.c.s.w; x++) {
                    for (var y = this.c.p.y, ry = 0; y < this.c.p.y + this.c.s.h; y++) {
                        var val = Game.gd.lm[x + (y * Game.gd.l.s.h)];
                        ctx.globalAlpha = (val ? val : 1);
                        ctx.fillRect(rx * Game.T_S * 2, ry * Game.T_S * 2, Game.T_S * 2, Game.T_S * 2);
                        ry++;
                    }
                    rx++;
                }
                ctx.globalAlpha = 1;
            }
        }
    };
    return GameScreen;
}(GameState));
var MainMenu = (function (_super) {
    __extends(MainMenu, _super);
    function MainMenu() {
        var _this = _super.call(this) || this;
        _this.selectedIndex = 0;
        _this.subIndex = 0;
        _this.menuOptions = ["New Game", "Quit"];
        _this.subMenuOptions = ["Easy", "Normal", "Lost", "Forsaken"];
        return _this;
    }
    MainMenu.prototype.transitionIn = function () {
        this.requestingClear = true;
        this.selectedIndex = 0;
        this.subMenu = false;
        this.subIndex = 0;
        _super.prototype.transitionIn.call(this);
    };
    MainMenu.prototype.transitionOut = function () {
        this.requestingClear = true;
        _super.prototype.transitionIn.call(this);
    };
    MainMenu.prototype.update = function (delta) {
        if (Input.KB.wasDown(Input.KB.KEY.ESC)) {
            this.subMenu = false;
            this.redraw = true;
        }
        else if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            if (this.subMenu) {
                switch (this.subIndex) {
                    case 0:
                        Game.gd.setupGame(diff.EASY);
                        break;
                    case 1:
                        Game.gd.setupGame(diff.NORMAL);
                        break;
                    case 2:
                        Game.gd.setupGame(diff.HARD);
                        break;
                    case 3:
                        Game.gd.setupGame(diff.VHARD);
                        break;
                    default:
                        Game.gd.setupGame(diff.EASY);
                        break;
                }
                Game.i.e.gsm.push('game-screen');
            }
            else {
                switch (this.selectedIndex) {
                    case 0:
                        this.subMenu = true;
                        this.redraw = true;
                        break;
                    default:
                        window.location.reload();
                        break;
                }
            }
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.DOWN)) {
            if (this.subMenu) {
                this.subIndex = (this.subIndex + 1) % this.subMenuOptions.length;
            }
            else {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            }
            this.redraw = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.UP)) {
            if (this.subMenu) {
                if (this.subIndex === 0) {
                    this.subIndex = this.subMenuOptions.length - 1;
                }
                else {
                    this.subIndex = (this.subIndex - 1) % this.subMenuOptions.length;
                }
            }
            else {
                if (this.selectedIndex === 0) {
                    this.selectedIndex = this.menuOptions.length - 1;
                }
                else {
                    this.selectedIndex = (this.selectedIndex - 1) % this.menuOptions.length;
                }
            }
            this.redraw = true;
        }
        this.requestingClear = this.redraw;
    };
    MainMenu.prototype.draw = function (ctx) {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "#DDDDDD";
            ctx.lineWidth = 2;
            ctx.font = "30px sans-serif";
            ctx.fillStyle = "#b71d1d";
            ctx.fillText("FORSAKEN", ~~((Game.P_W / 2) | 0), ~~(64));
            ctx.font = "11px sans-serif";
            ctx.fillStyle = "#3f3f3f";
            ctx.fillText("FAME. FORTUNE. FREEDOM.", ~~((Game.P_W / 2) | 0), ~~(74));
            ctx.font = "12px sans-serif";
            ctx.fillText("js13k 2017 entry by David Brad", ~~((Game.P_W / 2) | 0), ~~(Game.P_H - 5));
            ctx.fillStyle = "#e8e8e8";
            if (this.subMenu) {
                for (var i = 0; i < this.subMenuOptions.length; i++) {
                    ctx.fillText(this.subMenuOptions[i], ~~((Game.P_W / 2) | 0), ~~(((Game.P_H) | 0) - (this.subMenuOptions.length * 36) + (i * 36)) - 16);
                }
                ctx.strokeRect(~~(Game.P_W / 2 - 55), ~~((Game.P_H) - ((this.subMenuOptions.length) * 36) + (this.subIndex * 36) - 32), 110, 24);
            }
            else {
                for (var i = 0; i < this.menuOptions.length; i++) {
                    ctx.fillText(this.menuOptions[i], ~~((Game.P_W / 2) | 0), ~~(((Game.P_H) | 0) - (this.menuOptions.length * 36) + (i * 36)) - 16);
                }
                ctx.strokeRect(~~(Game.P_W / 2 - 55), ~~((Game.P_H) - ((this.menuOptions.length) * 36) + (this.selectedIndex * 36) - 32), 110, 24);
            }
        }
    };
    return MainMenu;
}(GameState));
var MarkerMenu = (function (_super) {
    __extends(MarkerMenu, _super);
    function MarkerMenu() {
        var _this = _super.call(this) || this;
        _this.selectedIndex = 0;
        return _this;
    }
    MarkerMenu.prototype.transitionIn = function () {
        Input.KB.clearInputQueue();
        this.selectedIndex = 5;
        _super.prototype.transitionIn.call(this);
    };
    MarkerMenu.prototype.transitionOut = function () {
        Input.KB.clearInputQueue();
        _super.prototype.transitionIn.call(this);
    };
    MarkerMenu.prototype.update = function (delta) {
        if (Input.KB.wasDown(Input.KB.KEY.ESC))
            Game.i.e.gsm.pop();
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            var p = Pt.from(Game.gd.getCurrPlayer().components['p-pos'].value);
            var i = Game.gd.getMarkerIndex(p);
            if (i !== undefined) {
                delete Game.gd.m[i];
                Game.gd.removeMarker(p);
                Game.gd.markers += 1;
            }
            if (this.selectedIndex !== 5 && Game.gd.markers > 0) {
                var m = createMarker(this.selectedIndex === 4 ? 1 : 0, 90 * this.selectedIndex);
                Game.gd.addMarker(m, p);
                Game.gd.markers -= 1;
            }
            Game.i.e.gsm.pop();
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.RIGHT)) {
            this.selectedIndex = (this.selectedIndex + 1) % 6;
            this.redraw = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.LEFT)) {
            if (this.selectedIndex === 0) {
                this.selectedIndex = 5;
            }
            else {
                this.selectedIndex = (this.selectedIndex - 1) % 6;
            }
            this.redraw = true;
        }
    };
    MarkerMenu.prototype.draw = function (ctx) {
        if (this.redraw) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = "black";
            ctx.fillRect(128, 112, ~~(Game.P_W - 256), ~~(Game.P_H - 240));
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(10, 9), 2);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(12, 9), 2, 90);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(14, 9), 2, 180);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[0], new Pt(16, 9), 2, 270);
            drawSpr(ctx, SSM.spriteSheet("marker").sprites[1], new Pt(18, 9), 2);
            ctx.font = "11px sans-serif";
            ctx.textAlign = "left";
            ctx.fillStyle = ctx.strokeStyle = "#FFFFFF";
            ctx.fillText("PICKUP", ~~(39 * Game.T_S) + 4, ~~(18.5 * Game.T_S));
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "#FFFFFF";
            ctx.fillText("PLACE A MARKER", ~~(32 * Game.T_S), ~~(15.5 * Game.T_S));
            ctx.strokeStyle = "green";
            ctx.lineWidth = 2;
            ctx.strokeRect(((19 + (this.selectedIndex * 4)) * Game.T_S) - 2, (17 * Game.T_S) - 2, (this.selectedIndex === 5 ? (Game.T_S * 6) : (Game.T_S * 2)) + 4, (Game.T_S * 2) + 4);
        }
    };
    return MarkerMenu;
}(GameState));
