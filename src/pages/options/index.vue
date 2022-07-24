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
      <div class="pixiv-group-card__img-group">
        <div
          v-for="(imgCard, imgIndex) in item.filterFileList"
          :id="imgCard.id"
          :key="imgCard.id"
          class="pixiv-group-card__img-group-item"
        >
          <div class="pixiv-group-card__img-group-item__info">
            <div class="pixiv-group-card__img-group-item__info-cover">
              <el-image :src="imgCard.coverImageUrl" fit="cover" />
            </div>
            <div class="pixiv-group-card__img-group-item__info-title">
              <span class="title-name">{{ imgCard.title }}</span>
              <el-tag>¥ {{ imgCard.feeRequired }}</el-tag>
            </div>
          </div>
          <div class="pixiv-group-card__img-group-item__list">
            <exImg
              v-for="img in imgCard.imageList"
              :key="img.fileName"
              v-model="checkList[img.thumbnailUrl]"
              :is-stand-up="
                _viewScrollLoad.standUpNodeList.value.includes(imgCard.id)
              "
              class="pixiv-group-card__img-group-item__list-img"
              :url="img.thumbnailUrl"
              :status="imgStatusComputed(img)"
              @load="imgSingleLoaded($event, imgCard.id, imgIndex, draftIndex)"
            />
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
import OptionsPageSender from "/@/utils/optionsPageSender";
import PathRename from "./core/pathRename";
import useDownload from "./store/useDownload";
import useFileView from "./store/useFileView";
import downloadEvent from "./eventSub/downloadEvent";
import draftListEvent from "./eventSub/pageInit";
import ViewScrollLoad from "./core/viewScrollLoad";

import exImg from "/@exCom/exImg.vue";

const checkList = ref({});
const downLoading = ref(false);
const downLoadStatus = ref("pause");
const _optPageSender = new OptionsPageSender({
  ...downloadEvent(),
  ...draftListEvent(),
});
const _useDownload = useDownload();
const _useFileView = useFileView();
const _viewScrollLoad = new ViewScrollLoad();

watch(
  () => _useFileView.draftList,
  (val) => _viewScrollLoad.draftPartition(val)
);

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

const draftListInit = () => {
  OptionsPageSender.sendRunTimeMsg({
    event: "filtetFileListPop",
    callback: (res) => {
      const [_draftList] = res;
      // draftList.value.push(..._draftList);
      _useFileView.replaceDraftList(_draftList);
      _draftList.forEach(({ filterFileList }) => {
        (filterFileList || []).forEach(({ imageList }) =>
          (imageList || []).forEach(({ thumbnailUrl }) => {
            Object.assign(checkList.value, { [thumbnailUrl]: true });
          })
        );
      });
    },
  });
};
draftListInit();

const handleDownLoad = () => {
  downLoading.value = true;
  const allFileList = [];
  const _pathRename = new PathRename();
  _useFileView.draftList.value.forEach((item) => {
    _pathRename.setUser(item);
    (item.filterFileList || []).forEach((draft) => {
      _pathRename.setTitle(draft);
      allFileList.push(
        ..._pathRename
          .folderRename(draft)
          .filter((file) => checkList.value[file.thumbnailUrl])
      );
    });
  });
  _optPageSender.connectToBackend({
    event: "send_download",
    args: {
      fileList: [...allFileList],
    },
  });
};

const handleCancel = () => {
  OptionsPageSender.sendRunTimeMsg({
    event: "cancel_download",
    callback: () => {
      downLoading.value = false;
    },
  });
};

const handlePause = () => {
  OptionsPageSender.sendRunTimeMsg({
    event:
      downLoadStatus.value === "pause" ? "pause_download" : "resume_download",
    callback: (status) => {
      downLoadStatus.value = status[0].status || downLoadStatus.value;
    },
  });
};

const imgStatusComputed = (img) => {
  const { thumbnailUrl } = img;
  let status = "";
  if (_useDownload.finishList.includes(thumbnailUrl)) {
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

    &__img-group {
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
          &-img,
          &-skeleton {
            width: 200px;
            min-height: 100px;
            margin: 10px;
          }

          &-skeleton-single {
            width: 200px;
            height: 100px;
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
