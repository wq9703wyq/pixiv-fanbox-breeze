import _store from "../store/index";
import backendReceiver from "/@/utils/backendReceiver";

export default {
  async backend_file_list_push({ list }) {
    (list || []).forEach((item) => {
      const { userName } = item;
      _store.filterFileList[userName] = item;
    });
    const { optViewId } = await _store.optViewId;
    if (optViewId) {
      const filterFileList = await _store.filterFileList.value;
      let isOptViewTab = false;
      await chrome.tabs
        .get(optViewId)
        .then(() => {
          isOptViewTab = true;
        })
        .catch(() => {
          isOptViewTab = false;
        });
      if (isOptViewTab) {
        backendReceiver.sendTabMsgById({
          event: "options_draftList_init",
          args: Object.values(filterFileList),
          id: optViewId,
        });
      }
    }
  },
  async backend_file_list_pop(args, sender) {
    _store.optViewId = sender.tab.id;
    const filterFileList = await _store.filterFileList.value;
    return Object.values(filterFileList);
  },
};
