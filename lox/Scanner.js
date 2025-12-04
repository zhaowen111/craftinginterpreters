const { Token, TokenType } = require('./Token');
const Lox = require('./Lox');
const assert = require('assert');
const { isDigit, isAlpha, isAlphaNumeric } = require("../tool/utils")
const keywords = require('./keywords')
class Scanner {
    constructor(source) {
        this.source = source;
        this.tokens = [];
        this.start = 0;
        this.current = 0;
        this.line = 1;
        this.keywords = keywords
    }
    scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scanToken();
        }
        //扫描完成后添加一个行尾符
        this.tokens.push(new Token(TokenType.EOF, "", null, this.line));
        return this.tokens
    }
    scanToken() {
        const c = this.advance();
        switch (c) {
            //单字符token
            case '(': this.addToken(TokenType.LEFT_PAREN, null); break;
            case ')': this.addToken(TokenType.RIGHT_PAREN, null); break;
            case '{': this.addToken(TokenType.LEFT_BRACE, null); break;
            case '}': this.addToken(TokenType.RIGHT_BRACE, null); break;
            case ',': this.addToken(TokenType.COMMA, null); break;
            case '.': this.addToken(TokenType.DOT, null); break;
            case '-': this.addToken(TokenType.MINUS, null); break;
            case '+': this.addToken(TokenType.PLUS, null); break;
            case ';': this.addToken(TokenType.SEMICOLON, null); break;
            case '*': this.addToken(TokenType.STAR, null); break;

            //1-2字符token
            case '!':
                this.addToken(this.match('=') ? TokenType.BANG_EQUAL : TokenType.BANG, null);
                break;
            case '=':
                this.addToken(this.match('=') ? TokenType.EQUAL_EQUAL : TokenType.EQUAL, null);
                break;
            case '<':
                this.addToken(this.match('=') ? TokenType.LESS_EQUAL : TokenType.LESS, null);
                break;
            case '>':
                this.addToken(this.match('=') ? TokenType.GREATER_EQUAL : TokenType.GREATER, null);
                break;
            case '/':
                if (this.match('/')) {
                    //单行注释，忽略直到行尾
                    while (this.peek() !== '\n' && !this.isAtEnd()) this.advance();
                } else {
                    this.addToken(TokenType.SLASH, null);
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
                } else if (isAlpha(c)) {
                    this.identifier()
                }
                else {
                    Lox.error(this.line, `Unexpected character:${c}`); break;
                }
        }
    }
    //current是否超出了源代码长度
    isAtEnd() {
        return this.current >= this.source.length;
    }
    //返回当前扫描字符是否与参数传递的字符相同。相同则current加1
    match(expected) {
        if (this.isAtEnd() || this.peek() !== expected) return false;
        this.current++;
        return true;
    }
    //返回当前扫描字符，并使current+1
    advance() {
        return this.source.charAt(this.current++);
    }
    //返回当前扫描字符
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
    //将一个token放入this.tokens
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
    identifier() {
        while (isAlphaNumeric(this.peek())) this.advance()

        const text = this.source.substring(this.start, this.current)
        let type = this.keywords.get(text) || TokenType.IDENTIFIER
        this.addToken(type, null)
    }
}

module.exports = Scanner;