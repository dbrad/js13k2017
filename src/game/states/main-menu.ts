/// <reference path="../game.ts" />

class MainMenu extends GameState {

    constructor() {
        super();
    }

    private selectedIndex: number = 0;
    private subMenu: boolean;
    private subIndex: number = 0;
    private menuOptions: string[] = ["New Game", "Quit"];
    private subMenuOptions: string[] = ["Easy", "Normal", "Lost", "Forsaken"];

    transitionIn(): void {
        this.requestingClear = true;
        this.selectedIndex = 0;
        this.subMenu = false;
        this.subIndex = 0;
        super.transitionIn()
    }

    transitionOut(): void {
        this.requestingClear = true;
        super.transitionIn()
    }

    update(delta: number): void {
        if (Input.KB.wasDown(Input.KB.KEY.ESC)) {
            this.subMenu = false;
            this.redraw = true;
        } else if (Input.KB.wasBindDown(Input.KB.META_KEY.ACTION)) {
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
            } else {
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
            } else {
                this.selectedIndex = (this.selectedIndex + 1) % this.menuOptions.length;
            }
            this.redraw = true;
        }
        if (Input.KB.wasBindDown(Input.KB.META_KEY.UP)) {
            if (this.subMenu) {
                if (this.subIndex === 0) {
                    this.subIndex = this.subMenuOptions.length - 1;
                } else {
                    this.subIndex = (this.subIndex - 1) % this.subMenuOptions.length;
                }
            } else {
                if (this.selectedIndex === 0) {
                    this.selectedIndex = this.menuOptions.length - 1;
                } else {
                    this.selectedIndex = (this.selectedIndex - 1) % this.menuOptions.length;
                }
            }
            this.redraw = true;
        }
        this.requestingClear = this.redraw;
    }

    draw(ctx: Context2D): void {
        if (this.redraw) {
            ctx.globalAlpha = 1.0;
            ctx.textAlign = "center";
            ctx.fillStyle = ctx.strokeStyle = "#DDDDDD";
            ctx.lineWidth = 2;

            ctx.font = "30px sans-serif";
            ctx.fillStyle = "#b71d1d";
            ctx.fillText(
                `FORSAKEN`,
                ~~((Game.P_W / 2) | 0),
                ~~(64));

            ctx.font = "11px sans-serif";
            ctx.fillStyle = "#3f3f3f";
            ctx.fillText(
                `FAME. FORTUNE. FREEDOM.`,
                ~~((Game.P_W / 2) | 0),
                ~~(74));

            ctx.font = "12px sans-serif";
            ctx.fillText(
                `js13k 2017 entry by David Brad`,
                ~~((Game.P_W / 2) | 0),
                ~~(Game.P_H - 5));

            ctx.fillStyle = "#e8e8e8";
            if (this.subMenu) {
                for (let i = 0; i < this.subMenuOptions.length; i++) {
                    ctx.fillText(
                        this.subMenuOptions[i],
                        ~~((Game.P_W / 2) | 0),
                        ~~(((Game.P_H) | 0) - (this.subMenuOptions.length * 36) + (i * 36)) - 16);
                }
                ctx.strokeRect(
                    ~~(Game.P_W / 2 - 55),
                    ~~((Game.P_H) - ((this.subMenuOptions.length) * 36) + (this.subIndex * 36) - 32),
                    110,
                    24);
            } else {
                for (let i = 0; i < this.menuOptions.length; i++) {
                    ctx.fillText(
                        this.menuOptions[i],
                        ~~((Game.P_W / 2) | 0),
                        ~~(((Game.P_H) | 0) - (this.menuOptions.length * 36) + (i * 36)) - 16);
                }
                ctx.strokeRect(
                    ~~(Game.P_W / 2 - 55),
                    ~~((Game.P_H) - ((this.menuOptions.length) * 36) + (this.selectedIndex * 36) - 32),
                    110,
                    24);
            }
        }
    }
}