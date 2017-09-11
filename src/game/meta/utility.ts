function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomized(s: number[], r: boolean = true): Function {
    let seq: number[] = s;
    let repeat = r;
    let stack: number[] = shuffle(seq);
    return function (): number {
        if (stack.length === 0 && repeat) stack = shuffle(seq);
        else if (stack.length === 0 && !repeat) return undefined;
        return stack.pop();
    }
}

function shuffle(array: any[]): any[] {
    let currentIndex: number = array.length, temporaryValue: number, randomIndex: number;
    let arr = array.slice();
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = arr[currentIndex];
        arr[currentIndex] = arr[randomIndex];
        arr[randomIndex] = temporaryValue;
    }
    return arr;
}

function isIn(p1: Pt, p2: Pt, p2d: Dm, pad: number) {
    return (p1.x >= p2.x - pad && p1.x <= p2.x + p2d.w + pad && p1.y >= p2.y - 10 && p1.y <= p2.y + p2d.h + pad)
}