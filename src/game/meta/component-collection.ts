/// <reference path="../../engine/ecs/component.ts" />
/// <reference path="../../engine/types/dimension.ts" />
/// <reference path="../../engine/types/point.ts" />

class cP extends Component<Pt> {
	constructor(name: string, p: Pt = new Pt()) {
		super('p-' + name);
		this.value = p;
	}
}

class cSprite extends Component<HTMLCanvasElement> {
	r: number = 0;
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
class cSound extends Component<Beep> {
	constructor(name: string, beep: Beep) {
		super('s-' + name);
		this.value = beep;
	}
}

class cTimer extends Component<number> {
	public cur: number = 0;
	constructor(name: string, interval: number) {
		super('t-' + name);
		this.value = interval;
	}
}
