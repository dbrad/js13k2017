/// <reference path="./component.ts" />
/// <reference path="../types/dimension.ts" />
/// <reference path="../types/point.ts" />

namespace ECS {
	export class AABB extends Component<Dm> {
		constructor({ w = 0, h = 0 }) {
			super('aabb');
			this.value = new Dm(w, h);
		}
	}

	export class Pos extends Component<Pt> {
		constructor({ x = 0, y = 0 }) {
			super('position');
			this.value = new Pt(x, y);
		}
	}

	export class Style extends Component<string> {
		constructor(colour: string) {
			super('style');
			this.value = colour;
		}
	}

	export class Sprite extends Component<HTMLCanvasElement> {
		constructor(sprite: HTMLCanvasElement) {
			super('sprite');
			this.value = sprite;
		}
	}

	export class Tag extends Component<string> {
		constructor(tag: string, value: string) {
			super(tag);
			this.value = value;
		}
	}

	export class Flag extends Component<boolean> {
		constructor(name: string, value: boolean) {
			super(name);
			this.value = value;
		}
	}
}