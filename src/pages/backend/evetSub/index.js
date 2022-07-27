import backendReceiver from "/@/utils/backendReceiver";
// import storePop from "./storePop";
// import storePush from "./storePush";
import fileManage from "./fileManage";
import download from "./download";
import popupFormManage from "./popupFormManage";
// import optView from "./optView";

[fileManage, download, popupFormManage].forEach((item) => {
  Object.entries({ ...item }).forEach(([key, fn]) => {
    backendReceiver.on(key, fn);
  });
});
