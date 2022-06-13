import _store from "../store/index";

export default {
  filterFileListPush({ list }) {
    _store.filterFileList.push(...(list || []));
    console.log("_storePush", _store.filterFileList);
  },
};
