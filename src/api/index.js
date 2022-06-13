/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 21:13:26
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 22:34:41
 */
import axios from "axios";

console.log("Api Init");
export default class Api {
  static BASE_URL = `https://api.fanbox.cc`;

  static createInstance() {
    const instance = axios.create({ withCredentials: true });
    const resolveFn = (res) => {
      const { statusText } = res;
      if (statusText) {
        // Promise.reject({ statusText, status })
        Promise.reject(new Error(statusText));
      }
      return res.data;
    };
    const rejectFn = (err) => {
      Promise.reject(err);
    };
    instance.interceptors.response.use(resolveFn, rejectFn);
    return instance;
  }

  static request = this.createInstance();

  static assembleParams(args) {
    return Object.fromEntries(
      Object.entries(args).filter(([key, value]) => value && key)
    );
  }

  static getUserId(url) {
    const regExp = /https:\/\/www.fanbox.cc\/@(\w*)/;
    const userId = url.match(regExp)[1];
    return userId;
  }

  static getPostListByUser({
    creatorId,
    limit = 300,
    maxPublishedDatetime = "",
    maxId = "",
  }) {
    return this.request.get(`${this.BASE_URL}/post.listCreator`, {
      params: this.assembleParams({
        creatorId,
        limit,
        maxPublishedDatetime,
        maxId,
      }),
    });
  }

  static getUserPlanList({ creatorId }) {
    return this.request.get(`${this.BASE_URL}/plan.listCreator`, {
      params: this.assembleParams({ creatorId }),
    });
  }

  static async getPost(postId) {
    const url = `${this.BASE_URL}/post.info?postId=${postId}`;
    return this.request.get(url);
  }
}
