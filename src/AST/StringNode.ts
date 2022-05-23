import ExpressionNode from "./ExpressionNode";
import Token from "../Token";

export default class StringNode extends ExpressionNode {
  string: Token;

  constructor(string: Token) {
    super();
    this.string = string;
  }
}