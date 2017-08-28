/// <reference path="../engine/engine.ts" />
/// <reference path="../engine/input/input.ts" />

class Game {
    /**
     * @private
     * @type {HTMLCanvasElement}
     * @memberof Game
     */
    private _c: HTMLCanvasElement;

    /**
     * @private
     * @type {Window}
     * @memberof Game
     */
    private _w: Window;

    /**
     * @private
     * @type {AudioContext}
     * @memberof Game
     */
    private _ac: AudioContext;

    /**
     * @type {Engine}
     * @memberof Game
     */
    public e: Engine

    /**
     * @type {AudioEngine}
     * @memberof Game
     */
    public ae: AudioEngine;

    /**
     * @private
     * @static
     * @type {Game}
     * @memberof Game
     */
    private static _i: Game;

    /**
     * @readonly
     * @static
     * @type {Game}
     * @memberof Game
     */
    public static get i(): Game {
        if (!Game._i) {
            Game._i = new Game();
        }
        return Game._i;
    }

    /**
     * @private
     * @type {GameData}
     * @memberof Game
     */
    private _gc: GameData;

    /**
     * @readonly
     * @static
     * @type {GameData}
     * @memberof Game
     */
    public static get gd(): GameData {
        if (!Game.i._gc) {
            Game.i._gc = new GameData();
        }
        return Game.i._gc;
    }
    /**
     * Creates an instance of Game.
     * @private
     * @memberof Game
     */
    private constructor() { }

    /**
     * @memberof Game
     */
    init(window: Window, canvas: HTMLCanvasElement, audioContext: AudioContext): void {
        this._c = canvas;
        this._w = window;
        this._ac = audioContext;
        ImageCache.Loader.add("sheet", "./sheet.png");
        ImageCache.Loader.load(this.done.bind(this));
    }

    /**
     * @private
     * @memberof Game
     */
    private done(): void {
        this.e = new Engine(this._c);
        this.bindings();
        this.e.gsm.reg('main-menu', new MainMenu());
        this.e.gsm.reg('game-screen', new GameScreen());
        this.e.gsm.push('main-menu');
        this.e.run();
    }

    /**
     * @private
     * @memberof Game
     */
    private bindings(): void {
        this._w.addEventListener("resize", this.onResize.bind(this), false);
        this.onResize();
        this._w.onkeydown = Input.KB.keyDown;
        this._w.onkeyup = Input.KB.keyUp;
        this._w.onblur = this.e.pause.bind(this.e);
        this._w.onfocus = this.e.unpause.bind(this.e);
        this.ae = new AudioEngine(this._ac);
        SSM.storeSheet(new SpriteSheet('sheet', 'marker', 8, 0, new Dm(2, 1), new Pt(8, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'floor', 8, 0, new Dm(3, 1), new Pt(8 * 3, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'wall', 8, 0, new Dm(4, 1), new Pt(8 * 6, 0)));
        SSM.storeSheet(new SpriteSheet('sheet', 'sprites', 8, 0, new Dm(5, 1)));
    }

    /**
     * @private
     * @memberof Game
     */
    private onResize(): void {
        let scaleX: number = window.innerWidth / this._c.width;
        let scaleY: number = window.innerHeight / this._c.height;
        let scaleToFit: number = Math.min(scaleX, scaleY) | 0;
        scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
        let size: number[] = [this._c.width * scaleToFit, this._c.height * scaleToFit];
        let offset: number[] = [(window.innerWidth - size[0]) / 2, (window.innerHeight - size[1]) / 2];
        let stage: HTMLDivElement = <HTMLDivElement>document.getElementById("stage");
        let rule: string = "translate(" + (~~offset[0]) + "px, " + (~~offset[1]) + "px) scale(" + (~~scaleToFit) + ")";
        stage.style.transform = rule;
        stage.style.webkitTransform = rule;
    }
}

namespace Game {
    export const P_W: number = 512;
    export const P_H: number = 288;
    export const T_W: number = 64;
    export const T_H: number = 36;
    export const T_S: number = 8;
}