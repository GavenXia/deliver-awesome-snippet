/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-30 00:47:25
 */
import * as vscode from 'vscode';
import * as fs from "fs";
import * as os from "os";
import * as path from "path";
import generateSnippet  from "./command/generateSnippet";
import openSnippet from "./command/openSnippet";
import deleteSnippet from "./command/deleteSnippet";
import { LocalSnippetProvider, RemoteSnippetProvider } from "./handlers";
import { APPDATA_DIR } from "./utils/constant";

// 激活插件
export async function activate(context: vscode.ExtensionContext) {
  console.log("插件已经被激活");

  // 创建本地代码片段树栏目
  const snippetDirPath = `${APPDATA_DIR}/Code/User/snippets`;
  const localSnippetProvider = new LocalSnippetProvider(snippetDirPath);
  vscode.window.createTreeView("localSnippet", {
    treeDataProvider: localSnippetProvider,
  });

  // 创建远程代码片段树栏目
  const remoteSnippetProvider = new RemoteSnippetProvider();
  vscode.window.createTreeView("remoteSnippet", {
    treeDataProvider: remoteSnippetProvider,
  });

  const fileWatcher = vscode.workspace.onDidSaveTextDocument((document) => {
    const modifiedFileUri = document.uri;
    const filePaths = localSnippetProvider.filePaths;
    if (filePaths.includes(modifiedFileUri.fsPath)) {
      localSnippetProvider.refresh();
    }
  });
  context.subscriptions.push(fileWatcher);

  const loadLocalSnippetCdm = vscode.commands.registerCommand(
    "deliverAwesomeSnippet.loadLocalSnippet",
    () => localSnippetProvider.refresh()
  );
  context.subscriptions.push(loadLocalSnippetCdm);

  const openSnippetCdm = vscode.commands.registerCommand(
    "deliverAwesomeSnippet.openSnippet",
    openSnippet
  );
  context.subscriptions.push(openSnippetCdm);

  const refreshCdm = vscode.commands.registerCommand(
    "deliverAwesomeSnippet.refresh",
    () => localSnippetProvider.refresh()
  );
  context.subscriptions.push(refreshCdm);

  const deleteSnippetCdm = vscode.commands.registerCommand(
    "deliverAwesomeSnippet.deleteSnippet",
    async (args) => {
      await deleteSnippet(args);
      localSnippetProvider.refresh();
    }
  );
  context.subscriptions.push(deleteSnippetCdm);

  const generateSnippetCdm = vscode.commands.registerCommand(
    "deliverAwesomeSnippet.generateSnippet", async() => {
      await generateSnippet();
      localSnippetProvider.refresh();
    }
  );
  context.subscriptions.push(generateSnippetCdm);
}



// 插件被释放时
export function deactivate() {}
