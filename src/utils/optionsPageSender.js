import EventEmitter from "./optEventEmitter";

class OptionsPageSender extends EventEmitter {
  constructor(event) {
    super();
    Object.entries(event || {}).forEach(([key, val]) => this.on(key, val));
    console.log("opt_listener");
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { event: _event, args: _args } = request;
      this.emit(_event, _args).then((res) => {
        sendResponse(res);
      });
      return true;
    });
  }

  currentPort = null;

  static sendRunTimeMsg({ event, args, callback }) {
    const eventBody = { event, args: args || {} };
    chrome.runtime.sendMessage(eventBody, callback);
  }

  disconnectPort() {
    if (this.currentPort) {
      this.currentPort.disconnect();
      this.currentPort = null;
    }
  }

  async connectToBackend({ event, args }) {
    this.currentPort = chrome.runtime.connect();
    this.currentPort.postMessage({ args: args || {}, event });
    this.currentPort.onMessage.addListener((response) => {
      const { event: _event, args: _args } = response;
      if (event === "disconnect") {
        this.disconnectPort();
        return;
      }
      this.emit(_event, _args);
    });
  }
}

export default OptionsPageSender;
