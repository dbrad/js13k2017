namespace Input {
    export namespace KB {
        export enum KEY {
            A = 65,
            D = 68,
            W = 87,
            S = 83,
            Z = 90,
            LEFT = 37,
            RIGHT = 39,
            UP = 38,
            DOWN = 40,
            ENTER = 13,
            SPACE = 32,
            NUM_1 = 49,
            NUM_2 = 50,
            NUM_3 = 51,
            NUM_4 = 52,
            NUM_5 = 53,
            C = 67,
            ESC = 27
        }

        export enum META_KEY {
            UP,
            DOWN,
            LEFT,
            RIGHT,
            ACTION
        }

        export let KEY_BIND: KEY[][] = [];
        KEY_BIND[META_KEY.UP] = [KEY.W, KEY.UP];
        KEY_BIND[META_KEY.DOWN] = [KEY.S, KEY.DOWN];
        KEY_BIND[META_KEY.LEFT] = [KEY.A, KEY.LEFT];
        KEY_BIND[META_KEY.RIGHT] = [KEY.D, KEY.RIGHT];
        KEY_BIND[META_KEY.ACTION] = [KEY.SPACE, KEY.ENTER];

        let _isDown: boolean[] = [];
        let _isUp: boolean[] = [];
        let _wasDown: boolean[] = [];

        for (let i: number = 0; i < 256; i++) {
            _isUp[i] = true;
        }

        export function isDown(keyCode: KEY): boolean {
            return (_isDown[keyCode]);
        }

        export function wasDown(keyCode: KEY): boolean {
            let result: boolean = _wasDown[keyCode];
            _wasDown[keyCode] = false;
            return result;
        }

        export function clearInputQueue(): void {
            for (let key in _wasDown) {
                _wasDown[key] = false;
            }
        }

        export function keyDown(event: KeyboardEvent): void {
            let keyCode: number = event.which;
            _isDown[keyCode] = true;
            if (_isUp[keyCode]) {
                _wasDown[keyCode] = true;
            }
            _isUp[keyCode] = false;
        }

        export function keyUp(event: KeyboardEvent): void {
            let keyCode: number = event.which;
            _isDown[keyCode] = false;
            _isUp[keyCode] = true;
        }

        export function isBindDown(key: META_KEY): boolean {
            let result: boolean = false;
            for (let k of KEY_BIND[key]) {
                result = result || _isDown[k];
            }
            return result;
        }

        export function wasBindDown(key: META_KEY): boolean {
            let result: boolean = false;
            for (let k of KEY_BIND[key]) {
                result = result || _wasDown[k];
                _wasDown[k] = false;
            }
            return result;
        }
    }
}
