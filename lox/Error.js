class ParseError extends Error {
    constructor() {
        super();
    }
}

class RuntimeError extends Error {
    constructor(token, message) {
        super(message);
        this.token = token;
    }
}

module.exports = { ParseError, RuntimeError };