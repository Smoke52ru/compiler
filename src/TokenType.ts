export default class TokenType {
  name: string;
  regex: string;

  constructor(name:string, regex:string) {
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  'SEMICOLON': new TokenType('SEMICOLON', ';'),
  'SPACE': new TokenType('SPACE', '[ \\n\\t\\r]'),
  'ASSIGN': new TokenType('ASSIGN', ':='),
  'LPAR': new TokenType('LPAR', '\\('),
  'RPAR': new TokenType('RPAR', '\\)'),
  'IF': new TokenType('IF', 'if'),
  'THEN': new TokenType('THEN', 'then'),
  'ELSE': new TokenType('ELSE', 'else'),
  'OR': new TokenType('OR', 'or'),
  'XOR': new TokenType('XOR', 'xor'),
  'AND': new TokenType('AND', 'and'),
  'MINUS': new TokenType('MINUS', '\\-'),
  'PLUS': new TokenType('MINUS', '\\+'),
  'LOG': new TokenType('PRINT', 'print'),
  'NUMBER': new TokenType('NUMBER', '[0-9]*'),
  'VARIABLE': new TokenType('VARIABLE', '[a-z]*'),
}