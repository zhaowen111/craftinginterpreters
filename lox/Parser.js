const { TokenType } = require("./Token");

class Parser {
    constructor(tokens) {
        this.tokens = tokens
        this.current = 0;
    }
    expression() {
        return this.equality()
    }
    equality() {
        let expr = this.comparison()
        while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
            const operator = this.previous()
            const right = this.comparison()
            expr = new Expr.Binary(expr, operator, right)
        }
        return expr
    }
    comparison() {
        const expr = this.term()
        while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {

        }
    }
    term() {

    }
    match(...types) {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
        return false
    }
    check(type) {
        if (this.isAtEnd()) return false
        return this.peek().type === type
    }
    peek() {
        return this.tokens[this.current]
    }
    advance() {
        if (!this.isAtEnd()) this.current++
        return this.previous()
    }
    isAtEnd() {
        return this.peek().type === TokenType.EOF
    }
    previous() {
        return this.tokens[this.current - 1]
    }
}