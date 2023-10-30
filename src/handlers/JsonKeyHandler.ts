/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-29 21:52:35
 */
import { BaseNodeHandler } from "./BaseNode";

export class JsonKeysHandler extends BaseNodeHandler {
  handle() {
    return {
      key: this.path.key.value,
      start: { ...this.path.loc!.start },
      end: { ...this.path.loc!.end },
    };
  }
}
