/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-29 22:01:05
 */
import traverse from "@babel/traverse";
import { parse } from "../utils/parse";
import { JsonKeysHandler } from "./JsonKeyHandler";


export function getObjectExpressionNodeLoc(
  key: string,
  code: string
): AstNode | undefined {
  let node: AstNode | undefined;
  const wrappedCode = "let b=" + code + ";exports.b = b;";;
  const ast = parse(wrappedCode);
  traverse(ast, {
    ObjectExpression: (path) => {
      // 找到最外层的 ObjectExpression
      if (!path.findParent((path) => path.isObjectExpression())) {
        const keys = path.node.properties.map(
          (property) => new JsonKeysHandler(property).handle()
        );
        node = keys.find((keyHandler) => keyHandler.key === key);
        path.stop();
      }
    },
  });

  return node;
}
