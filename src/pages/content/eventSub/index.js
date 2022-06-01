import contentListener from "/@/utils/contentListener";
import grabDraft from "./grabDraft";
console.log(Object.entries(grabDraft))
Object.entries(grabDraft).forEach(([key, fn]) => {

  contentListener.on(key, fn)
})

console.log(contentListener)