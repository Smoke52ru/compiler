export default class TokenType {
  name: string;
  regex: string;

  constructor(name: string, regex: string) {
    this.name = name;
    this.regex = regex;
  }
}

export const tokenTypesList = {
  'SEMICOLON': new TokenType('SEMICOLON', ';'),
  'SPACE': new TokenType('SPACE', '[ \\n\\t\\r]'),

  'LPAR': new TokenType('LPAR', '\\('),
  'RPAR': new TokenType('RPAR', '\\)'),
  'LBRAC': new TokenType('LBRAC', '\\{'),
  'RBRAC': new TokenType('RBRAC', '\\}'),
  'IF': new TokenType('IF', 'if'),
  'THEN': new TokenType('THEN', 'then'),
  'ELSE': new TokenType('ELSE', 'else'),
  'FOR': new TokenType('FOR', 'for'),
  'WHILE': new TokenType('WHILE', 'while'),
  'DO': new TokenType('DO', 'do'),
  'VARDECL': new TokenType('VARDECL', 'var'),
  'LOG': new TokenType('PRINT', 'print'),
  'TRUE': new TokenType('TRUE', 'true'),
  'FALSE': new TokenType('FALSE', 'false'),
  'BREAK': new TokenType('BREAK', 'break'),

  'MINUS': new TokenType('MINUS', '\\-'),
  'PLUS': new TokenType('PLUS', '\\+'),
  'MULT': new TokenType('MULT', '\\*'),
  'DIV': new TokenType('DIV', '\\/'),
  'OR': new TokenType('OR', '\\|\\|'),
  'AND': new TokenType('AND', '&&'),
  'EQ': new TokenType('EQ', '\\=\\='),
  'NEQ': new TokenType('NEQ', '\\!\\='),
  'LE': new TokenType('LE', '\\<\\='),
  'GE': new TokenType('GE', '\\>\\='),
  'LT': new TokenType('LT', '<'),
  'GT': new TokenType('GT', '>'),
  'NOT': new TokenType('NOT', '\\!'),
  'ASSIGN': new TokenType('ASSIGN', ':='),

  'NUMBER': new TokenType('NUMBER', '[0-9]+'),
  'STRING': new TokenType('STRING', '".*"'),
  'VARIABLE': new TokenType('VARIABLE', '[a-zA-Z]+'),
}