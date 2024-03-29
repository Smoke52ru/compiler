import Token from "./Token";
import {tokenTypesList} from "./TokenType";

export default class Lexer {
  code: string;
  pos: number = 0;
  tokenList: Token[] = [];
  errors: Array<any> = [];


  constructor(code: string) {
    this.code = code;
  }

  lexAnalysis(): Token[] {
    while (true) {
      try {
        if (!this.nextToken()) break;
      } catch (e) {
        this.pos += 1;
        this.errors.push(e);
      }
    }
    if (this.errors.length) {
      const errorsPointers = this.errors.map(e => parseInt(e.message))
      console.log(`Your code:\n\n${
          this.code
            .split('')
            .map((ch, i) => (errorsPointers.includes(i) ? ' >>>' + ch + '<<< ' : ch))
            .join('')
            .split('\n')
            .map(str => str.trim())
            .join('\n')
        }`
      )
      throw new Error('VVVVVVVVVVVVVVV\n' + this.errors.map(e => e.message).join('\n'));
    }
    this.tokenList = this.tokenList.filter(token => token.type.name !== tokenTypesList.SPACE.name);
    return this.tokenList;
  }

  nextToken(): boolean {
    if (this.pos >= this.code.length) {
      return false
    }
    const tokenTypesValues = Object.values(tokenTypesList);
    for (let i = 0; i < tokenTypesValues.length; i++) {
      const tokenType = tokenTypesValues[i];
      const regex = new RegExp('^' + tokenType.regex);
      const result = this.code.substr(this.pos).match(regex);
      if (result && result[0]) {
        const token = new Token(tokenType, result[0], this.pos);
        this.pos += result[0].length;
        this.tokenList.push(token);
        return true;
      }
    }
    throw new Error(`${this.pos} позиция: лексема не определена!!!`)
  }
}