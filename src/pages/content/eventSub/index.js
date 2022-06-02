import contentListener from "/@/utils/contentListener";
import grabDraft from "./grabDraft";
Object.entries(grabDraft).forEach(([key, fn]) => {
  contentListener.on(key, fn)
})

console.log(contentListener)