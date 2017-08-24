/// <reference path="./component-dictionary.ts" />
/// <reference path="./component.ts" />

/**
 * @class GameEntity
 */
class GameEntity {
    /**
     * @type {ComponentDictionary}
     * @memberof GameEntity
     */
    public components: ComponentDictionary;
    /**
     * @type {number}
     * @memberof GameEntity
     */
    public id: number;
    /**
     * @private
     * @static
     * @type {number}
     * @memberof GameEntity
     */
    private static autoID: number;

    /**
     * Creates an instance of GameEntity.
     * @memberof GameEntity
     */
    constructor() {
        this.components = {};
        if (!GameEntity.autoID) {
            GameEntity.autoID = 0;
        }
        this.id = GameEntity.autoID++;
        return this;
    }

    /**
     * @param {Component<any>} component 
     * @returns {GameEntity} 
     * @memberof GameEntity
     */
    addComponent(component: Component<any>): GameEntity {
        this.components[component.name] = component;
        return this;
    }
}