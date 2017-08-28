function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomized(s: number[]): Function {
    let seq: number[] = s;
    let stack: number[] = shuffle(seq);
    return function() {
        if(stack.length === 0) stack = shuffle(seq);
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
