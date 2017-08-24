/// <reference path="./spritesheet-array.ts" />

/**
 * @name SpriteSheetManager
 */
namespace SSM {
    /**
     * @name sheets
     * @desc Collection of stored spritesheets.
     */
    let sheets: SpriteSheetArray = {};

    /**
     * @export
     * @param {SpriteSheet} sheet 
     */
    export function storeSheet(sheet: SpriteSheet): void {
        sheets[sheet.name] = sheet;
    }

    /**
     * @export
     * @param {string} name 
     * @returns {SpriteSheet} 
     */
    export function spriteSheet(name: string): SpriteSheet {
        return sheets[name];
    }
}
