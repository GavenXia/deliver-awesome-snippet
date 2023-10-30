/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-29 21:14:23
 */
type Snippet = {
  scope?: string;
  prefix: string;
  body: string[];
  description: string;
};

 interface AstNode {
   key: string;
   start: {
     line: number;
     column: number;
     index: number;
   };
   end: {
     line: number;
     column: number;
     index: number;
   };
 }
