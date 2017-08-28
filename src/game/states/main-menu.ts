/// <reference path="../game.ts" />

class MainMenu extends GameState {

    constructor() {
        super();
    }

    private selectedIndex: number = 0;
    private menuOptions: string[] = ["Start", "Options", "Exit"];

    transitionIn(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    transitionOut(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    update(delta: number): void {
        if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
            switch (this.selectedIndex) {
                case 0:
                    Game.i.e.gsm.push('game-screen');
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
            } else {
                this.selectedIndex = (this.selectedIndex - 1) % 3;
            }
            this.redraw = this.requestingClear = true;
        }
    }

    draw(ctx: Context2D): void {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.font = "18px Verdana";
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "#DDDDDD";
            ctx.lineWidth = 2;
            ctx.fillText(
                `js13k 2017`,
                ~~((Game.P_W / 2) | 0),
                ~~(64));
            for (let i = 0; i < this.menuOptions.length; i++) {
                ctx.fillText(
                    this.menuOptions[i],
                    ~~((Game.P_W / 2) | 0),
                    ~~(((Game.P_H) | 0) - (this.menuOptions.length * 36) + (i * 36)));
            }
            ctx.strokeRect(
                ~~(Game.P_W / 2 - 75),
                ~~((Game.P_H) - ((this.menuOptions.length) * 36) + (this.selectedIndex * 36) - 18),
                150,
                24);
        }
    }
}