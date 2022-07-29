import _store from "../store/index";

export default {
  // 接受抓取文件同时保存 popup 表单参数
  backend_file_list_push({ mainPanelForm }) {
    Reflect.set(_store.mainPanelForm, "", { ...(mainPanelForm || {}) });
  },
  // popup 初始化读取保存表单
  async popup_init() {
    const mainPanelForm = Reflect.get(_store.mainPanelForm);
    return mainPanelForm;
  },
};
