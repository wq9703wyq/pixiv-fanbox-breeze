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
      return filterFileList;
    },
    {
      get: (obj) => obj(),
      set: async (obj, prop, value) => {
        const _obj = await obj();
        chrome.storage.local.set({
          filterFileList: { ..._obj, [prop]: value },
        });
      },
    }
  );

  mainPanelForm = new Proxy(
    async () => {
      const { mainPanelForm } = await chrome.storage.local.get([
        "mainPanelForm",
      ]);
      return mainPanelForm;
    },
    {
      get: (obj) => obj(),
      set: (obj, prop, value) => {
        chrome.storage.local.set({ mainPanelForm: value });
      },
    }
  );

  optViewId = new Proxy(
    async () => {
      const { optViewId } = await chrome.storage.local.get(["optViewId"]);
      return optViewId;
    },
    {
      get: (obj) => obj(),
      set: (obj, prop, value) => {
        chrome.storage.local.set({ optViewId: value });
      },
    }
  );
}
const sotre = new Store();
export default sotre;
