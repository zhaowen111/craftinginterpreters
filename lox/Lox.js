const fs = require('fs');
const path = require('path');
const readLine = require('readline');
const Scanner = require("./Scanner.js")
class Lox {
    constructor() {
        this.hadError = false;
    }
    static start() {
        const args = process.argv.slice(2)
        if (args.length > 1) {
            console.log("Usage: node Lox.js [script]")
            process.exit(64)
        } else if (args.length === 1) {
            this.runFile(args[0])
        } else {
            this.runPrompt()
        }
    }
    static runFile(filePath) {
        const absFilePath = path.resolve(filePath);
        try {
            const content = fs.readFileSync(absFilePath, 'utf8')
            this.run(content)
            if (this.hadError) process.exit(65)
        } catch (err) {
            switch (err.code) {
                case 'ENOENT':
                    console.error(`要编译的Lox源代码文件不存在: ${absFilePath}`);
                    process.exit(66);
                    break;
                default:
                    throw err
                    process.exit(74);
            }
        }

    }
    static runPrompt() {
        const rl = readLine.createInterface({
            input: process.stdin,
            output: process.stdout,
            prompt: '> '
        });
        rl.prompt();
        rl.on('line', (line) => {
            this.run(line);
            this.hadError = false;
            rl.prompt();
        }).on('close', () => {
            console.log('Exiting Lox REPL.');
            process.exit(0);
        });
    }

    static run(source) {
        const scanner = new Scanner(source);
        const tokens = scanner.scanTokens();
        tokens.forEach(token => console.log(token));
    }
    static error(line, message) {
        this.report(line, "", message);
    }
    static report(line, where, message) {
        console.error(`[line ${line}] Error${where}: ${message}`);
    }
}

Lox.start()

module.exports = Lox;