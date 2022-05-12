import Lexer from "./lexer";
import Parser from "./parser";


const code =
  `var := 1+2;
  print var;
  `

const lexer = new Lexer(code);

lexer.lexAnalysis();

console.log(lexer.tokenList.map((token, index) => `${index}. <${token.type.name}>${token.text}`));

const parser = new Parser(lexer.tokenList);

const rootNode = parser.parseCode();

parser.run(rootNode);
