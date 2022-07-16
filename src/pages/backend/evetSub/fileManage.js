import _store from "../store/index";
import backendReceiver from "/@/utils/backendReceiver";

export default {
  async filterFileListPush({ list }) {
    console.log(`list`, list);

    (list || []).forEach((item) => {
      const { userName } = item;
      _store.filterFileList.set(userName, item);
    });

    if (_store.optViewId) {
      let isOptViewTab = false;
      await chrome.tabs
        .get(_store.optViewId)
        .then(() => {
          isOptViewTab = true;
        })
        .catch(() => {
          isOptViewTab = false;
        });
      if (isOptViewTab) {
        const res = [];
        _store.filterFileList.forEach((value) => {
          res.push(value);
        });
        backendReceiver.sendTabMsgById({
          event: "options_draftList_init",
          args: res,
          id: _store.optViewId,
        });
      }
    }
  },
  filtetFileListPop(args, port, sender) {
    _store.optViewId = sender.tab.id;
    const res = [];
    _store.filterFileList.forEach((value) => {
      res.push(value);
    });
    return res;
  },
};
