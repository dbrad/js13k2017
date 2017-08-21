/// <reference path="../engine/engine.ts" />
/// <reference path="../engine/input/input.ts" />

class Game {
    private _canvas: HTMLCanvasElement;
    private _window: Window;
    private _audioContext: AudioContext;
    public engine: Engine
    public audioEngine: AudioEngine;

    constructor(window: Window, canvas: HTMLCanvasElement, audioContext: AudioContext) {
        this._canvas = canvas;
        this._window = window;
        this._audioContext = audioContext;
        ImageCache.Loader.add("sheet", "./sheet.png");
        ImageCache.Loader.load(this.init.bind(this))
    }
    init(): void {
        this.engine = new Engine(this._canvas);
        this.bindings();
        this.engine.gsm.register('main-menu', new MainMenu(this));
        this.engine.gsm.register('game-screen', new GameScreen(this));
        this.engine.gsm.push('main-menu');
        this.engine.run();
    }

    private bindings(): void {
        this._window.addEventListener("resize", this.onResize.bind(this), false);
        this.onResize();
        this._window.onkeydown = Input.KB.keyDown;
        this._window.onkeyup = Input.KB.keyUp;
        this._window.onblur = this.engine.pause.bind(this.engine);
        this._window.onfocus = this.engine.unpause.bind(this.engine);
        this.audioEngine = new AudioEngine(this._audioContext);
        SpriteSheetManager.storeSheet(new SpriteSheet('sheet', 'tiles', 8, 0, new Dm(5, 1), new Pt(40, 0)));
    }

    private onResize(): void {
        let scaleX: number = window.innerWidth / this._canvas.width;
        let scaleY: number = window.innerHeight / this._canvas.height;
        let scaleToFit: number = Math.min(scaleX, scaleY) | 0;
        scaleToFit = (scaleToFit <= 0) ? 1 : scaleToFit;
        let size: number[] = [this._canvas.width * scaleToFit, this._canvas.height * scaleToFit];
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