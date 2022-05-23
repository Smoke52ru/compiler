import Token from './Token';
import TokenType, {tokenTypesList} from "./TokenType";
import ExpressionNode from "./AST/ExpressionNode";
import StatementNode from "./AST/StatementNode";
import NumberNode from "./AST/NumberNode";
import VariableNode from "./AST/VariableNode";
import BinOperationNode from "./AST/BinOperationNode";
import UnarOperationNode from "./AST/UnarOperationNode";
import StringNode from "./AST/StringNode";

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

  parseVariableOrNumber(): ExpressionNode {
    const number = this.match(tokenTypesList.NUMBER);
    if (number) {
      return new NumberNode(number);
    }
    const variable = this.match(tokenTypesList.VARIABLE);
    if (variable) {
      return new VariableNode(variable);
    }
    throw new Error(`Ожидается переменная или число на позиции ${this.pos}`);
  }

  parsePrint(): ExpressionNode {
    const token = this.match(tokenTypesList.LOG);
    if (token) {
      let operand = this.match(tokenTypesList.STRING)
      if (operand)
        return new UnarOperationNode(token, new StringNode(operand));

      return new UnarOperationNode(token, this.parseFormula());
    }
    throw new Error(`Ожидается унарный оператор ${tokenTypesList.LOG.name} на позиции ${this.pos}`);
  }

  parseParentheses(): ExpressionNode {
    if (this.match(tokenTypesList.LPAR)) {
      const node = this.parseFormula();
      this.require(tokenTypesList.RPAR);
      return node;
    } else {
      return this.parseVariableOrNumber();
    }
  }

  parseFormula(): ExpressionNode {
    let leftNode = this.parseParentheses();
    let operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    while (operator) {
      const rightNode = this.parseParentheses();
      leftNode = new BinOperationNode(operator, leftNode, rightNode);
      operator = this.match(tokenTypesList.MINUS, tokenTypesList.PLUS);
    }
    return leftNode;
  }

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


  parseExpression(): ExpressionNode {
    switch (true) {
      case !!this.match(tokenTypesList.LOG):
        this.pos -= 1;
        return this.parsePrint();
      case !!this.match(tokenTypesList.VARIABLE):
        this.pos -= 1;
        let variableNode = this.parseVariableOrNumber();
        const assignOperator = this.match(tokenTypesList.ASSIGN);
        if (assignOperator) {
          const rightFormulaNode = this.parseFormula();
          return new BinOperationNode(assignOperator, variableNode, rightFormulaNode);
        }
        throw new Error(`Неожиданный токен на позиции ${this.pos}`);
      default:
        throw new Error(`Неожиданный токен на позиции ${this.pos}`);
    }
  }

  parseCode(): ExpressionNode {
    const root = new StatementNode();
    while (this.pos < this.tokens.length) {
      try {
        const codeStringNode = this.parseExpression();
        this.require(tokenTypesList.SEMICOLON)
        root.addNode(codeStringNode);
      } catch (e) {
        while (this.pos < this.tokens.length && !this.match(tokenTypesList.SEMICOLON)) {
        }
      }
    }
    return root;
  }


  run(node: ExpressionNode): any {
    if (node instanceof NumberNode) {
      return parseInt(node.number.text);
    }
    if (node instanceof StringNode) {
      return node.string.text.slice(1, node.string.text.length - 1);
    }
    if (node instanceof UnarOperationNode) {
      switch (node.operator.type.name) {
        case tokenTypesList.LOG.name:
          console.log(this.run(node.operand))
          return
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
    if (node instanceof StatementNode) {
      node.codeStrings.forEach(codeString => {
        this.run(codeString);
      })
      return;
    }
    throw new Error(`Ошибка!`);
  }
}