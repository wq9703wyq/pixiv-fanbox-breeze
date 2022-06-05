import EventEmitter from "./eventEmitter";

const contentListener = new EventEmitter();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { event, args } = request;
  const res = await contentListener.emit(event, ...args);
  sendResponse(res);
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (request) => {
    const { event, args } = request;
    const res = await contentListener.emit(event, args);
    port.postMessage(res)
  })
})

export default contentListener;