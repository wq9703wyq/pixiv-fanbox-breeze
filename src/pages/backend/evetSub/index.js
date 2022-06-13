import backendReceiver from "/@/utils/backendReceiver";
import storePop from "./storePop";
import storePush from "./storePush";

[storePop, storePush].forEach((item) => {
  Object.entries({ ...item }).forEach(([key, fn]) => {
    backendReceiver.on(key, fn);
  });
});
