import EventEmitter from "./eventEmitter.js";

const contentListener = new EventEmitter();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { event, args } = request;
  console.log(`content_request`, request);

  contentListener.emit(event, args).then((res) => {
    res && sendResponse(res);
  });
  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (request) => {
    const { event, args } = request;
    const res = await contentListener.emit(event, args, port);
    port.postMessage(res);
  });
});

export default contentListener;
