console.log("background loaded")

chrome.runtime.onMessage.addListener((msg) => {
  // 接收下载任务
  if (msg.msg === 'send_download') {
    // const tabId = sender.tab?.id
    // // 如果开始了新一批的下载，重设批次编号，清空下载索引
    // if (dlBatch[tabId] !== msg.taskBatch) {
    //   dlBatch[tabId] = msg.taskBatch
    // }

    // 开始下载
    chrome.downloads.download(
      {
        url: msg.fileUrl,
        filename: msg.fileName,
        conflictAction: 'uniquify',
        saveAs: false,
      },
      () => {
        console.log(msg.fileName);
      }
    )
  }
})