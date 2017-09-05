/// <reference path="./state/game-state-manager.ts" />

class Engine {
    public gsm: GameStateManager;

    private screen: HTMLCanvasElement;
    private ctx: Context2D;
    private buffer: HTMLCanvasElement;
    private bufferCtx: Context2D;

    constructor(canvas: HTMLCanvasElement) {
        this.screen = canvas;

        this.ctx = <Context2D>this.screen.getContext("2d");
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;

        this.buffer = document.createElement("canvas");
        this.buffer.width = this.screen.width;
        this.buffer.height = this.screen.height;

        this.bufferCtx = <Context2D>this.buffer.getContext("2d");
        this.bufferCtx.mozImageSmoothingEnabled = false;
        this.bufferCtx.imageSmoothingEnabled = false;
        this.bufferCtx.webkitImageSmoothingEnabled = false;

        this.gsm = new GameStateManager();
    }

    update(delta: number):void {
        if(!this.systemPause) {
            this.gsm.cur.update(delta);
        }
    }

    clearScreen: boolean = false;
    redraw: boolean = false;
    draw(): void {
        if(this.clearScreen || this.gsm.cur.requestingClear) {
            this.ctx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.bufferCtx.clearRect(0, 0, this.screen.width, this.screen.height);
            this.clearScreen = this.gsm.cur.requestingClear = false;
        }
        if(!this.systemPause && (this.redraw || this.gsm.cur.redraw)) {
            this.bufferCtx.globalAlpha = 1.0;
            this.bufferCtx.mozImageSmoothingEnabled = false;
            this.bufferCtx.imageSmoothingEnabled = false;
            this.bufferCtx.webkitImageSmoothingEnabled = false;
            this.gsm.cur.draw(this.bufferCtx);
            this.ctx.globalAlpha = 1.0;
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.drawImage(
                this.buffer,
                0, 0, Game.P_W, Game.P_H,
                0, 0, Game.P_W, Game.P_H);
            this.redraw = this.gsm.cur.redraw = false;
        } else if (this.systemPause && this.redraw) {
            this.ctx.globalAlpha = 0.7;
            this.ctx.fillStyle = "black";
            this.ctx.fillRect(0, 0, Game.P_W, Game.P_H);
            this.ctx.globalAlpha = 1.0;
            this.redraw = this.gsm.cur.redraw = false;
        }
    }
    
    private loopHandle: number;
    private then: number;    
    private loop(): void {
        let now: number = window.performance.now();
        let delta = (now - this.then);
        this.then = now;
        this.update(delta);
        this.draw();
        this.loopHandle = window.requestAnimationFrame(this.loop.bind(this));
    }
    run(): void {
        this.loopHandle = window.requestAnimationFrame(this.loop.bind(this));
    }
    stop(): void {
        window.cancelAnimationFrame(this.loopHandle);
    }
    
    private systemPause: boolean = false;
    pause(): void {
        this.systemPause = true;
        this.redraw = true;
    }
    unpause(): void {
        this.systemPause = false;        
        this.gsm.cur.redraw = this.clearScreen = true;
    }
}