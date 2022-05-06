
// import contentListener from "/@/utils/contentListener";
// import contentListener from "/@/utils/contentListener.js";
import contentListener from "../../utils/contentListener";
console.log(contentListener)
console.log('content-script!')
contentListener.on('test', (value) => {
  alert(value);
  return '我收到你的消息了'
})

