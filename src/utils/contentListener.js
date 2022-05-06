import EventEmitter from "./eventEmitter";

const eEmitter = new EventEmitter();

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  const { event, args } = request;
  const res = await eEmitter.emit(event, ...args);
  sendResponse(res);
});

export default eEmitter;