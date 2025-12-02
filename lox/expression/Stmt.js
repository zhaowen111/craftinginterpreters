// stmt
class Stmt {
  static Visitor = class {
    visitBlockStmt(stmt) {
      throw new Error("visitBlockStmt method must be implemented");
    }
    visitClassStmt(stmt) {
      throw new Error("visitClassStmt method must be implemented");
    }
    visitExpressionStmt(stmt) {
      throw new Error("visitExpressionStmt method must be implemented");
    }
    visitFunctionStmt(stmt) {
      throw new Error("visitFunctionStmt method must be implemented");
    }
    visitIfStmt(stmt) {
      throw new Error("visitIfStmt method must be implemented");
    }
    visitPrintStmt(stmt) {
      throw new Error("visitPrintStmt method must be implemented");
    }
    visitReturnStmt(stmt) {
      throw new Error("visitReturnStmt method must be implemented");
    }
    visitVarStmt(stmt) {
      throw new Error("visitVarStmt method must be implemented");
    }
    visitWhileStmt(stmt) {
      throw new Error("visitWhileStmt method must be implemented");
    }
  }

  static Block = class extends Stmt {
    constructor(statements) {
      super();
      this.statements = statements;
    }

    accept(visitor) {
      return visitor.visitBlockStmt(this);
    }
  }

  static Class = class extends Stmt {
    constructor(name, superclass, methods) {
      super();
      this.name = name;
      this.superclass = superclass;
      this.methods = methods;
    }

    accept(visitor) {
      return visitor.visitClassStmt(this);
    }
  }

  static Expression = class extends Stmt {
    constructor(expression) {
      super();
      this.expression = expression;
    }

    accept(visitor) {
      return visitor.visitExpressionStmt(this);
    }
  }

  static Function = class extends Stmt {
    constructor(name, params, body) {
      super();
      this.name = name;
      this.params = params;
      this.body = body;
    }

    accept(visitor) {
      return visitor.visitFunctionStmt(this);
    }
  }

  static If = class extends Stmt {
    constructor(condition, thenBranch, elseBranch) {
      super();
      this.condition = condition;
      this.thenBranch = thenBranch;
      this.elseBranch = elseBranch;
    }

    accept(visitor) {
      return visitor.visitIfStmt(this);
    }
  }

  static Print = class extends Stmt {
    constructor(expression) {
      super();
      this.expression = expression;
    }

    accept(visitor) {
      return visitor.visitPrintStmt(this);
    }
  }

  static Return = class extends Stmt {
    constructor(keyword, value) {
      super();
      this.keyword = keyword;
      this.value = value;
    }

    accept(visitor) {
      return visitor.visitReturnStmt(this);
    }
  }

  static Var = class extends Stmt {
    constructor(name, initializer) {
      super();
      this.name = name;
      this.initializer = initializer;
    }

    accept(visitor) {
      return visitor.visitVarStmt(this);
    }
  }

  static While = class extends Stmt {
    constructor(condition, body) {
      super();
      this.condition = condition;
      this.body = body;
    }

    accept(visitor) {
      return visitor.visitWhileStmt(this);
    }
  }

  accept(visitor) {
    throw new Error("accept method must be implemented");
  }
}

module.exports = { Stmt, Block, Class, Expression, Function, If, Print, Return, Var, While };