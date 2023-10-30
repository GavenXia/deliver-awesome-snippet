/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-29 21:49:31
 */

interface IBaseNodeHandler {
  handle(): AstNode | undefined;
}

export class BaseNodeHandler implements IBaseNodeHandler {
  constructor(protected path: any) {}

  handle(): AstNode | undefined {
    throw new Error("must write handle");
  }
}
