class Token {
    constructor(type, lexeme, literal, line) {
        this.type = type;
        this.lexeme = lexeme;
        this.literal = literal;
        this.line = line;
    }
    toString() {
        return `${this.type} ${this.lexeme} ${this.literal}`;
    }
}

const TokenType = Object.freeze({
    // 单字符词法单元
    LEFT_PAREN: 'LEFT_PAREN',      // 左圆括号 (
    RIGHT_PAREN: 'RIGHT_PAREN',    // 右圆括号 )
    LEFT_BRACE: 'LEFT_BRACE',      // 左花括号 {
    RIGHT_BRACE: 'RIGHT_BRACE',    // 右花括号 }
    COMMA: 'COMMA',                // 逗号 ,
    DOT: 'DOT',                    // 点号 .
    MINUS: 'MINUS',                // 减号 -
    PLUS: 'PLUS',                  // 加号 +
    SEMICOLON: 'SEMICOLON',        // 分号 ;
    SLASH: 'SLASH',                // 斜杠 /
    STAR: 'STAR',                  // 星号 *

    // 一到两个字符的词法单元
    // One or two character tokens.
    BANG: 'BANG',                  // 感叹号 !
    BANG_EQUAL: 'BANG_EQUAL',      // 不等于 !=
    EQUAL: 'EQUAL',                // 赋值等号 =
    EQUAL_EQUAL: 'EQUAL_EQUAL',    // 相等比较 ==
    GREATER: 'GREATER',            // 大于 >
    GREATER_EQUAL: 'GREATER_EQUAL',// 大于等于 >=
    LESS: 'LESS',                  // 小于 <
    LESS_EQUAL: 'LESS_EQUAL',      // 小于等于 <=

    // 字面量
    // Literals.
    IDENTIFIER: 'IDENTIFIER',      // 标识符（变量名、函数名等）
    STRING: 'STRING',              // 字符串字面量
    NUMBER: 'NUMBER',              // 数字字面量

    // 关键字
    // Keywords.
    AND: 'AND',                    // 逻辑与 and
    CLASS: 'CLASS',                // 类定义 class
    ELSE: 'ELSE',                  // else 分支
    FALSE: 'FALSE',                // 布尔假 false
    FUN: 'FUN',                    // 函数定义 fun
    FOR: 'FOR',                    // for 循环
    IF: 'IF',                      // if 条件
    NIL: 'NIL',                    // 空值 nil
    OR: 'OR',                      // 逻辑或 or
    PRINT: 'PRINT',                // 输出 print
    RETURN: 'RETURN',              // 函数返回 return
    SUPER: 'SUPER',                // 父类引用 super
    THIS: 'THIS',                  // 当前对象 this
    TRUE: 'TRUE',                  // 布尔真 true
    VAR: 'VAR',                    // 变量声明 var
    WHILE: 'WHILE',                // while 循环

    // 文件结束标记
    // End of file.
    EOF: 'EOF',
    has(value) {
        return Object.values(this).includes(value);
    }
});


module.exports = {
    Token,
    TokenType
};