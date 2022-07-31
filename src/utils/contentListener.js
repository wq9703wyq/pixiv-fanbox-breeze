import EventEmitter from "./contentEventEmitter.js";

class ContentListener extends EventEmitter {
  constructor() {
    super();
    console.log("content_listener init");
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      const { event, args } = request;
      console.log(`content_request`, request);
      console.log("content_sender", sender);
      this.emit(event, args, sender).then((res) => {
        res && sendResponse(res);
      });
      return true;
    });

    chrome.runtime.onConnect.addListener((port) => {
      port.onMessage.addListener(async (request) => {
        const { event, args } = request;
        const res = await this.emit(event, args);
        res && port.postMessage(res);
      });
    });
  }
}

const contentListener = new ContentListener();

export default contentListener;
