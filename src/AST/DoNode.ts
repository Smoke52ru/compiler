import Node from "./Node";

export default class DoNode extends Node {
  condition: Node;
  body: Node;

  constructor(condition: Node, body: Node) {
    super();
    this.condition = condition;
    this.body = body;
  }
}