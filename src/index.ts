import Lexer from "./lexer";


const code =
  `var:= true;
  if var then var := false
  else var := (true and true);`

const lexer = new Lexer(code);

lexer.lexAnalysis();

console.log(lexer.tokenList);