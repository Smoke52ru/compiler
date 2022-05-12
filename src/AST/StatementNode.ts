import ExpressionNode from "./ExpressionNode";

export default class StatementNode extends ExpressionNode {
  codeStrings: ExpressionNode[] = [];

  addNode(node: ExpressionNode) {
    this.codeStrings.push(node);
  }
}