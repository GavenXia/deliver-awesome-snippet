/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-11-02 16:16:38
 */
import {
  ExtensionContext,
  window,
  StatusBarAlignment,
  workspace,
  commands,
} from "vscode";
import generateSnippet  from "./command/generateSnippet";
import openSnippet from "./command/openSnippet";
import deleteSnippet from "./command/deleteSnippet";
import login from "./command/login";
import { LocalSnippetProvider, RemoteSnippetProvider } from "./handlers";
import { APPDATA_DIR } from "./utils/constant";

// 激活插件
export async function activate(context: ExtensionContext) {
  console.log("插件已经被激活");

  const statusBarItem = window.createStatusBarItem(
    StatusBarAlignment.Left,
    100
  );
  context.subscriptions.push(statusBarItem);

  // 创建本地代码片段树栏目
  const snippetDirPath = `${APPDATA_DIR}/Code/User/snippets`;
  const localSnippetProvider = new LocalSnippetProvider(
    snippetDirPath,
    context,
  );
  window.createTreeView("localSnippet", {
    treeDataProvider: localSnippetProvider,
  });

  // 创建远程代码片段树栏目
  const remoteSnippetProvider = new RemoteSnippetProvider(snippetDirPath);
  window.createTreeView("remoteSnippet", {
    treeDataProvider: remoteSnippetProvider,
  });

  const fileWatcher = workspace.onDidSaveTextDocument((document) => {
    const modifiedFileUri = document.uri;
    const filePaths = localSnippetProvider.filePaths;
    if (filePaths.includes(modifiedFileUri.fsPath)) {
      localSnippetProvider.refresh();
    }
  });
  context.subscriptions.push(fileWatcher);

  const loadLocalSnippetCdm = commands.registerCommand(
    "deliverAwesomeSnippet.loadLocalSnippet",
    () => localSnippetProvider.refresh()
  );
  context.subscriptions.push(loadLocalSnippetCdm);

  const loginCdm = commands.registerCommand("deliverAwesomeSnippet.login", () =>
    login(statusBarItem)
  );
  context.subscriptions.push(loginCdm);

  const openSnippetCdm = commands.registerCommand(
    "deliverAwesomeSnippet.openSnippet",
    openSnippet
  );
  context.subscriptions.push(openSnippetCdm);

  const refreshCdm = commands.registerCommand(
    "deliverAwesomeSnippet.refresh",
    () => localSnippetProvider.refresh()
  );
  context.subscriptions.push(refreshCdm);

  const deleteSnippetCdm = commands.registerCommand(
    "deliverAwesomeSnippet.deleteSnippet",
    async (args) => {
      await deleteSnippet(args);
      localSnippetProvider.refresh();
    }
  );
  context.subscriptions.push(deleteSnippetCdm);

  const generateSnippetCdm = commands.registerCommand(
    "deliverAwesomeSnippet.generateSnippet",
    async () => {
      await generateSnippet(context);
      localSnippetProvider.refresh();
    }
  );
  context.subscriptions.push(generateSnippetCdm);
}



// 插件被释放时
export function deactivate() {}
