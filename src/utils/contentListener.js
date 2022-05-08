import EventEmitter from "./eventEmitter";

const contentListener = new EventEmitter();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { event, args } = request;
  const res = await contentListener.emit(event, ...args);
  sendResponse(res);
});

export default contentListener;