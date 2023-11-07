/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-31 16:02:57
 */
import { workspace } from "vscode";

const vsConfig = workspace.getConfiguration("deliverAwesomeSnippet");
const username: string = vsConfig.get("login.username");
const password: string = vsConfig.get("login.password");
const origin: string = vsConfig.get("api.origin");

export default {
  username,
  password,
  origin
};