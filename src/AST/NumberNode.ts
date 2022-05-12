import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class NumberNode extends ExpressionNode {
  number: Token;

  constructor(variable: Token) {
    super();
    this.number = variable;
  }
}