/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-31 11:18:26
 */
import { StatusBarItem } from "vscode";

export const showStatusBar = async function (statusItem: StatusBarItem, user: User) {
  statusItem.text = `物料用户: ${user.username}`;
  statusItem.tooltip = `当前登录物料用户: ${user.username}`;
  statusItem.show();
};
