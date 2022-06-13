<!--
 * @Descripttion: 
 * @version: 
 * @Author: 鹿角兔子
 * @Date: 2022-06-04 22:07:36
 * @LastEditors: 鹿角兔子
 * @LastEditTime: 2022-06-04 22:07:36
-->
<template>
  <div class="pixiv-options-panel">
    <div v-for="item in draftList" :key="item.userId" class="pixiv-group-card">
      <div class="pixiv-group-card__user-info">
        <img :src="item.userIcon" class="pixiv-group-card__user-info__icon" />
        <div class="pixiv-group-card__user-info__name">
          {{ item.userName }}
        </div>
      </div>
      <div class="pixiv-group-card__img-group">
        <div
          v-for="imgCard in item.filterFileList"
          :key="imgCard.id"
          class="pixiv-group-card__img-group-item"
        >
          <div class="pixiv-group-card__img-group-item__info">
            <el-image :src="url" fit="contain" />
            <div class="pixiv-group-card__img-group-item__info-cover">
              <el-image :src="imgCard.coverImageUrl" fit="cover" />
            </div>
            <!-- <div
              class="pixiv-group-card__img-group-item__info-title-circle"
            ></div> -->
            <div class="pixiv-group-card__img-group-item__info-title">
              <span class="title-name">{{ imgCard.title }}</span>
              <el-tag>赞助: {{ imgCard.feeRequired }}</el-tag>
            </div>
          </div>
          <div class="pixiv-group-card__img-group-item__list">
            <exImg
              v-for="img in imgCard.imageList"
              :key="img.fileName"
              class="pixiv-group-card__img-group-item__list-img"
              :url="img.thumbnailUrl"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import OptionsPageSender from "/@/utils/optionsPageSender";

import exImg from "/@exCom/exImg.vue";

const draftList = ref([]);

const draftListInit = () => {
  OptionsPageSender.sendRunTimeMsg({
    event: "filtetFileListPop",
    callback: (res) => {
      const [_draftList] = res;
      draftList.value.push(..._draftList);
      console.log(`optionsRec`, res);
    },
  });
};
draftListInit();
</script>

<style lang="scss" scoped>
// div {
//   color: blue;
// }

.pixiv-group-card {
  // padding: 20px;
  // border: 5px solid var(--border-primary);
  // border-radius: 5px;

  &__user-info {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 20px;
    border-bottom: 2px solid var(--border-primary);
    background-color: var(--card-header-bg);

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
    background-color: var(--card-body-bg);
    &-item {
      display: flex;
      flex-direction: column;
      border: 2px solid var(--border-secondary);
      margin-bottom: 20px;
      // align-items: center;
      // flex-wrap: wrap;
      &__info {
        position: relative;
        display: flex;
        flex-direction: row;
        align-items: center;
        border-bottom: 2px solid var(--border-primary);
        margin-bottom: 10px;
        overflow: hidden;
        background-color: var(--card-header-bg);

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

          &-circle {
            position: absolute;
            width: 300px;
            height: 300px;
            border-radius: 50%;
            overflow: hidden;
            transform: translateX(-50%);
            background: var(--bg-bg);
          }

          // .title-name {
          //   position: absolute;
          //   top: -50%;
          //   right: 50%;
          //   font-size: 16px;
          // }
        }
      }
      &__list {
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        &-img {
          max-width: 200px;
          margin: 10px;
        }
      }
    }
  }
}
</style>
