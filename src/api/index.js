export default class Api {
  static request(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'get',
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            // 第一种异常，请求成功但状态不对
            reject({
              status: response.status,
              statusText: response.statusText,
            })
          }
        })
        .then((data) => {
          resolve(data)
        })
        .catch((error) => {
          // 第二种异常，请求失败
          reject(error)
        })
    })
  }
  static assembleURL(
    baseURL,
    args
  ) {
    const temp = new URL(baseURL)
    for (const [key, value] of Object.entries(args)) {
      value && temp.searchParams.append(key, value.toString())
    }
    return temp.toString()
  }

  static getUserId(url) {
    const regExp = /https:\/\/www.fanbox.cc\/\@(\w*)/;
    const [fullpath, userId] = url.match(regExp);
    return userId;
  }

  static async getPostListByUser(
    creatorId,
    limit = 10,
    maxPublishedDatetime = '',
    maxId = ''
  ) {
    const baseURL = `https://api.fanbox.cc/post.listCreator?creatorId=${creatorId}`
    const url = this.assembleURL(baseURL, {
      limit,
      maxPublishedDatetime,
      maxId,
    })
    return this.request(url)
  }
}