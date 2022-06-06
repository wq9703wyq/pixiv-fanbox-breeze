/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-05 21:59:20
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-05 22:04:53
 */
import Api from "/@api/index";

export default class GetUser {
  planList = [];

  async getUserPlanList({ apiParams }) {
    const creatorId = Api.getUserId(location.href);
    const { body } = await Api.getUserPlanList(apiParams || { creatorId });
    this.planList = [...body];
    return body;
  }
}
