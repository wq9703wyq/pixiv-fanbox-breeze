/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 20:56:02
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 22:33:07
 */
import Filter from "./Filter";
import Api from "/@api/index.js"
import { store } from "./Store";

export default class GrabDraftBase {
  constructor({ filterParams }) {
    // this._filter = new Filter(filterParams)
  }

  // 实例化筛选器
  // _filter = {};

  // 投稿列表
  draftList = [];

  // 筛选后投稿列表
  filterDraftList = [];

  // 筛选后单件文件列表
  filterFileList = [];
  nextUrl = "";

  // grabDraftList() {}

  async afterFetchDraftList() {
    if (this.nextUrl) {
      await this.grabDraftList();
    }
    const filter = new Filter(store.form);
    this.filterDraftList = this.draftList.filter((item) => filter.check(item));
    await this.checkEachDraft();
    console.log(this.filterFileList);
    // this.filterFileList.forEach(item => {
    //   const sendData = {
    //     msg: 'send_download',
    //     fileUrl: item.fileUrl,
    //     fileName: item.fileName,
    //   }
    //   chrome.runtime.sendMessage(sendData)
    // })

  }

  async checkEachDraft() {
    const res = await Promise.all(this.filterDraftList.map(({ id }) => Api.getPost(id)));
    // this.checkDraftBody({ draft: res.body, form })
    res.forEach(item => this.checkDraftBody(item.body))
  }

  checkDraftBody(draft) {

    // const { imageMap } = draft.body;
    // this.filterFileList.push(...(Object.values(imageMap) || []).filter(item => filter.checkFileType(item)).map((item, index) => ({
    //   fileName: `${draft.title}/${index}.${item.extension}`,
    //   fileUrl: item.originalUrl
    // })))
    console.log(draft)
    const { title, feeRequired, publishedDatetime, id, user, body, type } = draft;
    const { userId, name } = user;
    const imageList = [];
    const fileList = [];
    if (type === 'article') {
      for (const block of body.blocks) {
        if (block.type === 'image') {
          const imageData = body.imageMap[block.imageId]
          const resource = this.saveImageData(imageData, imageList.length + 1);
          resource && imageList.push(resource)
        }
        if (block.type === 'file') {
          const fileData = body.fileMap[block.fileId]
          const resource = this.saveFileData(fileData);
          resource && fileList.push(resource);
        }
      }
    } else if (type === 'image') {
      for (const imageData of body.images) {
        const resource = this.saveImageData(imageData, imageList.length + 1);
        resource && imageList.push(resource)
      }
    }
    this.filterFileList.push({
      title,
      feeRequired,
      publishedDatetime,
      id,
      userId,
      userName: name,
      imageList,
      fileList
    })
  }

  saveImageData(imageData, index) {
    if (!imageData) {
      return;
    }
    const filter = new Filter(store.form);
    if (filter.checkFileType(imageData)) {
      const { extension, originalUrl, thumbnailUrl } = imageData;
      return { fileName: `${index}.${extension}`, fileUrl: originalUrl, thumbnailUrl, extension }
    }
  }

  saveFileData(fileData) {
    if (!fileData) {
      return;
    }
    const filter = new Filter(store.form);
    if (filter.checkFileType(fileData)) {
      const { extension, url, name } = fileData
      return { fileName: `${name}`, fileUrl: url, extension }
    }
  }
}