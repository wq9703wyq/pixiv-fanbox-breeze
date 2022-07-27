class PopupSender {
  constructor() {
    this.getCurrentTab();
  }

  getCurrentTab() {
    this.currentTab = chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
  }

  async sendTabMsg({ event, args, callback }) {
    const currentTab = await this.currentTab;
    const eventBody = { event, args: args || {} };
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(currentTab[0].id, eventBody, (res) => {
        callback && callback();
        resolve(res);
      });
    });
  }

  static sendRunTimeMsg({ event, args, callback }) {
    const eventBody = { event, args: args || {} };
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(eventBody, (res) => {
        console.log("popupMsg", res);
        callback && callback();
        resolve(res);
      });
    });
  }

  popupListener() {
    return new Promise((resolve) => {
      this.currentPort.onMessage.addListener((response) => {
        resolve(response);
      });
    });
  }

  async connectToCurrentTab({ id, event, args }) {
    const currentTab = await this.currentTab;
    this.currentPort = chrome.tabs.connect(id || currentTab[0].id);
    this.currentPort.postMessage({ args: args || {}, event });
    return this.popupListener();
  }
}

export default PopupSender;
