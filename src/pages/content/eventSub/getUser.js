/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-05 22:00:53
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 00:39:27
 */
import GetUser from "../core/GetUser";

export default {
  getUserPlanList: async (args) => {
    const _getUser = new GetUser();
    await _getUser.getUserPlanList(args);
    return _getUser.planList;
  },
};
