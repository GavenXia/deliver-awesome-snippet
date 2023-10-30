/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-30 16:21:29
 */
import {
  Uri,
  window,
  workspace,
} from "vscode";
import traverse from "@babel/traverse";
import generator from "@babel/generator";
import { parse } from "../utils/parse";
import * as fs from "fs";

export default async function deleteSnippet(item) {
  const filePath = item.filePath;
  try {
    const uri = Uri.file(filePath);
    const document = await workspace.openTextDocument(uri);
    const code = document.getText();
    deleteCode(code, item.label, filePath);
  } catch (error) {
    window.showErrorMessage(error);
  }
}

async function deleteCode(code: string, label: string, filePath: string) {
  const wrappedCode = "let b=" + code + ";exports.b = b;";
  const ast = parse(wrappedCode);
  traverse(ast, {
    ObjectProperty: (path) => {
      if (
        !path.parentPath.node.key &&
        path.node.key.value === label &&
        path.node.value.type === "ObjectExpression"
      ) {
        path.remove();
      }
    },
  });
  const generatorCode = generator(ast).code.slice(8, -15);
  await fs.writeFileSync(filePath, generatorCode, "utf8");
}



