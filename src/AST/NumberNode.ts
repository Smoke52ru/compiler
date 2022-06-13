import Node from "./Node";
import Token from "../Token";

export default class NumberNode extends Node {
  number: Token;

  constructor(variable: Token) {
    super();
    this.number = variable;
  }
}