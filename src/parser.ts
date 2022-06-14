import Token from './Token';
import TokenType, {tokenTypesList} from "./TokenType";
import Node from "./AST/Node";
import BlockNode from "./AST/BlockNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import StringNode from "./AST/StringNode";
import ConstantNode from "./AST/ConstantNode";
import IfNode from "./AST/IfNode";
import WhileNode from "./AST/WhileNode";
import ForNode from "./AST/ForNode";
import DoNode from "./AST/DoNode";

export default class Parser {
  tokens: Token[];
  pos: number = 0;
  scope: any = {};


  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  match(...expected: TokenType[]): Token | null {
    if (this.pos < this.tokens.length) {
      const currentToken = this.tokens[this.pos];
      if (expected.find(type => type.name === currentToken.type.name)) {
        this.pos += 1;
        return currentToken;
      }
    }
    return null;
  }

  require(...expected: TokenType[]): Token {
    const token = this.match(...expected);
    if (!token) {
      throw new Error(`На позиции ${this.pos} ожидается ${expected[0].name}`)
    }
    return token;
  }


  parseVariable(): Node {
    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable) {
      return new VariableNode(variable);
    }
    throw new Error(`Ожидается переменная на позиции ${this.pos}`);
  }

  parseNumber(): Node {
    const number = this.match(tokenTypesList.NUMBER);
    if (number) {
      return new NumberNode(number);
    }
    throw new Error(`Ожидается число на позиции ${this.pos}`);
  }

  parseString(): Node {
    const string = this.match(tokenTypesList.STRING);
    if (string) {
      return new StringNode(string);
    }
    throw new Error(`Ожидается строка на позиции ${this.pos}`);
  }

  //
  // parseVariableOrNumber(): Node {
  //   const number = this.match(tokenTypesList.NUMBER);
  //   if (number) {
  //     return new NumberNode(number);
  //   }
  //   const variable = this.match(tokenTypesList.VARIABLE);
  //   if (variable) {
  //     return new VariableNode(variable);
  //   }
  //   throw new Error(`Ожидается переменная или число на позиции ${this.pos}`);
  // }


  // parseParentheses(): Node {
  //   if (this.match(tokenTypesList.LPAR)) {
  //     const node = this.parseFormula();
  //     this.require(tokenTypesList.RPAR);
  //     return node;
  //   } else {
  //     return this.parseVariableOrNumber();
  //   }
  // }

  // parseFormula(): Node {
  //   let leftNode = this.parseParentheses();
  //   let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
  //   while (operator) {
  //     const rightNode = this.parseParentheses();
  //     leftNode = new BinOperationNode(operator, leftNode, rightNode);
  //     operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
  //   }
  //   return leftNode;
  // }

  /*  parseCondition(): ExpressionNode {
      let leftNode = this.parseParentheses();
      let operator = this.match(tokenTypesList.OR, tokenTypesList.XOR);
      while (operator) {
        const rightNode = this.parseParentheses();
        leftNode = new BinOperationNode(operator, leftNode, rightNode);
        operator = this.match(tokenTypesList.OR, tokenTypesList.XOR);
      }
      return leftNode;
    }*/

  // parseCondition(): Node {
  //
  // }
  //
  // parseIf(): Node {
  //   if (this.match(tokenTypesList.IF)) {
  //     const condition = this.parseCondition(pass)
  //       this.require(tokenTypesList.THEN);
  //   } else {
  //     throw new Error(`Неожиданный токен на позиции ${this.pos}`);
  //   }
  // }
  //
  // parseWhile(): Node {
  //
  // }

  parseAssign(): Node {
    const variable = this.parseVariable();
    if (variable) {
      const op = this.require(tokenTypesList.ASSIGN);
      const value = this.parseBool();
      return new BinOperationNode(op, variable, value);
    }
    throw new Error(`Ожидается имя переменной на позиции ${this.pos}`);
  }

  parseBool(): Node {
    let x = this.parseJoin();
    while (this.match(tokenTypesList.OR)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.OR);
      x = new BinOperationNode(op!, x, this.parseJoin());
    }
    return x;
  }

  parseJoin(): Node {
    let x = this.parseEquality();
    while (this.match(tokenTypesList.AND)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.AND);
      x = new BinOperationNode(op!, x, this.parseEquality());
    }
    return x;
  }

  parseEquality(): Node {
    let x = this.parseRel();
    while (this.match(tokenTypesList.EQ, tokenTypesList.NEQ)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.EQ, tokenTypesList.NEQ);
      x = new BinOperationNode(op!, x, this.parseRel());
    }
    return x;
  }

  parseRel(): Node {
    const x = this.parseExpr();
    switch (true) {
      case !!this.match(tokenTypesList.LT):
      case !!this.match(tokenTypesList.GT):
      case !!this.match(tokenTypesList.LE):
      case !!this.match(tokenTypesList.GE):
        this.pos -= 1;
        const op = this.match(
          tokenTypesList.LE,
          tokenTypesList.GT,
          tokenTypesList.LT,
          tokenTypesList.GE
        )
        return new BinOperationNode(op!, x, this.parseExpr());
      default:
        return x;
    }
  }

  parseExpr(): Node {
    let x = this.parseTerm();
    while (this.match(tokenTypesList.MINUS, tokenTypesList.PLUS)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
      x = new BinOperationNode(op!, x, this.parseTerm());
    }
    return x;
  }

  parseTerm(): Node {
    let x = this.parseUnary();
    while (this.match(tokenTypesList.MULT, tokenTypesList.DIV)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.MULT, tokenTypesList.DIV);
      x = new BinOperationNode(op!, x, this.parseUnary());
    }
    return x;
  }

  parseUnary(): Node {
    if (this.match(tokenTypesList.MINUS)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.MINUS);
      return new UnarOperationNode(op!, this.parseUnary())
    } else if (this.match(tokenTypesList.NOT)) {
      this.pos -= 1;
      const op = this.match(tokenTypesList.NOT);
      return new UnarOperationNode(op!, this.parseUnary())
    } else {
      return this.parseFactor();
    }
  }

  parseFactor(): Node {
    let x = null;
    switch (true) {
      case !!this.match(tokenTypesList.LPAR):
        x = this.parseBool();
        this.require(tokenTypesList.RPAR);
        return x;
      case !!this.match(tokenTypesList.NUMBER):
        this.pos -= 1;
        return this.parseNumber();
      case !!this.match(tokenTypesList.STRING):
        this.pos -= 1;
        return this.parseString();
      case !!this.match(tokenTypesList.TRUE):
        this.pos -= 1;
        return new ConstantNode(this.match(tokenTypesList.TRUE)!);
      case !!this.match(tokenTypesList.FALSE):
        this.pos -= 1;
        return new ConstantNode(this.match(tokenTypesList.FALSE)!);
      case !!this.match(tokenTypesList.VARIABLE):
        this.pos -= 1;
        return this.parseVariable();
      default:
        throw new Error(`Syntax Error on pos ${this.pos}`);
    }
  }

  parsePrint(): Node {
    const token = this.match(tokenTypesList.LOG);
    if (token) {
      let operand = this.parseBool();
      this.require(tokenTypesList.SEMICOLON);
      return new UnarOperationNode(token, operand);
    }
    throw new Error(`Ожидается унарный оператор ${tokenTypesList.LOG.name} на позиции ${this.pos}`);
  }

  parseIf(): Node {
    this.require(tokenTypesList.IF);
    this.require(tokenTypesList.LPAR);
    const condition = this.parseBool();
    this.require(tokenTypesList.RPAR);
    const bodyTrue = this.parseStmt();
    if (this.match(tokenTypesList.ELSE)) {
      const bodyFalse = this.parseStmt();
      return new IfNode(condition, bodyTrue, bodyFalse);
    }
    return new IfNode(condition, bodyTrue);
  }

  parseWhile(): Node {
    this.require(tokenTypesList.WHILE);
    this.require(tokenTypesList.LPAR);
    const condition = this.parseBool();
    this.require(tokenTypesList.RPAR);
    const body = this.parseStmt();
    return new WhileNode(condition, body);
  }

  parseDo(): Node {
    this.require(tokenTypesList.DO);
    const body = this.parseStmt();
    this.require(tokenTypesList.WHILE);
    this.require(tokenTypesList.LPAR);
    const condition = this.parseBool();
    this.require(tokenTypesList.RPAR);
    this.require(tokenTypesList.SEMICOLON)
    return new DoNode(condition, body);
  }

  parseFor(): Node {
    this.require(tokenTypesList.FOR);
    this.require(tokenTypesList.LPAR);
    const beforeAssign = this.parseAssign();
    this.require(tokenTypesList.SEMICOLON);
    const condition = this.parseBool();
    this.require(tokenTypesList.SEMICOLON);
    const afterAssign = this.parseAssign();
    this.require(tokenTypesList.RPAR);
    const body = this.parseStmt();
    return new ForNode(beforeAssign, condition, afterAssign, body);
  }

  parseStmt(): Node {
    switch (true) {
      case !!this.match(tokenTypesList.VARIABLE):
        this.pos -= 1;
        const assign = this.parseAssign();
        this.require(tokenTypesList.SEMICOLON);
        return assign;
      case !!this.match(tokenTypesList.IF):
        this.pos -= 1;
        return this.parseIf();
      case !!this.match(tokenTypesList.WHILE):
        this.pos -= 1;
        return this.parseWhile();
      case !!this.match(tokenTypesList.DO):
        this.pos -= 1;
        return this.parseDo();
      case !!this.match(tokenTypesList.FOR):
        this.pos -= 1;
        return this.parseFor();
      case !!this.match(tokenTypesList.LOG):
        this.pos -= 1;
        return this.parsePrint();
      case !!this.match(tokenTypesList.LBRAC):
        this.pos -= 1;
        return this.parseBlock();
      default:
        throw new Error(`Неожиданный токен на позиции ${this.pos}`);
    }
  }

  parseBlock(): Node {
    this.require(tokenTypesList.LBRAC);
    const root = new BlockNode();
    while (this.pos < this.tokens.length
    && !this.match(tokenTypesList.RBRAC)) {
      const stmt = this.parseStmt();
      root.addNode(stmt);
    }
    return root;
  }

  parseCode(): Node {
    const root = new BlockNode();
    while (this.pos < this.tokens.length) {
      const stmt = this.parseStmt();
      root.addNode(stmt);
    }
    return root;
  }


  run(node: Node): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof StringNode) {
      return node.string.text
        .slice(1, node.string.text.length - 1)
        .replaceAll("\\n", "\n");
    }
    if (node instanceof ConstantNode) {
      switch (node.constant.type.name) {
        case tokenTypesList.TRUE.name:
          return true;
        case tokenTypesList.FALSE.name:
          return false;
      }
    }
    if (node instanceof UnarOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.NOT.name:
          return !this.run(node.operand);
        case tokenTypesList.MINUS.name:
          return -this.run(node.operand);
        case tokenTypesList.LOG.name:
          console.log(this.run(node.operand));
          return;
      }
    }
    if (node instanceof BinOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.PLUS.name:
          if (typeof this.run(node.leftNode) === typeof this.run(node.rightNode) && typeof this.run(node.leftNode) === 'number')
            return this.run(node.leftNode) + this.run(node.rightNode);
          else
            throw Error(`Несоответствие типов в операции ${node.operator.pos}`)
        case tokenTypesList.MINUS.name:
          if (typeof this.run(node.leftNode) === typeof this.run(node.rightNode) && typeof this.run(node.leftNode) === 'number')
            return this.run(node.leftNode) - this.run(node.rightNode);
          else
            throw Error(`Несоответствие типов в операции ${node.operator.pos}`)
        case tokenTypesList.MULT.name:
          if (typeof this.run(node.leftNode) === typeof this.run(node.rightNode) && typeof this.run(node.leftNode) === 'number')
            return this.run(node.leftNode) * this.run(node.rightNode);
          else
            throw Error(`Несоответствие типов в операции ${node.operator.pos}`)
        case tokenTypesList.DIV.name:
          if (typeof this.run(node.leftNode) === typeof this.run(node.rightNode) && typeof this.run(node.leftNode) === 'number')
            return this.run(node.leftNode) / this.run(node.rightNode);
          else
            throw Error(`Несоответствие типов в операции ${node.operator.pos}`)

        case tokenTypesList.AND.name:
          return this.run(node.leftNode) && this.run(node.rightNode);
        case tokenTypesList.OR.name:
          return this.run(node.leftNode) || this.run(node.rightNode);

        case tokenTypesList.LT.name:
          return this.run(node.leftNode) < this.run(node.rightNode);
        case tokenTypesList.GT.name:
          return this.run(node.leftNode) > this.run(node.rightNode);
        case tokenTypesList.LE.name:
          return this.run(node.leftNode) <= this.run(node.rightNode);
        case tokenTypesList.GE.name:
          return this.run(node.leftNode) >= this.run(node.rightNode);

        case tokenTypesList.EQ.name:
          return this.run(node.leftNode) === this.run(node.rightNode);
        case tokenTypesList.NEQ.name:
          return this.run(node.leftNode) !== this.run(node.rightNode);

        case tokenTypesList.ASSIGN.name:
          const result = this.run(node.rightNode)
          const variableNode = <VariableNode>node.leftNode;
          this.scope[variableNode.variable.text] = result;
          return result;

      }
    }
    if (node instanceof VariableNode) {
      if (this.scope[node.variable.text]) {
        return this.scope[node.variable.text]
      } else {
        throw new Error(`Переменная с названием ${node.variable.text} не обнаружена`);
      }
    }
    if (node instanceof BlockNode) {
      node.codeStrings.forEach(codeString => {
        this.run(codeString);
      })
      return;
    }
    if (node instanceof IfNode) {
      if (this.run(node.condition)) {
        this.run(node.bodyTrue);
      } else {
        this.run(node.bodyFalse);
      }
      return;
    }
    if (node instanceof WhileNode) {
      while (this.run(node.condition)) {
        this.run(node.body)
      }
      return;
    }
    if (node instanceof ForNode) {
      for (this.run(node.before); this.run(node.condition); this.run(node.after)) {
        this.run(node.body);
      }
      return;
    }
    if (node instanceof DoNode) {
      do {
        this.run(node.body);
      } while (this.run(node.condition));
      return;
    }
    throw new Error(`Узел AST не нашел обработчика!`);
  }
}