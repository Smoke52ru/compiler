import Node from "./Node";

export default class BlockNode extends Node {
  codeStrings: Node[] = [];

  addNode(node: Node) {
    this.codeStrings.push(node);
  }
}