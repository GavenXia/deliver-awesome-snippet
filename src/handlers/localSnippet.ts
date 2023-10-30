/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-30 00:31:11
 */
import * as vscode from 'vscode';
import * as path from "path";
import * as fs from "fs";
import {  parseTree } from 'jsonc-parser';

class JsonFile extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly deep: number = 0,
    public readonly contextValue: string,
    public readonly filePath: string,
    public readonly children?: any,
    public readonly iconPath?: any,
      // | string
      // | {
      //     light: string;
      //     dark: string;
      //   },
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
    this.deep = deep;
    this.filePath = filePath;
    this.iconPath = iconPath;
    this.children = children;
  }
}
// TODO： 驱蚊器翁
export class LocalSnippetProvider implements vscode.TreeDataProvider<JsonFile> {
  private _onDidChangeTreeData: vscode.EventEmitter<JsonFile> =
    new vscode.EventEmitter<JsonFile | undefined>();
  readonly onDidChangeTreeData: vscode.Event<JsonFile | undefined> =
    this._onDidChangeTreeData.event;
  private files: JsonFile[];

  constructor(private readonly rootPath: string) {}

  getTreeItem(element: JsonFile): vscode.TreeItem {
    return element;
  }

  getChildren(element?: JsonFile): Thenable<JsonFile[]> {
    if (element) {
      const { deep } = element;
      switch (deep) {
        case 0:
          return this.getSnippetKey(element);

        default:
          return Promise.resolve([]);
      }
    }
    return this.getSnippetFile();
  }

  getSnippetKey(element: JsonFile): Thenable<JsonFile[]> {
    const { filePath, children } = element;
    const iconPath = 
    // vscode.Uri.file("../../resource/icon/file-light.png");
    {
      light:vscode.Uri.file("../../resource/icon/file-light.png"),
      // path.join(
      //   __filename,
      //   "..",
      //   "..",
      //   "resources",
      //   "icon",
      //   "file-light.png"
      // ),
      dark: vscode.Uri.file("../../resource/icon/file-dark.png")
      // path.join(
      //   __filename,
      //   "..",
      //   "..",
      //   "resources",
      //   "icon",
      //   "file-dark.png"
      // ),
    };
    const codeSnippetKeys = children.map((key) => {
      return new JsonFile(
        key,
        vscode.TreeItemCollapsibleState.None,
        1,
        'snippet',
        filePath,
        [],
        iconPath,
        {
          command: "deliverAwesomeSnippet.openSnippet",
          title: "打开片段",
          arguments: [{ key, filePath }],
        }
      );
    });
    return Promise.resolve(codeSnippetKeys);
  }

  getSnippetFile(): Thenable<JsonFile[]> {
    const files =fs
      .readdirSync(this.rootPath)
      .filter((file) =>
        [".json", ".code-snippets"].includes(path.extname(file))
      )
      .map((file) => {
        const filePath = path.join(this.rootPath, file);
        const fileContent = fs.readFileSync(filePath, "utf-8");
        const jsonTree = parseTree(fileContent);
        const label = path.basename(filePath);
        const children = jsonTree.children.map((property) => {
          return property.children[0].value;
        });
        return new JsonFile(
          label,
          vscode.TreeItemCollapsibleState.Collapsed,
          0,
          'file',
          filePath,
          children,
          vscode.ThemeIcon.Folder
        );
      });
    this.files = files;
    return Promise.resolve(files);
  }

  get filePaths(): string[] {
    return this.files.map((file) => file.filePath);
  }

  refresh(): void {
    this._onDidChangeTreeData.fire(undefined);
  }
}