import EventEmitter from "./eventEmitter.js";

const optionsPageMsg = new EventEmitter();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { event, args } = request;
  optionsPageMsg.emit(event, ...args).then((res) => {
    sendResponse(res);
  });
  return true;
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (request) => {
    const { event, args } = request;
    const res = await optionsPageMsg.emit(event, args);
    port.postMessage(res);
  });
});

export default optionsPageMsg;
