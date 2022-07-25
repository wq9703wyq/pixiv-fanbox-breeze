export default class PathRename {
  #userName = "";

  #title = "";

  folderRename(file) {
    const imageList = file.imageList.map((img) => ({
      ...img,
      fileName: `${this.#userName}/${this.#title}/${img.fileName}`,
    }));
    const fileList = file.fileList.map((fileItem) => ({
      ...fileItem,
      fileName: `${this.#userName}/${this.#title}/${fileItem.fileName}.${
        fileItem.extension
      }`,
    }));
    return [...imageList, ...fileList];
  }

  setUser(draft) {
    this.#userName = draft.userName;
  }

  setTitle(draft) {
    this.#title = draft.title;
  }
}
