import { nextTick, ref } from "vue";
import useFileView from "../store/useFileView";

const LIMIT_LEN = 4;
const MARGIN_HEIGHT = 20;

export default class ViewScrollLoad {
  scrollLoadList = [];

  standUpNodeList = ref([]);

  saveScrollHeight(event, id, imgIndex, draftIndex) {
    const _useFileView = useFileView();
    const beforeDraftLen = _useFileView.draftList
      .slice(0, draftIndex)
      .reduce((pre, cur) => pre + cur.filterFileList.length, 0);
    const imgIndexInAll = beforeDraftLen + imgIndex;
    const groupIndex = parseInt(imgIndexInAll / LIMIT_LEN, 10);
    const belongGroup = this.scrollLoadList[groupIndex];
    const newEnd =
      belongGroup.nodeList.reduce((pre, cur) => {
        const dom = document.getElementById(cur);
        return pre + dom.clientHeight + MARGIN_HEIGHT;
      }, 0) + belongGroup.top;
    if (belongGroup.end !== newEnd) {
      const distance = newEnd - belongGroup.end;
      belongGroup.end = newEnd;
      const remainingGroup = this.scrollLoadList.slice(groupIndex + 1);
      remainingGroup.forEach((group) => {
        group.top += distance;
        group.end += distance;
      });
    }
  }

  draftPartition(val) {
    this.scrollLoadList = [];
    nextTick(() => {
      val.forEach((item) => {
        let index = 0;
        while (index < item.filterFileList.length) {
          const nowGroup = this.scrollLoadList[this.scrollLoadList.length - 1];
          if (
            !this.scrollLoadList.length ||
            nowGroup.nodeList.length >= LIMIT_LEN
          ) {
            this.scrollLoadList.push({
              nodeList: [item.filterFileList[index].id],
              top: nowGroup?.end || 142,
              end:
                document.getElementById(item.filterFileList[index].id)
                  .clientHeight +
                MARGIN_HEIGHT +
                (nowGroup?.end || 142),
            });
          } else if (nowGroup.nodeList.length < LIMIT_LEN) {
            nowGroup.nodeList.push(item.filterFileList[index].id);
            nowGroup.end +=
              document.getElementById(item.filterFileList[index].id)
                .clientHeight + MARGIN_HEIGHT;
          }
          index += 1;
        }
      });
    });
  }

  scrollLoad() {
    const { scrollTop } = document.documentElement;
    const nowDisplay = this.scrollLoadList.find(
      (item) => scrollTop >= item.top && scrollTop <= item.end
    );
    if (nowDisplay) {
      this.standUpNodeList.value = [
        ...new Set([...this.standUpNodeList.value, ...nowDisplay.nodeList]),
      ];
    }
  }
}
