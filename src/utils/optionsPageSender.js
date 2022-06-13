class OptionsPageSender {
  constructor() {
    this.getCurrentTab();
  }

  getCurrentTab() {
    this.currentTab = chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
  }

  static sendRunTimeMsg({ event, args, callback }) {
    const eventBody = { event, args: args || {} };
    chrome.runtime.sendMessage(eventBody, callback);
  }

  portListener() {
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
    return this.portListener();
  }
}

export default OptionsPageSender;
