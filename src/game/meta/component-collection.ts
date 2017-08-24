/// <reference path="../../engine/ecs/component.ts" />
/// <reference path="../../engine/types/dimension.ts" />
/// <reference path="../../engine/types/point.ts" />

class cAABB extends Component<Dm> {
	constructor({ w = 0, h = 0 }) {
		super('aabb');
		this.value = new Dm(w, h);
	}
}

class cPos extends Component<Pt> {
	constructor(p: Pt = new Pt()) {
		super('pos');
		this.value = p;
	}
}

class cMove extends Component<Pt> {
	constructor(p: Pt = new Pt()) {
		super('move');
		this.value = p;
	}
}

class cStyle extends Component<string> {
	constructor(colour: string) {
		super('style');
		this.value = colour;
	}
}

class cSprite extends Component<HTMLCanvasElement> {
	constructor(sprite: HTMLCanvasElement) {
		super('sprite');
		this.value = sprite;
	}
}

class cTag extends Component<string> {
	constructor(tag: string, value: string) {
		super(tag);
		this.value = value;
	}
}

class cFlag extends Component<boolean> {
	constructor(name: string, value: boolean) {
		super(name);
		this.value = value;
	}
}

class cLight extends Component<Light> {
	constructor(light: Light) {
		super('light');
		this.value = light;
	}
}
