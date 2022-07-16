export default class PathRename {
  #userName = "";

  #title = "";

  folderRename(file) {
    const imageList = file.imageList.map((img) => ({
      ...img,
      fileName: `${this.#userName}/${this.#title}/${img.fileName}`,
    }));
    return imageList;
  }

  setUser(draft) {
    this.#userName = draft.userName;
  }

  setTitle(draft) {
    this.#title = draft.title;
  }
}
