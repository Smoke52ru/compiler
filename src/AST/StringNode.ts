import Node from "./Node";
import Token from "../Token";

export default class StringNode extends Node {
  string: Token;

  constructor(string: Token) {
    super();
    this.string = string;
  }
}