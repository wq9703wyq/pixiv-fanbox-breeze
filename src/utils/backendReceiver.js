import BackendEventEmitter from "./backendEventEmitter.js";

const backendReceiver = new BackendEventEmitter();

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { event, args } = request;
  console.log(`backend_request`, request);
  console.log("backend_sender", sender);
  backendReceiver.emit(event, args).then((res) => {
    console.log(`backend_emit_res`, res);
    sendResponse(res);
  });
  return true;
});

console.log("backendReceiver");
export default backendReceiver;
