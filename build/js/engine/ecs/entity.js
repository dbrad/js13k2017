var Entity = (function () {
    function Entity() {
        this.components = {};
        if (!Entity.autoID) {
            Entity.autoID = 0;
        }
        this.id = Entity.autoID++;
        return this;
    }
    Entity.prototype.addComponent = function (component) {
        this.components[component.name] = component;
        this[component.name] = component;
        return this;
    };
    return Entity;
}());
