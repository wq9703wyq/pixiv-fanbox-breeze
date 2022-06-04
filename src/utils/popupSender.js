/*
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 21:54:37
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 21:54:37
 */
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
  constructor() {
    this.currentTab = this.getCurrentTab();
  }
  async getCurrentTab() {
    const currentTab = await chrome.tabs.query({ active: true, currentWindow: true });
    return currentTab;
  }
  // async sendMsgToCurrentTab({ event, msg, callback }) {
  //   await this.getCurrentTab();
  //   let { id } = this.currentTab[0];
  //   const eventBody = { event, args: [...(msg || [])] }
  //   chrome.tabs.sendMessage(id, eventBody, callback);

  // }
  popupListener() {
    return new Promise((resolve) => {
      this.currentPort.onMessage.addListener(response => {
        resolve(response)
      })
    })
  }
  async connectToCurrentTab({ id, event, args }) {
    const currentTab = await this.currentTab;
    id = id || currentTab[0].id
    this.currentPort = chrome.tabs.connect(id);
    this.currentPort.postMessage({ args, event });
    return this.popupListener()
  }
}

export default PopupSender