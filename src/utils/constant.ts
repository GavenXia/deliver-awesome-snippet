/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-27 10:51:23
 */
import * as path from "path";
import * as os from "os";

export const MAC_APPDATA_DIR = process.env.HOME + "/Library/Application Support";

export const WIN_APPDATA_DIR = process.env.APPDATA?.split(path.sep).join("/");

export const APPDATA_DIR =
  os.platform() === "darwin" ? MAC_APPDATA_DIR : WIN_APPDATA_DIR;
