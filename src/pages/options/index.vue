<!--
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 22:07:36
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:07:36
-->
<template>
  <div id="options-panel" class="pixiv-options-panel">
    <div
      v-for="(item, draftIndex) in _useFileView.draftList"
      :key="item.userId"
      class="pixiv-group-card"
    >
      <div class="pixiv-group-card__user-info">
        <img :src="item.userIcon" class="pixiv-group-card__user-info__icon" />
        <div class="pixiv-group-card__user-info__name">
          {{ item.userName }}
        </div>
      </div>
      <div class="pixiv-group-card__draft-group">
        <div
          v-for="(draftCard, imgIndex) in item.filterFileList"
          :id="draftCard.id"
          :key="draftCard.id"
          class="pixiv-group-card__draft-group-item"
        >
          <div class="pixiv-group-card__draft-group-item__info">
            <div class="pixiv-group-card__draft-group-item__info-cover">
              <el-image :src="draftCard.coverImageUrl" fit="cover" />
            </div>
            <div class="pixiv-group-card__draft-group-item__info-title">
              <span class="title-name">{{ draftCard.title }}</span>
              <el-tag>¥ {{ draftCard.feeRequired }}</el-tag>
            </div>
          </div>
          <div class="pixiv-group-card__draft-group-item__list">
            <exImg
              v-for="img in draftCard.imageList"
              :key="img.fileName"
              v-model="checkList[img.thumbnailUrl]"
              :is-stand-up="
                _viewScrollLoad.standUpNodeList.value.includes(draftCard.id)
              "
              class="pixiv-group-card__draft-group-item__list-img"
              :url="img.thumbnailUrl"
              :status="draftStatusComputed(img)"
              @load="
                imgSingleLoaded($event, draftCard.id, imgIndex, draftIndex)
              "
            />
            <exMaskFrame
              v-for="file in draftCard.fileList"
              :key="file.fileUrl"
              v-model="checkList[file.fileUrl]"
              :status="draftStatusComputed(file)"
              class="pixiv-group-card__draft-group-item__list-file"
            >
              <p>{{ file.fileName }}.{{ file.extension }}</p>
            </exMaskFrame>
          </div>
        </div>
      </div>
    </div>
    <div class="pixiv-options-panel-footer">
      <el-button v-show="downLoading" type="danger" @click="handleCancel">
        <el-icon>
          <Close />
        </el-icon>
        取消下载
      </el-button>
      <el-button
        v-show="!downLoading"
        v-loading="downLoading"
        type="primary"
        :disabled="downLoading"
        @click="handleDownLoad()"
      >
        <el-icon>
          <Download />
        </el-icon>
        下载
      </el-button>
      <el-button
        v-show="downLoading"
        :type="btnStatus.type"
        @click="handlePause"
      >
        <el-icon><component :is="btnStatus.icon" /></el-icon>
        {{ btnStatus.text }}
      </el-button>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import optionsPageSender from "/@/utils/optionsPageSender";
import PathRename from "./core/pathRename";
import useDownload from "./store/useDownload";
import useFileView from "./store/useFileView";
import downloadEvent from "./eventSub/downloadEvent";
import draftListEvent from "./eventSub/pageInit";
import ViewScrollLoad from "./core/viewScrollLoad";

import exMaskFrame from "/@exCom/exMaskFrame.vue";
import exImg from "/@exCom/exImg.vue";

const checkList = ref({});
const downLoading = ref(false);
const downLoadStatus = ref("pause");
Object.entries({
  ...downloadEvent(),
  ...draftListEvent(),
}).forEach(([key, val]) => optionsPageSender.on(key, val));
const _useDownload = useDownload();
const _useFileView = useFileView();
const _viewScrollLoad = new ViewScrollLoad();

const btnStatus = computed(
  () =>
    ({
      pause: {
        type: "info",
        icon: "VideoPause",
        text: "暂停",
      },
      resume: {
        type: "success",
        icon: "Refresh",
        text: "继续",
      },
    }[downLoadStatus.value])
);

const checkListInit = (_draftList) => {
  checkList.value = {};
  _useFileView.replaceDraftList(_draftList);
  _draftList.forEach(({ filterFileList }) => {
    (filterFileList || []).forEach(({ imageList, fileList }) => {
      [...imageList].forEach(({ thumbnailUrl }) => {
        Object.assign(checkList.value, { [thumbnailUrl]: true });
      });
      [...fileList].forEach(({ fileUrl }) => {
        Object.assign(checkList.value, { [fileUrl]: true });
      });
    });
  });
};

const draftListInit = () => {
  optionsPageSender.sendRunTimeMsg({
    event: "backend_file_list_pop",
    callback: (res) => {
      const [_draftList] = res;
      checkListInit(_draftList);
    },
  });
};
draftListInit();

const handleDownLoad = () => {
  downLoading.value = true;
  _useDownload.finishList = [];
  const allFileList = [];
  const _pathRename = new PathRename();
  _useFileView.draftList.forEach((item) => {
    _pathRename.setUser(item);
    (item.filterFileList || []).forEach((draft) => {
      _pathRename.setTitle(draft);
      allFileList.push(
        ..._pathRename
          .folderRename(draft)
          .filter((file) => checkList.value[file.thumbnailUrl || file.fileUrl])
      );
    });
  });
  optionsPageSender.emit("opt_handle_download", { allFileList });
};

const handleCancel = async () => {
  await optionsPageSender.emit("opt_cancel_download");
  downLoading.value = false;
};

const handlePause = async () => {
  const event =
    downLoadStatus.value === "pause"
      ? "opt_pause_download"
      : "opt_resume_download";
  const [status] = await optionsPageSender.emit(event);
  downLoadStatus.value = status?.status || downLoadStatus.value;
};

const draftStatusComputed = (draft) => {
  const { thumbnailUrl, fileUrl } = draft;
  let status = "";
  if (_useDownload.finishList.includes(thumbnailUrl || fileUrl)) {
    status = "success";
  } else if (downLoading.value) {
    status = downLoadStatus.value === "resume" ? "pause" : "downloading";
  }
  return status;
};

const imgSingleLoaded = ($event, draftId, imgIndex, draftIndex) => {
  _viewScrollLoad.saveScrollHeight($event, draftId, imgIndex, draftIndex);
  // _viewScrollLoad.draftLoaded(draftId);
};

onMounted(() => {
  window.addEventListener("scroll", () => _viewScrollLoad.scrollLoad());
});
watch(
  () => _useDownload.finishList,
  (val) => {
    if (val.length === Object.keys(checkList.value).length) {
      downLoading.value = false;
    }
  },
  { deep: true }
);

watch(
  () => _useFileView.draftList,
  (val) => {
    checkListInit(val);
    _viewScrollLoad.draftPartition(val);
  }
);
</script>

<style lang="scss" scoped>
.pixiv-options-panel {
  .pixiv-group-card {
    margin-bottom: 50px;
    &__user-info {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 20px;
      border-bottom: 2px solid var(--border-secondary);
      background-color: var(-bg-primary);

      &__icon {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        margin-right: 10px;
        overflow: hidden;
      }
      &__name {
        font-size: 24px;
        font-weight: bolder;
      }
    }

    &__draft-group {
      padding: 20px;
      background-color: var(--bg-secondary);
      &-item {
        display: flex;
        flex-direction: column;
        border: 2px solid var(--border-secondary);
        margin-bottom: 20px;
        &__info {
          position: relative;
          display: flex;
          flex-direction: row;
          align-items: center;
          border-bottom: 2px solid var(--border-primary);
          margin-bottom: 10px;
          overflow: hidden;
          background-color: var(-bg-primary);

          &-cover {
            position: relative;
            width: 100%;
            height: 200px;
            overflow: hidden;
            .el-image {
              position: absolute;
              width: 100%;
              top: 50%;
              transform: translateY(-50%);
            }
          }

          &-title {
            position: absolute;
            bottom: 0;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
            height: 50px;
            padding: 0 20px;
            font-size: 16px;
            background: rgba(#fff, 0.6);
          }
        }
        &__list {
          display: flex;
          flex-direction: row;
          align-items: center;
          flex-wrap: wrap;
          &-img {
            width: 200px;
            min-height: 100px;
            margin: 10px;
          }
          &-file {
            padding: 20px;
            font-size: 20px;
            font-weight: 800;
          }
        }
      }
    }
  }
  &-footer {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    width: 100%;
    height: 50px;
    padding-right: 20px;
    border-top: 2px solid var(--border-secondary);
    background: var(--bg-final);
  }
}
</style>
