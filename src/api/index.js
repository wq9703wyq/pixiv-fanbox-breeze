import axios from "axios";
export default class Api {
  static BASE_URL = `https://api.fanbox.cc`;
  static createInstance() {
    const instance = axios.create({ withCredentials: true });
    const resolveFn = (res) => {
      const { status, statusText } = res
      if (statusText) {
        Promise.reject({ statusText, status })
      }
      return res;
    }
    const rejectFn = (err) => {
      Promise.reject(err)
    }
    instance.interceptors.response.use(resolveFn, rejectFn)
    return instance;
  }
  static request = this.createInstance();

  static assembleParams(args) {
    return Object.fromEntries(Object.entries(args).filter(([key, value]) => value));
  }

  static getUserId(url) {
    const regExp = /https:\/\/www.fanbox.cc\/\@(\w*)/;
    const [fullpath, userId] = url.match(regExp);
    return userId;
  }

  static getPostListByUser(
    { creatorId,
      limit = 300,
      maxPublishedDatetime = '',
      maxId = '' }
  ) {
    return this.request.get(`${this.BASE_URL}/post.listCreator`, {
      params: this.assembleParams({
        creatorId,
        limit,
        maxPublishedDatetime,
        maxId
      })
    })
  }
}