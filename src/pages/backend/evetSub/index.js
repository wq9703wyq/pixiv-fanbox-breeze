import backendReceiver from "/@/utils/backendReceiver";
import fileManage from "./fileManage";
import popupFormManage from "./popupFormManage";

[fileManage, popupFormManage].forEach((item) => {
  Object.entries({ ...item }).forEach(([key, fn]) => {
    backendReceiver.on(key, fn);
  });
});
