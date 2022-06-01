import Api from "/@api/index"
export default {
  grabDraftByUser: async () => {
    const userId = Api.getUserId(location.href);
    const list = await Api.getPostListByUser(userId);
    console.log(list)
  }
}