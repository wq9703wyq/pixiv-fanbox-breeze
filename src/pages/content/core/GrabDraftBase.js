/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 20:56:02
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 23:36:30
 */
import Filter from "./Filter"

class GrabDraftBase {
    draftList = [];
    filterDraftList = [];
    nextUrl = ''

    grabDraftList() { }

    async afterFetchDraftList(form) {
        if (this.nextUrl) {
            await this.grabDraftList();
        }
        const filter = new Filter(form)
        this.filterDraftList = this.draftList.filter(item => filter.check(item));
    }
}

export default GrabDraftBase;