/// <reference path="./spritesheet-array.ts" />

namespace SpriteSheetManager {
    let sheets: SpriteSheetArray = {};

    export function storeSheet(sheet: SpriteSheet): void {
        sheets[sheet.name] = sheet;
    }

    export function spriteSheet(name: string): SpriteSheet {
        return sheets[name];
    }
}
