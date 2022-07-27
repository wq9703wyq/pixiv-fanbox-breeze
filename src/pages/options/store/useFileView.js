import { defineStore } from "pinia";

export default defineStore("useFileView", {
  state() {
    return {
      draftList: [],
    };
  },
  actions: {
    replaceDraftList(list) {
      this.draftList = [...list];
    },
    pushInDraftList(list) {
      this.draftList.push([...list]);
    },
  },
});
