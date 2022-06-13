import _store from "../store/index";

export default {
  filtetFileListPop() {
    return [...(_store.filterFileList || [])];
  },
};
