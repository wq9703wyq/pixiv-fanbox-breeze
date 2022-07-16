import DownLoad from "../core/download";

let download = null;

export default {
  send_download: ({ fileList }, port) => {
    console.log("background loaded");
    console.log(`backend_fileList`, fileList);
    download = new DownLoad(3, [...fileList], port);
    return download.beforeDownload();
  },
  cancel_download: () => {
    download.downLoadCancel();
    return true;
  },
  pause_download: () => download.downLoadPause(),
  resume_download: () => download.downloadResume(),
};
