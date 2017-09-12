/// <reference path="./image-cache.ts" />
/// <reference path="../types/point.ts" />
/// <reference path="../types/dimension.ts" />

/**
 * @class SpriteSheet
 */
class SpriteSheet {
    private image: any;
    sprites: HTMLCanvasElement[] = [];

    name: string;
    gutter: number;
    offset: Pt;
    subsheet: Dm;
    tileSize: number;

    spritesPerRow: number;
    spritesPerCol: number;

    constructor(
        imageName: string, sheetName: string, tileSize: number, gutter: number = 0,
        subsheet: Dm = new Dm(0, 0), offset: Pt = new Pt(0, 0)) {

        this.name = sheetName;
        this.offset = offset;
        this.subsheet = subsheet;
        this.tileSize = tileSize;
        this.gutter = gutter;
        this.image = ImageCache.getTexture(imageName);
        this.storeSprites();
    }

    private storeSprites(callback: any = null) {
        this.spritesPerRow = ((this.subsheet.w === 0 || this.subsheet.h === 0) ? (this.image.width / this.tileSize) : this.subsheet.w);
        this.spritesPerCol = ((this.subsheet.w === 0 || this.subsheet.h === 0) ? (this.image.height / this.tileSize) : this.subsheet.h);

        let sprite: HTMLCanvasElement;
        for (let y = 0; y < this.spritesPerCol; y++) {
            for (let x = 0; x < this.spritesPerRow; x++) {
                sprite = this.sprites[x + (y * this.spritesPerRow)] = document.createElement("canvas");
                let ctx = <Context2D>sprite.getContext("2d");
                ctx.mozImageSmoothingEnabled = ctx.webkitImageSmoothingEnabled = ctx.imageSmoothingEnabled = false;
                sprite.width = this.tileSize;
                sprite.height = this.tileSize;
                ctx.drawImage(this.image,
                    ((this.tileSize + this.gutter) * x) + this.offset.x,
                    ((this.tileSize + this.gutter) * y) + this.offset.y,
                    this.tileSize, this.tileSize, 0, 0, this.tileSize, this.tileSize);
            }
        }
    }
}
