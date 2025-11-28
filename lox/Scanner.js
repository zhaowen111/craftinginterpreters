const { Token, TokenType } = require('./Token');
const Lox = require('./Lox');
const assert = require('assert');
const { isDigit } = require("../tool/utils")
class Scanner {
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            //单字符token
            case '(': this.addTokenWithoutLiteral(TokenType.LEFT_PAREN); break;
            case ')': this.addTokenWithoutLiteral(TokenType.RIGHT_PAREN); break;
            case '{': this.addTokenWithoutLiteral(TokenType.LEFT_BRACE); break;
            case '}': this.addTokenWithoutLiteral(TokenType.RIGHT_BRACE); break;
            case ',': this.addTokenWithoutLiteral(TokenType.COMMA); break;
            case '.': this.addTokenWithoutLiteral(TokenType.DOT); break;
            case '-': this.addTokenWithoutLiteral(TokenType.MINUS); break;
            case '+': this.addTokenWithoutLiteral(TokenType.PLUS); break;
            case ';': this.addTokenWithoutLiteral(TokenType.SEMICOLON); break;
            case '*': this.addTokenWithoutLiteral(TokenType.STAR); break;

            //1-2字符token
            case '!':
                this.addTokenWithoutLiteral(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG);
                break;
            case '=':
                this.addTokenWithoutLiteral(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL);
                break;
            case '<':
                this.addTokenWithoutLiteral(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS);
                break;
            case '>':
                this.addTokenWithoutLiteral(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER);
                break;
            case '/':
                if (this.match('/')) {
                    //单行注释，忽略直到行尾
                    while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
                } else {
                    this.addTokenWithoutLiteral(TokenType.SLASH);
                }
                break;

            //忽略空白
            case ' ':
            case '\r':
            case '\t':
                break;
            case '\n':
                this.line++;
                break;

            //字符串字面量
            case '"': this.string(); break;


            default:
                if (isDigit(c)) {
                    this.number();
                } else {
                    Lox.error(this.line, `Unexpected character:${c}`); break;
                }
        }
    }
    //current是否超出了源代码长度
    isAtEnd() {
        return this.current >= this.source.length;
    }
    match(expected) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;
        this.current++;
        return true;
    }
    advance() {
        return this.source.charAt(this.current++);
    }
    peek() {
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current);
    }
    peekNext() {
        if (this.current + 1 > this.source.length) return '\0'
        return this.source.charAt(this.current + 1)
    }
    addTokenWithoutLiteral(type) {
        assert(type != null && arguments.length === 1);
        this.addToken(type, null);
    }
    addToken(type, literal = null) {
        assert(type != null && arguments.length === 2);
        const text = this.source.substring(this.start, this.current);
        this.tokens.push(new Token(type, text, literal, this.line));
    }
    string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            if (this.peek() === '\n') this.line++
            this.advance()
        }

        if (this.isAtEnd()) {
            Lox.error(this.line, 'Unterminated string.')
            return
        }
        this.advance();
        const value = this.source.substring(this.start + 1, this.current - 1)
        this.addToken(TokenType.STRING, value)
    }
    number() {
        while (isDigit(this.peek())) this.advance()

        if (this.peek() === '.' && isDigit(this.peekNext())) {
            this.advance()

            while (isDigit(this.peek())) this.advance()
        }

        this.addToken(TokenType.NUMBER, parseFloat(this.source.substring(this.start, this.current)))
    }
}

module.exports = Scanner;