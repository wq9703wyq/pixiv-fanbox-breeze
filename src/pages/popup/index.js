import { createApp } from 'vue';
import App from './index.vue';
// console.log(document)
createApp(App).mount('#app');

function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
sendMessageToContentScript({ event: 'test', args: ['你好，我是popup！'] }, function (response) {
  console.log('来自content的回复：' + response);

});