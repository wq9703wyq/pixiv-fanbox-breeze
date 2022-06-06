/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 20:56:02
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 22:33:07
 */
import Filter from "./Filter";

class GrabDraftBase {
  // 投稿列表
  draftList = [];

  // 筛选后投稿列表
  filterDraftList = [];

  nextUrl = "";

  // grabDraftList() {}

  async afterFetchDraftList(form) {
    if (this.nextUrl) {
      await this.grabDraftList();
    }
    const filter = new Filter(form);
    this.filterDraftList = this.draftList.filter((item) => filter.check(item));
  }
}

export default GrabDraftBase;
