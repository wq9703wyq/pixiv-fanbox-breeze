// function sendMessageToContentScript(message, callback) {
//   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//     chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
//       if (callback) callback(response);
//     });
//   });
// }
// sendMessageToContentScript({ event: 'test', args: ['你好，我是popup！'] }, function (response) {
//   console.log('来自content的回复：' + response);

// });

class PopupSender {
  constructor() { }
  async getCurrentTab(callback) {
    this.currentTab = await chrome.tabs.getCurrent(callback);
    return this.currentTab;
  }
  sendMsgToTab(id, msg, callback) {
    return chrome.tabs.sendMessage(id, msg, callback)
  }
} 

const _popupSender = new PopupSender();

export default _popupSender