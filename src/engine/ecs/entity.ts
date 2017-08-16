/// <reference path="./component-dictionary.ts" />
/// <reference path="./component.ts" />

class Entity {
    public components: ComponentDictionary;
    public id: number;
    private static autoID: number;

    constructor() {
        this.components = {};
        if (!Entity.autoID) {
            Entity.autoID = 0;
        }
        this.id = Entity.autoID++;
        return this;
    }

    addComponent(component: Component<any>): Entity {
        this.components[component.name] = component;
        return this;
    }
}