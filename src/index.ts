import Lexer from "./lexer";
import Parser from "./parser";


const code =
  `var:=1 -(1+9);
  var1:= (-1+var) + 999;
  
  print var;
  print var1;
  print (var+1);
  print "I love programming";
  `
// Разбивка на токены + лексический анализ
const lexer = new Lexer(code);
lexer.lexAnalysis();
// Вывод массива токенов
console.log(lexer.tokenList.map((token, index) => `${index}. <${token.type.name}>${token.text}`));
// Парсинг в AST + синтаксический анализ
const parser = new Parser(lexer.tokenList);
const rootNode = parser.parseCode();
// Выполнение + семантический анализ
parser.run(rootNode);
