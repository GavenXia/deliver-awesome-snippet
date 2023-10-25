/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-24 15:25:54
 */
import * as vscode from 'vscode';
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

type Snippet = {
  scope?: string;
  prefix: string;
  body: string[];
  description: string;
};

// 激活插件
export async function activate(context: vscode.ExtensionContext) {
  console.log("插件已经被激活");
  // // 注册命令
  let disposable = vscode.commands.registerCommand(
    "deliver-awesome-snippet.create-snippet",
   async () => {
      // 在这里获取选中的代码块并生成代码片段
      const editor = vscode.window.activeTextEditor;
      if (editor) {
        const selection = editor.selection;
        
        const selectedCode = editor.document.getText(selection);
        if (!selectedCode.length) {
          return vscode.window.showErrorMessage("请先选中代码块");
        }

        const name = await vscode.window.showInputBox({
          placeHolder: "请输入代码片段名称 (必填)",
          validateInput: (input) => (input ? "" : "代码片段名称不能为空"),
        });

        if (name === undefined) {
          return;
        }

        const scope = await vscode.window.showInputBox({
          placeHolder: "请输入代码片段的作用域 (可选)",
        });

        if (scope === undefined) {
          return;
        }

        const prefix = await vscode.window.showInputBox({
          placeHolder: "请输入代码片段的激活前缀 (必填)",
          validateInput: (input) => (input ? "" : "代码片段的激活前缀不能为空"),
        });

        if (prefix === undefined) {
          return;
        }

        const description = await vscode.window.showInputBox({
          placeHolder: "请输入代码片段的描述 (可选)",
        });

        if (description === undefined) {
          return;
        }

        const snippetObj = generateSnippetObj(name, scope, prefix, selectedCode, description);

        saveSnippetToFile(snippetObj);
      }
    }
  );

  context.subscriptions.push(disposable);
}


function generateSnippetObj(
  name: string,
  scope: string,
  prefix: string,
  selectedCode: string,
  description: string
): Record<string, Snippet> {
  const tabSize = vscode.workspace.getConfiguration("editor").get("tabSize");

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
  const snippetFilePath =
    vscode.workspace.getConfiguration().get("files.autoSave") === "afterDelay"
      ? path.join(
          vscode.workspace.workspaceFolders?.[0]?.uri.fsPath ?? os.homedir(),
          ".vscode",
          "snippets",
          "mySnippets.code-snippets"
        )
      : path.join(
          os.homedir(),
          "Library",
          "Application Support",
          "Code",
          "User",
          "snippets",
          "mySnippets.code-snippets"
        );

  // 读取现有的代码片段文件内容
  const existingSnippets = fs.existsSync(snippetFilePath)
    ? fs.readFileSync(snippetFilePath, "utf8")
    : "{}";
  const snippets = JSON.parse(existingSnippets);
  // 将新的代码片段添加到现有的代码片段对象中
  const updatedSnippets = Object.assign({}, snippets, snippetObj);

  // 将更新后的代码片段写入到代码片段文件中
  fs.writeFileSync(snippetFilePath, JSON.stringify(updatedSnippets, null, 2));

  // 显示成功消息
  vscode.window.showInformationMessage("代码片段已成功生成并保存。");
}


// 插件被释放时
export function deactivate() {}
