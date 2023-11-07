/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-11-02 17:52:03
 */
import { window, workspace, ExtensionContext } from "vscode";
import * as fs from "fs";
import { APPDATA_DIR } from "../utils/constant";

export default async function generateSnippet(context: ExtensionContext) {
  // 在这里获取选中的代码块并生成代码片段
  const editor = window.activeTextEditor;
  if (editor) {
    const selection = editor.selection;
    const selectedCode = editor.document.getText(selection);
    if (!selectedCode.length) {
      return window.showErrorMessage("请先选中代码块");
    }
    const name = await window.showInputBox({
      placeHolder: "请输入代码片段名称 (必填)",
      validateInput: (input) => (input ? "" : "代码片段名称不能为空"),
    });
    if (name === undefined) {
      return;
    }
    const scope = await window.showInputBox({
      placeHolder: "请输入代码片段的作用域 (可选)",
    });
    if (scope === undefined) {
      return;
    }
    const prefix = await window.showInputBox({
      placeHolder: "请输入代码片段的激活前缀 (必填)",
      validateInput: (input) => (input ? "" : "代码片段的激活前缀不能为空"),
    });
    if (prefix === undefined) {
      return;
    }
    const description = await window.showInputBox({
      placeHolder: "请输入代码片段的描述 (可选)",
    });
    if (description === undefined) {
      return;
    }
    let selectionOption = null
    const keys: string = context.globalState.get("localSnippets.code-snippets");
    console.log(keys);
    console.log(name);
    if(keys.includes(name)) {
      selectionOption = await window.showInformationMessage(
        `已存在名为${name}的代码片段`,
        "覆盖",
        "取消"
      );
    }
    if (selectionOption === "覆盖" || !selectionOption) {
      const snippetObj = generateSnippetObj(
        name,
        scope,
        prefix,
        selectedCode,
        description
      );
      saveSnippetToFile(snippetObj);
    } else if (selectionOption === "取消") {
      window.showInformationMessage("取消");
    }
  }
}

function generateSnippetObj(
  name: string,
  scope: string,
  prefix: string,
  selectedCode: string,
  description: string
): Record<string, Snippet> {
  const tabSize = workspace.getConfiguration("editor").get("tabSize");

  const spaces = new RegExp(` {${tabSize}}`, "g");
  
  const snippetObj: Record<string, Snippet> = {
    [name]: {
      ...(scope && { scope }),
      prefix,
      body: selectedCode
        .split(/\r?\n/)
        .map((line) =>
          line.replace(/\$(?![\d{]|TM_)/g, "\\$").replace(spaces, "\t")
        ),
      description: description || "",
    },
  };
  return snippetObj;
}

function saveSnippetToFile(snippetObj: Record<string, Snippet>) {
  const snippetFilePath = `${APPDATA_DIR}/Code/User/snippets/localSnippets.code-snippets`;

  const existingSnippets = fs.existsSync(snippetFilePath)
    ? fs.readFileSync(snippetFilePath, "utf8")
    : "{}";
  const snippets = existingSnippets ?  JSON.parse(existingSnippets) : {};

  const updatedSnippets = Object.assign({}, snippets, snippetObj);

  fs.writeFileSync(snippetFilePath, JSON.stringify(updatedSnippets, null, 2));
  window.showInformationMessage("代码片段已成功生成并保存。");
}
