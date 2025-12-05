const { RuntimeError } = require("./Error");
const { TokenType } = require("./Token");
const Environment = require("./Environment");
class Interpreter {
  constructor() {
    this.environment = new Environment();
  }
  interpret(statements) {
    try {
      for (const statement of statements) {
        this.execute(statement);
      }
    } catch (error) {
      console.error("Runtime error:", error);
    }
  }
  execute(stmt) {
    stmt.accept(this);
  }
  visitExpressionStmt(stmt) {
    this.evaluate(stmt.expression);
    return null;
  }
  visitPrintStmt(stmt) {
    const value = this.evaluate(stmt.expression);
    console.log(value);
    return null;
  }
  visitVarStmt(stmt) {
    let value = null;
    if (stmt.initializer != null) {
      value = this.evaluate(stmt.initializer);
    }
    this.environment.define(stmt.name.lexeme, value);
    return null;
  }

  /* Expression Visitors */
  visitLiteralExpr(expr) {
    return expr.value;
  }
  visitGroupingExpr(expr) {
    return this.evaluate(expr.expression);
  }
  visitUnaryExpr(expr) {
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
        const value = parseFloat(right);
        if (isNaN(value)) {
          throw new RuntimeError("Operand must be a number.");
        }
        return -right;
      case TokenType.BANG:
        return !this.isTruthy(right);
    }
    return null;
  }
  visitBinaryExpr(expr) {
    const left = this.evaluate(expr.left);
    const right = this.evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.PLUS:
        if (typeof left === 'number' && typeof right === 'number') {
          return Number(left) + Number(right);
        }
        if (typeof left === 'string' && typeof right === 'string') {
          return String(left) + String(right);
        }
        throw new RuntimeError(expr.operator, "Operands must be two numbers or two strings.");
      case TokenType.MINUS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) - Number(right);
      case TokenType.STAR:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) * Number(right);
      case TokenType.SLASH:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) / Number(right);
      case TokenType.GREATER:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) > Number(right);
      case TokenType.GREATER_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) >= Number(right);
      case TokenType.LESS:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) < Number(right);
      case TokenType.LESS_EQUAL:
        this.checkNumberOperands(expr.operator, left, right);
        return Number(left) <= Number(right);
      case TokenType.EQUAL_EQUAL:
        return left === right;
      case TokenType.BANG_EQUAL:
        return left !== right;
    }
    return null;
  }
  visitAssignExpr(expr) {
    const value = this.evaluate(expr.value);
    this.environment.assign(expr.name.lexeme, value);
    return value;
  }
  visitVariableExpr(expr) {
    return this.environment.get(expr.name);
  }
  checkNumberOperands(operator, left, right) {
    if (isNaN(Number(left)) || isNaN(Number(right))) {
      throw new RuntimeError(operator, "Operands must be numbers.");
    }
  }
  isTruthy(object) {
    if (object === null) return false;
    if (typeof object === 'boolean') return object;
    return true;
  }
  evaluate(expr) {
    return expr.accept(this);
  }
}

module.exports = Interpreter;