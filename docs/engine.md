# Resolution Info
    8px x 8px tiles
    Tiles:  64 x 36
    Pixels: 512 x 288

# Engine Stuff
### GameStateManager

    private states: GameState[index: string]

    Register(gameState: GameState): void
    Push(stateName: string): void
    Pop(): void

### GameState [CLASS]

    protected game: Game
    public redraw: boolean
    public requestingClear: boolean

    transition(): void
    draw(ctx: Context2D): void
    update(delta: number)
    
### GameStateDicitonary [INTERFACE]
    [index: string]: GameState

### AudioPool [CLASS] [see Boilerplate]
### Input [NAMESPACE] [see Boilerplate]
### ImageCache [see Boilerplate]
### SpriteSheetManager [see Boilerplate]
### SpriteSheet [see Boilerplate]
### Entity / Components [see Boilerplate / ECS]
### Types  [see Boilerplate]

### Engine [CLASS]

    public gsm: GameStateManager
    private loopHandle: number

    private screen: HTMLCanvasElement
    private ctx: Context2D
    private buffer: HTMLCanvasElement
    private bufferCtx: Context2D

    init(canvas: HTMLCanvasElement)
    update(delta)
        state.update(delta)
    draw()
        state.draw()
    private loop(): void
    run(): void
    stop(): void
    pause(): void
    unpause(): void

Game Stuff
==========
### [GameState] extends GameState
- Game Logic In Here?

### Game
    public engine: Engine
    init()
        Engine.init(canvas: HTMLCanvasElement)
        Engine.GameStateManager.Register(new GameState(Game))...
        Engine.loop()
    binding()
        Resize, Focus, Blur, Input, Asset Loading