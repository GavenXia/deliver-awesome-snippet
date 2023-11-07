/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-31 16:56:07
 */
import { window, StatusBarItem } from "vscode";
import * as fs from "fs";
import * as path from "path";
import config from "../config";
import { showStatusBar } from "../utils/statusBar";
import { login } from "../utils/api";

const { username, password } = config;

export default async function (statusItem: StatusBarItem) {
  let usernameStr = username,
    passwordStr = password;
  if (!usernameStr) {
    usernameStr = await window.showInputBox({
      password: false,
      placeHolder: "请输入用户名",
      prompt: "请输入用户名",
    });
  }
  if (usernameStr === undefined) return;
  if (!passwordStr) {
    passwordStr = await window.showInputBox({
      password: true,
      placeHolder: "请输入密码",
      prompt: "请输入密码",
    });
  }
  if (passwordStr === undefined) return;
  const params = {
    username: usernameStr,
    password: passwordStr
  };
  const res = await login(params);
  const { data: { code, message, result } } = res;
  if (code !== '200') {
    window.showErrorMessage(message);
  } else {
    window.showInformationMessage("登录成功");
    const uri = path.resolve(__dirname, "./user.js");
    const user = {
      username: result.username,
      token: result.token
    };
    fs.writeFileSync(uri, JSON.stringify(user, null, 2));
    showStatusBar(statusItem, user);
  }
}
