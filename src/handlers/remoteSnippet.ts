/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-30 16:22:54
 */
import * as vscode from 'vscode';

class MyTreeItem {
  constructor(public label: string) {}
}

export class RemoteSnippetProvider implements vscode.TreeDataProvider<MyTreeItem> {
  getTreeItem(element: MyTreeItem): vscode.TreeItem {
    const treeItem = new vscode.TreeItem(element.label);
    treeItem.command = {
      command: "extension.selectItem",
      title: "Select Item",
      arguments: [element],
    };
    return treeItem;
  }

  getChildren(): Thenable<MyTreeItem[]> {
    // 返回当前项目文件树相关数据
    const fileTree = []; // 获取当前项目文件树的数据
    return Promise.resolve(fileTree);
  }
}