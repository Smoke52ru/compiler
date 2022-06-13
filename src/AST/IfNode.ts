import Node from "./Node";

export default class IfNode extends Node {
  condition: Node;
  bodyTrue: Node;
  bodyFalse: Node;


  constructor(condition: Node, bodyTrue: Node, bodyFalse: Node) {
    super();
    this.condition = condition;
    this.bodyTrue = bodyTrue;
    this.bodyFalse = bodyFalse;
  }
}