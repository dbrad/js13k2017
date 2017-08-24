/**
 * @class Component
 * @template T 
 */
class Component<T> {
	/**
	 * @type {string}
	 * @memberof Component
	 */
	name: string;

	/**
	 * @type {T}
	 * @memberof Component
	 */
	value: T;

	/**
	 * Creates an instance of Component.
	 * @param {string} name 
	 * @memberof Component
	 */
	constructor(name: string) {
		this.name = name;
	}
}
