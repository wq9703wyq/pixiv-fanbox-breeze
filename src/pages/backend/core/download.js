function chromDownLoad(file, opt, callback) {
  console.log(`${file.fileName} _begin_download`);
  return chrome.downloads.download(
    {
      url: file.fileUrl,
      filename: file.fileName,
      conflictAction: "uniquify",
      saveAs: false,
      ...(opt || {}),
    },
    callback
  );
}

export default class DownLoad {
  constructor(max, downLoadList, port) {
    this.port = port;
    this.#maxLimit = max || 0;
    this.downLoadList = downLoadList || [];
    this.#downLoadingItem = new Map();
    this.#downLoadedItem = [];
    this.#isCancel = false;
    this.#isPause = false;
  }

  port = null;

  downLoadList = [];

  #maxLimit = 0;

  #downLoadingItem = new Map();

  #downLoadedItem = [];

  #isCancel = false;

  #isPause = false;

  #taskIndex = 0;

  #runnerCount = 0;

  listenerInstance = null;

  #pushInDownloadId(id, file) {
    this.#runnerCount += 1;
    this.#downLoadingItem.set(id, { ...file });
  }

  listenDownload(detail) {
    const { id: _id } = detail;
    if (this.#downLoadingItem.has(_id)) {
      if (detail?.state?.current === "complete") {
        this.#downLoadedItem.push(_id);
        this.#runnerCount -= 1;
        this.port.postMessage({
          args: {
            file: this.#downLoadingItem.get(_id),
            msg: "download_success",
          },
          event: "download_success",
        });
        if (
          this.#runnerCount < this.#maxLimit &&
          this.#taskIndex < this.downLoadList.length &&
          !this.#isCancel &&
          !this.#isPause
        ) {
          const file = this.downLoadList[this.#taskIndex];
          chromDownLoad(file, {}).then((id) => {
            this.#pushInDownloadId(id, { ...file });
          });
          this.#taskIndex += 1;
        }
      }
    }
    if (this.#downLoadedItem.length === this.downLoadList.length) {
      chrome.downloads.onChanged.removeListener(this.listenerInstance);
    }
  }

  beforeDownload() {
    this.downLoadList.slice(0, this.#maxLimit).map((file) =>
      chromDownLoad(file, {}).then((id) => {
        this.#pushInDownloadId(id, { ...file });
        this.#taskIndex += 1;
      })
    );
    this.listenerInstance = (detail) => this.listenDownload(detail);
    chrome.downloads.onChanged.addListener(this.listenerInstance);
    return true;
  }

  downLoadCancel() {
    this.#isCancel = true;
    this.#downLoadingItem.forEach(
      (value, id) =>
        !this.#downLoadedItem.includes(id) && chrome.downloads.cancel(id)
    );
    chrome.downloads.onChanged.removeListener(this.listenerInstance);
  }

  downLoadPause() {
    this.#isPause = true;
    this.#downLoadingItem.forEach(
      (value, id) =>
        !this.#downLoadedItem.includes(id) && chrome.downloads.pause(id)
    );
    return { status: "resume" };
  }

  downloadResume() {
    this.#isPause = false;
    this.#downLoadingItem.forEach(
      (value, id) =>
        !this.#downLoadedItem.includes(id) && chrome.downloads.resume(id)
    );
    return { status: "pause" };
  }
}
