/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 21:23:56
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:22:50
 */
import Api from "/@api/index"
import GrabDraftUser from "../core/GrabDraftUser";

export default {
  grabDraftByUser: async (args) => {
    const _grabDraftUser = new GrabDraftUser(); 
    await _grabDraftUser.grabDraftList(args);
    console.log(_grabDraftUser.draftList)
    return _grabDraftUser.draftList;
  }
}