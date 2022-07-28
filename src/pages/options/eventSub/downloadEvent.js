import useDownload from "../store/useDownload";
import DownLoad from "../core/download";

export default () => {
  let downloader = null;
  const _useDownload = useDownload();
  return {
    download_success: (args) => {
      _useDownload.pushInFinishList(args);
    },
    opt_handle_download: (args) => {
      const { allFileList } = args;
      downloader = new DownLoad(3, [...allFileList]);
      downloader.beforeDownload();
    },
    opt_cancel_download: () => downloader.downLoadCancel(),
    opt_pause_download: () => downloader.downLoadPause(),
    opt_resume_download: () => downloader.downloadResume(),
  };
};
