import { defineStore } from "pinia";

export default defineStore("useDownload", {
  state() {
    return {
      finishList: [],
      downloadStatus: false,
    };
  },
  actions: {
    changeDownload(res) {
      this.downloadStatus.downloadStatus = res;
    },
    pushInFinishList(file) {
      this.finishList.push(file?.file?.thumbnailUrl || file?.file?.fileUrl);
    },
  },
});
