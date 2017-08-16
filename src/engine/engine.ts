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

        this.buffer = document.createElement("canvas");
        this.buffer.width = this.screen.width;
        this.buffer.height = this.screen.height;

        this.bufferCtx = <Context2D>this.buffer.getContext("2d");
        this.bufferCtx.mozImageSmoothingEnabled = false;
        this.bufferCtx.imageSmoothingEnabled = false;

        this.gsm = new GameStateManager();
    }

    update(delta: number):void {
        if(!this.systemPause) {
            this.gsm.current.update(delta);
        }
    }

    clearScreen: boolean = false;
    redraw: boolean = false;
    draw(): void {
        if(this.clearScreen || this.gsm.current.requestingClear) {
            this.clearScreen = this.gsm.current.requestingClear = false;
        }
        if(!this.systemPause && (this.redraw || this.gsm.current.redraw)) {
            this.gsm.current.draw(this.bufferCtx);
            this.redraw = this.gsm.current.redraw = false;
        } else if (this.systemPause && this.redraw) {
            // System pause overlay
            this.redraw = this.gsm.current.redraw = false;
        }
    }
    
    private loopHandle: number;
    private then: number;    
    private loop(): void {
        let now: number = performance.now();
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
        console.log('engine paused');
        this.systemPause = true;
    }
    unpause(): void {
        console.log('engine unpaused');
        this.systemPause = false;        
    }
}