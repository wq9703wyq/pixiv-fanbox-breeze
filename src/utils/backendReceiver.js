import BackendEventEmitter from "./backendEventEmitter.js";

class BackendReceiver extends BackendEventEmitter {
  constructor() {
    super();
    console.log("backend_receiver init");
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { event, args } = request;
      console.log(`backend_request`, request);
      console.log("backend_sender", sender);
      this.emit(event, args, sender).then((res) => {
        res && sendResponse(res);
      });
      return true;
    });

    chrome.runtime.onConnect.addListener((port) => {
      console.log("backend_connent", port);
      port.onMessage.addListener(async (request) => {
        const { event, args } = request;
        const res = await this.emit(event, args);
        res && port.postMessage(res);
      });
    });
  }

  sendTabMsgById({ event, args, callback, id }) {
    const eventBody = { event, args: args || {} };
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(id, eventBody, (result) => {
        callback && callback();
        resolve(result);
      });
    });
  }
}

const backendReceiver = new BackendReceiver();
export default backendReceiver;
