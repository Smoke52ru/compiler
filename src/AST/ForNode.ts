import Node from "./Node";

export default class ForNode extends Node {
  before: Node;
  condition: Node;
  after: Node;
  body: Node;


  constructor(before: Node, condition: Node, after: Node, body: Node) {
    super();
    this.before = before;
    this.condition = condition;
    this.after = after;
    this.body = body;
  }
}