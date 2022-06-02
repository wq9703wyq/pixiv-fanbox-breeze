import Api from "/@api/index"
export default {
  grabDraftByUser: async (args) => {
    const creatorId = Api.getUserId(location.href);
    const res = await Api.getPostListByUser({ creatorId, ...args });
    console.log(res)
    return res
  }
}