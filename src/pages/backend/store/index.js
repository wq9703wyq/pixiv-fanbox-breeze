class Store {
  constructor() {
    chrome.storage.local.set({
      filterFileList: {},
      optViewId: "",
      mainPanelForm: {},
    });
  }

  filterFileList = new Proxy(
    async () => {
      const { filterFileList } = await chrome.storage.local.get([
        "filterFileList",
      ]);
      console.log("filterFileList", filterFileList);
      return filterFileList;
    },
    {
      get: async (obj, prop) =>
        prop === "value" ? obj() : (await obj())[prop],
      set: async (obj, prop, value) => {
        const _obj = await obj();
        chrome.storage.local.set({
          filterFileList: { ..._obj, [prop]: value },
        });
      },
    }
  );
}
const store = new Store();

const setFns = {};

const getFns = {
  filterFileList: () => store.filterFileList,
};

const stoewProxy = new Proxy(store, {
  get: (_store, prop) =>
    getFns[prop]?.call(_store, _store, prop) ||
    chrome.storage.local.get([prop]),
  set: (_store, prop, value) =>
    setFns[prop]?.call(_store, _store, prop, value) ||
    chrome.storage.local.set({ [prop]: value }),
});
export default stoewProxy;
