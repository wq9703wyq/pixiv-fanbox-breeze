/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 21:14:51
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:28:02
 */
import Api from "/@api/index"
import GrabDraftBase from "./GrabDraftBase"

class GrabDraftUser extends GrabDraftBase {
    async grabDraftList({ apiParams, filterParams }) {
        const creatorId = Api.getUserId(location.href);
        const { body } = await Api.getPostListByUser(apiParams || { creatorId });
        this.nextUrl = body?.nextUrl;
        this.draftList.push(...body.items);
        await this.afterFetchDraftList(filterParams);
    }
}

export default GrabDraftUser;