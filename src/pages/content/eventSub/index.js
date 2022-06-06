/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-05 22:01:21
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 00:40:18
 */
import contentListener from "/@/utils/contentListener";
import grabDraft from "./grabDraft";
import getUser from "./getUser";

Object.entries({ ...grabDraft, ...getUser }).forEach(([key, fn]) => {
  contentListener.on(key, fn);
});
