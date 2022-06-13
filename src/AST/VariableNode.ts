import Node from "./Node";
import Token from "../Token";

export default class VariableNode extends Node {
  variable: Token;
  
  constructor(variable: Token) {
    super();
    this.variable = variable;
  }
}