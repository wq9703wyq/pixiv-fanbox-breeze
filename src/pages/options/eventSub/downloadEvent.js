import useDownload from "../store/useDownload";

export default () => {
  const _useDownload = useDownload();
  return {
    download_success: (args) => {
      // console.log(`download_event`, args);
      _useDownload.pushInFinishList(args);
    },
    cancel_callback: (args) => {
      _useDownload.changeDownload(args);
    },
    pause_callback: () => {},
    resume_callback: () => {},
  };
};
