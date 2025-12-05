const { ParseError } = require("./Error")
const { TokenType } = require("./Token")
const { Binary, Literal, Unary, Grouping, Variable, Assign } = require("./expression/Expr")
const Stmt = require('./expression/Stmt')
class Parser {
  constructor(tokens) {
    this.tokens = tokens
    this.current = 0
    this.statements = []
  }

  parse() {
    try {
      while (!this.isAtEnd()) {
        this.statements.push(this.declaration())
      }
      return this.statements;
    } catch (error) {
      if (error instanceof ParseError) {
        return null;
      } else {
        throw error;
      }
    }
  }
  declaration() {
    try {
      if (this.match(TokenType.VAR)) return this.varDeclaration();
      return this.statement();
    } catch (error) {
      this.synchronize();
      return null;
    }
  }
  varDeclaration() {
    const name = this.consume(TokenType.IDENTIFIER, "Expect variable name.");
    let initializer = null;
    if (this.match(TokenType.EQUAL)) {
      initializer = this.expression();
    }
    this.consume(TokenType.SEMICOLON, "Expect ';' after variable declaration.");
    return new Stmt.Var(name, initializer);
  }
  statement() {
    if (this.match(TokenType.PRINT)) return this.printStatement();
    if (this.match(TokenType.LEFT_BRACE)) return this.block();
    return this.expressionStatement();
  }
  block() {
    const declarations = [];
    while (!this.check(TokenType.RIGHT_BRACE) && !this.isAtEnd()) {
      declarations.push(this.declaration());
    }
    this.consume(TokenType.RIGHT_BRACE, "Expect '}' after block.");
    return new Stmt.Block(declarations);
  }
  printStatement() {
    const value = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after value.");
    return new Stmt.Print(value);
  }
  expressionStatement() {
    const expr = this.expression();
    this.consume(TokenType.SEMICOLON, "Expect ';' after expression.");
    return new Stmt.Expression(expr);
  }
  expression() {
    return this.assignment()
  }
  assignment() {
    let expr = this.equality()
    if (this.match(TokenType.EQUAL)) {
      let equals = this.previous()
      let value = this.assignment()
      if (expr instanceof Variable) {
        let name = expr.name
        return new Assign(name, value)
      }
      this.error(equals, "Invalid assignment target.")
    }
    return expr
  }
  equality() {
    let expr = this.comparison()
    while (this.match(TokenType.BANG_EQUAL, TokenType.EQUAL_EQUAL)) {
      let operator = this.previous()
      let right = this.comparison()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }
  comparison() {
    let expr = this.term()
    while (this.match(TokenType.GREATER, TokenType.GREATER_EQUAL, TokenType.LESS, TokenType.LESS_EQUAL)) {
      let operator = this.previous()
      let right = this.term()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }
  term() {
    let expr = this.factor()
    while (this.match(TokenType.MINUS, TokenType.PLUS)) {
      let operator = this.previous()
      let right = this.factor()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }
  factor() {
    let expr = this.unary()
    while (this.match(TokenType.SLASH, TokenType.STAR)) {
      let operator = this.previous()
      let right = this.unary()
      expr = new Binary(expr, operator, right)
    }
    return expr
  }
  unary() {
    if (this.match(TokenType.BANG, TokenType.MINUS)) {
      let operator = this.previous()
      let right = this.unary()
      return new Unary(operator, right)
    }
    return this.primary()
  }
  primary() {
    if (this.match(TokenType.FALSE)) return new Literal(false)
    if (this.match(TokenType.TRUE)) return new Literal(true)
    if (this.match(TokenType.NIL)) return new Literal(null)
    if (this.match(TokenType.NUMBER, TokenType.STRING)) {
      return new Literal(this.previous().literal)
    }
    if (this.match(TokenType.IDENTIFIER)) {
      return new Variable(this.previous());
    }
    if (this.match(TokenType.LEFT_PAREN)) {
      let expr = this.expression()
      this.consume(TokenType.RIGHT_PAREN, "Expect ')' after expression.")
      return new Grouping(expr)
    }
    throw this.error(this.peek(), "Expect expression.");
  }
  error(token, message) {
    require('./Lox').parseError(token, message);
    return new ParseError();
  }
  synchronize() {
    this.advance();
    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.SEMICOLON) return;
      switch (this.peek().type) {
        case TokenType.CLASS:
        case TokenType.FUN:
        case TokenType.VAR:
        case TokenType.FOR:
        case TokenType.IF:
        case TokenType.WHILE:
        case TokenType.PRINT:
        case TokenType.RETURN:
          return;
      }
      this.advance();
    }
  }
  match(...types) {
    for (let type of types) {
      if (this.check(type)) {
        this.advance()
        return true
      }
    }
    return false
  }
  consume(type, message) {
    if (this.check(type)) return this.advance();
    throw new Error(this.peek(), message);
  }
  check(type) {
    if (this.isAtEnd()) return false
    return this.peek().type === type
  }
  advance() {
    if (!this.isAtEnd()) this.current++
    return this.previous()
  }
  isAtEnd() {
    return this.peek().type === TokenType.EOF
  }
  peek() {
    return this.tokens[this.current]
  }
  previous() {
    return this.tokens[this.current - 1]
  }
}
module.exports = Parser;