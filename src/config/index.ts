/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-27 11:08:43
 */
import { workspace } from "vscode";

const vsConfig = workspace.getConfiguration("deliverAwesomeSnippet");
const username: string = vsConfig.get("login.username");
const password: string = vsConfig.get("login.password");
const origin = vsConfig.get("api.origin");

export default {
  username,
  password,
  origin,
};