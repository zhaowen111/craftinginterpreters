const fs = require('fs');
const path = require('path');

function main() {
  const args = process.argv.slice(2);
  if (args.length !== 1) {
    console.error("Usage: generate_ast <output directory>");
    process.exit(64);
  }
  const outputDir = args[0];

  defineAst(outputDir, "Expr", [
    "Assign   : name, value",
    "Binary   : left, operator, right",
    "Call     : callee, paren, args",
    "Get      : object, name",
    "Grouping : expression",
    "Literal  : value",
    "Logical  : left, operator, right",
    "Set      : object, name, value",
    "Super    : keyword, method",
    "This     : keyword",
    "Unary    : operator, right",
    "Variable : name"
  ]);

  defineAst(outputDir, "Stmt", [
    "Block      : statements",
    "Class      : name, superclass, methods",
    "Expression : expression",
    "Function   : name, params, body",
    "If         : condition, thenBranch, elseBranch",
    "Print      : expression",
    "Return     : keyword, value",
    "Var        : name, initializer",
    "While      : condition, body"
  ]);
}

function defineAst(outputDir, baseName, types) {
  const filePath = path.join(outputDir, `${baseName}.js`);
  const lines = [];

  lines.push(`// ${baseName.toLowerCase()}`);
  lines.push(`class ${baseName} {`);

  // 调用 defineVisitor
  defineVisitor(lines, baseName, types);

  // AST 类定义
  for (const type of types) {
    const className = type.split(':')[0].trim();
    const fields = type.split(':')[1].trim();
    defineType(lines, baseName, className, fields);
  }

  // 基础 accept 方法
  lines.push('');
  lines.push('  accept(visitor) {');
  lines.push('    throw new Error("accept method must be implemented");');
  lines.push('  }');
  lines.push('}');

  // 导出语句
  const exportClasses = [baseName];
  for (const type of types) {
    const className = type.split(':')[0].trim();
    exportClasses.push(className);
  }

  lines.push('');
  lines.push(`module.exports = { ${exportClasses.join(', ')} };`);

  fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
  console.log(`Generated ${filePath}`);
}

function defineVisitor(lines, baseName, types) {
  lines.push('  static Visitor = class {');
  for (const type of types) {
    const typeName = type.split(':')[0].trim();
    lines.push(`    visit${typeName}${baseName}(${baseName.toLowerCase()}) {`);
    lines.push(`      throw new Error("visit${typeName}${baseName} method must be implemented");`);
    lines.push('    }');
  }
  lines.push('  }');
}

function defineType(lines, baseName, className, fieldList) {
  const fields = fieldList.split(', ').filter(f => f.length > 0);

  lines.push('');
  lines.push(`  static ${className} = class extends ${baseName} {`);

  // 构造函数
  lines.push(`    constructor(${fields.join(', ')}) {`);
  lines.push('      super();');
  for (const field of fields) {
    lines.push(`      this.${field} = ${field};`);
  }
  lines.push('    }');

  // accept 方法
  lines.push('');
  lines.push('    accept(visitor) {');
  lines.push(`      return visitor.visit${className}${baseName}(this);`);
  lines.push('    }');

  lines.push('  }');
}

if (require.main === module) {
  main();
}