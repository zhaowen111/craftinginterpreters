// expr
class Expr {
  accept(visitor) {
    throw new Error("accept method must be implemented");
  }
}
class Visitor {
  visitAssignExpr(expr) {
    throw new Error("visitAssignExpr method must be implemented");
  }
  visitBinaryExpr(expr) {
    throw new Error("visitBinaryExpr method must be implemented");
  }
  visitCallExpr(expr) {
    throw new Error("visitCallExpr method must be implemented");
  }
  visitGetExpr(expr) {
    throw new Error("visitGetExpr method must be implemented");
  }
  visitGroupingExpr(expr) {
    throw new Error("visitGroupingExpr method must be implemented");
  }
  visitLiteralExpr(expr) {
    throw new Error("visitLiteralExpr method must be implemented");
  }
  visitLogicalExpr(expr) {
    throw new Error("visitLogicalExpr method must be implemented");
  }
  visitSetExpr(expr) {
    throw new Error("visitSetExpr method must be implemented");
  }
  visitSuperExpr(expr) {
    throw new Error("visitSuperExpr method must be implemented");
  }
  visitThisExpr(expr) {
    throw new Error("visitThisExpr method must be implemented");
  }
  visitUnaryExpr(expr) {
    throw new Error("visitUnaryExpr method must be implemented");
  }
  visitVariableExpr(expr) {
    throw new Error("visitVariableExpr method must be implemented");
  }
}

class Assign extends Expr {
  constructor(name, value) {
    super();
    this.name = name;
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitAssignExpr(this);
  }
}

class Binary extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitBinaryExpr(this);
  }
}

class Call extends Expr {
  constructor(callee, paren, args) {
    super();
    this.callee = callee;
    this.paren = paren;
    this.args = args;
  }

  accept(visitor) {
    return visitor.visitCallExpr(this);
  }
}

class Get extends Expr {
  constructor(object, name) {
    super();
    this.object = object;
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitGetExpr(this);
  }
}

class Grouping extends Expr {
  constructor(expression) {
    super();
    this.expression = expression;
  }

  accept(visitor) {
    return visitor.visitGroupingExpr(this);
  }
}

class Literal extends Expr {
  constructor(value) {
    super();
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitLiteralExpr(this);
  }
}

class Logical extends Expr {
  constructor(left, operator, right) {
    super();
    this.left = left;
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitLogicalExpr(this);
  }
}

class Set extends Expr {
  constructor(object, name, value) {
    super();
    this.object = object;
    this.name = name;
    this.value = value;
  }

  accept(visitor) {
    return visitor.visitSetExpr(this);
  }
}

class Super extends Expr {
  constructor(keyword, method) {
    super();
    this.keyword = keyword;
    this.method = method;
  }

  accept(visitor) {
    return visitor.visitSuperExpr(this);
  }
}

class This extends Expr {
  constructor(keyword) {
    super();
    this.keyword = keyword;
  }

  accept(visitor) {
    return visitor.visitThisExpr(this);
  }
}

class Unary extends Expr {
  constructor(operator, right) {
    super();
    this.operator = operator;
    this.right = right;
  }

  accept(visitor) {
    return visitor.visitUnaryExpr(this);
  }
}

class Variable extends Expr {
  constructor(name) {
    super();
    this.name = name;
  }

  accept(visitor) {
    return visitor.visitVariableExpr(this);
  }
}

module.exports = { Expr, Assign, Variable, Unary, This, Super, Set, Logical, Literal, Grouping, Get, Call, Binary, Visitor };