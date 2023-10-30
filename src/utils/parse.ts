/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-29 19:47:45
 */
import { parse as babelParse } from "@babel/parser";
import { ParserOptions } from "@babel/parser";

const BABEL_PARSER_OPTIONS: ParserOptions = {
  sourceType: "module",
};

export function parse(code) {
  const ast = babelParse(code, BABEL_PARSER_OPTIONS);
  return ast;
}
