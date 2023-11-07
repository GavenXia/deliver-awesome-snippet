/*
 * @Author: xiaminghua xiaminghua@linklogis.com
 * @LastEditors: xiaminghua
 * @LastEditTime: 2023-10-31 16:19:40
 */
import request from "./http";

export function login(params) {
  return request.post<LoginResult>("/materials-web/v1/login", params);
}