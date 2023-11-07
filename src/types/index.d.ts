/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-31 11:15:57
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

 type User = {
    username: string;
    token?: string;
 }
