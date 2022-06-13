import optionsPageMsg from "/@/utils/optionsPageMsg";
import fileCatch from "./fileCatch";

Object.entries({ ...fileCatch }).forEach(([key, fn]) => {
  optionsPageMsg.on(key, fn);
});
