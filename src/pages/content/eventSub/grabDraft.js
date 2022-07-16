/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 21:23:56
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 00:39:30
 */
import GrabDraftUser from "../core/GrabDraftUser";

export default {
  grabDraftByUser: async (args) => {
    const _grabDraftUser = new GrabDraftUser({
      filterParams: args.filterParams || {},
    });
    const res = await _grabDraftUser.grabDraftList(args);
    return res;
  },
};
