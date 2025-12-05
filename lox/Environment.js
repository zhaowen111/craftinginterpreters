const { RuntimeError } = require("./Error");

class Environment {
    constructor(enclosing = null) {
        this.enclosing = enclosing;
        this.values = new Map();
    }
    define(name, value) {
        this.values.set(name, value);
    }
    assign(name, value) {
        if (this.values.has(name.lexeme)) {
            this.values.set(name.lexeme, value);
            return;
        }
        if (this.enclosing !== null) {
            this.enclosing.assign(name, value);
            return;
        }
        throw new RuntimeError(`Undefined variable '${name.lexeme}'.`);
    }
    get(name) {
        if (this.values.has(name.lexeme)) {
            return this.values.get(name.lexeme);
        }
        if (this.enclosing !== null) {
            return this.enclosing.get(name);
        }
        throw new Error(`Undefined variable '${name.lexeme}'.`);
    }
}

module.exports = Environment;