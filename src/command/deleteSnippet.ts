/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-30 01:03:01
 */
import {
  Uri,
  window,
  workspace,
  Position,
  Range,
  TextEditorRevealType,
  Selection,
} from "vscode";
import { getObjectExpressionNodeLoc } from "../handlers";

export default async function deleteSnippet(item) {
  console.log(item)
  const filePath = item.filePath;
  try {
    const uri = Uri.file(filePath);
    const document = await workspace.openTextDocument(uri);
    const editor = await window.showTextDocument(document);
    const code = editor.document.getText();
    const targetSnippetNode = getObjectExpressionNodeLoc(item.label, code);
    if (editor) {
      const { start, end } = targetSnippetNode;
      const startPos = new Position(start.line - 1, start.column);
      const endPos = new Position(end.line - 1, end.column);
      const range = new Range(startPos, endPos);
      editor.edit((editBuilder) => {
        editBuilder.delete(range);
      });
    }
  } catch (error) {
    window.showErrorMessage(error);
  }
}
