class Interpreter {
  visitLiteralExpr(expr) {
    return expr.value;
  }
  visitGroupingExpr(expr) {
    return evaluate(expr.expression);
  }
  visitUnaryExpr(expr) {
    const right = evaluate(expr.right);
    switch (expr.operator.type) {
      case TokenType.MINUS:
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
        return left + right;
      case TokenType.MINUS:
        return left - right;
      case TokenType.STAR:
        return left * right;
      case TokenType.SLASH:
        return left / right;
      case TokenType.GREATER:
        return left > right;
      case TokenType.GREATER_EQUAL:
        return left >= right;
      case TokenType.LESS:
        return left < right;
      case TokenType.LESS_EQUAL:
        return left <= right;
      case TokenType.EQUAL_EQUAL:
        return left === right;
      case TokenType.BANG_EQUAL:
        return left !== right;
    }
    return null;
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