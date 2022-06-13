import Node from "./Node";
import Token from "../Token";

export default class ConstantNode extends Node {
  constant: Token;

  constructor(constant: Token) {
    super();
    this.constant = constant;
  }
}