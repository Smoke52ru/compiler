import Lexer from "./lexer";
import Parser from "./parser";
import * as fs from "fs";


const code = fs.readFileSync('src/probe.txt','utf8');

// Разбивка на токены + лексический анализ
const lexer = new Lexer(code);
lexer.lexAnalysis();

// Вывод массива токенов
// console.log(lexer.tokenList.map((token, index) => `${index}. <${token.type.name}> ${token.text}`));

// Парсинг в AST + синтаксический анализ
const parser = new Parser(lexer.tokenList);
const rootNode = parser.parseCode();

// Выполнение + семантический анализ
parser.run(rootNode);
