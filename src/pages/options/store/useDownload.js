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
    pushInFinishList(draft) {
      this.finishList.push(draft?.thumbnailUrl || draft?.fileUrl);
    },
  },
});
