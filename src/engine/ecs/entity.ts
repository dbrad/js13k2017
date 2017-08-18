/// <reference path="./component-dictionary.ts" />
/// <reference path="./component.ts" />

class GameEntity {
    public components: ComponentDictionary;
    public id: number;
    private static autoID: number;

    constructor() {
        this.components = {};
        if (!GameEntity.autoID) {
            GameEntity.autoID = 0;
        }
        this.id = GameEntity.autoID++;
        return this;
    }

    addComponent(component: Component<any>): GameEntity {
        this.components[component.name] = component;
        return this;
    }
}