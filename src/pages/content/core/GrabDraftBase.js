/*
 * @Descripttion:
 * @version:
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 20:56:02
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-06 22:33:07
 */
import Filter from "./Filter";
import Api from "/@api/index.js";
import { store } from "./Store";

export default class GrabDraftBase {
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
      const regExp = /https:\/\/api.fanbox.cc\/post.listCreator\?(.*)/;
      const paramsUri = this.nextUrl.match(regExp)[1];
      await this.grabDraftList({ apiParams: { paramsUri } });
    } else {
      const filter = new Filter(store.form);
      this.filterDraftList = this.draftList.filter((item) =>
        filter.check(item)
      );
      await this.checkEachDraft();
    }
  }

  async checkEachDraft() {
    const res = await Promise.all(
      this.filterDraftList.map(({ id }) => Api.getPost(id))
    );
    res.forEach((item) => this.checkDraftBody(item.body));
  }

  checkDraftBody(draft) {
    const {
      title,
      feeRequired,
      publishedDatetime,
      id,
      user,
      body,
      type,
      coverImageUrl,
    } = draft;
    const { userId, name, iconUrl } = user;
    const imageList = [];
    const fileList = [];
    if (type === "article") {
      body.block.forEach((block) => {
        if (block.type === "image") {
          const imageData = body.imageMap[block.imageId];
          const resource = GrabDraftBase.saveImageData(
            imageData,
            imageList.length + 1
          );
          resource && imageList.push(resource);
        }
        if (block.type === "file") {
          const fileData = body.fileMap[block.fileId];
          const resource = GrabDraftBase.saveFileData(fileData);
          resource && fileList.push(resource);
        }
      });
    } else if (type === "image") {
      body.images.forEach((imageData) => {
        const resource = GrabDraftBase.saveImageData(
          imageData,
          imageList.length + 1
        );
        resource && imageList.push(resource);
      });
    }
    this.filterFileList.push({
      title,
      feeRequired,
      publishedDatetime,
      id,
      userId,
      userName: name,
      userIcon: iconUrl,
      imageList,
      fileList,
      coverImageUrl,
    });
  }

  static saveImageData(imageData, index) {
    if (!imageData) {
      return false;
    }
    const filter = new Filter(store.form);
    let filterData = {};
    if (filter.checkFileType(imageData)) {
      const { extension, originalUrl, thumbnailUrl } = imageData;
      filterData = {
        fileName: `${index}.${extension}`,
        fileUrl: originalUrl,
        thumbnailUrl,
        extension,
      };
    }
    return filterData;
  }

  static saveFileData(fileData) {
    if (!fileData) {
      return false;
    }
    const filter = new Filter(store.form);
    let filterData = {};
    if (filter.checkFileType(fileData)) {
      const { extension, url, name } = fileData;
      filterData = { fileName: `${name}`, fileUrl: url, extension };
    }
    return filterData;
  }
}
