import Node from "./Node";
import Token from "../Token";

export default class UnarOperationNode extends Node {
  operator: Token;
  operand: Node;


  constructor(operator: Token, operand: Node) {
    super();
    this.operator = operator;
    this.operand = operand;
  }
}