import Node from "./Node";
import Token from "../Token";

export default class BinOperationNode extends Node {
  operator: Token;
  leftNode: Node;
  rightNode: Node;


  constructor(operator: Token, leftNode: Node, rightNode: Node) {
    super();
    this.operator = operator;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}