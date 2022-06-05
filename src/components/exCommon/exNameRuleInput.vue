<template>
  <div class="ex-name-rule-input">
    <!-- <el-breadcrumb class="ex-name-rule-input__path" separator="/"> -->
    <div class="ex-name-rule-input__path">
      <div
        v-for="(item, index) in folderPath"
        :key="`${item}_${index}`"
        class="path-folder"
        @click="editFolderPath(index, item)"
        :class="[
          `path-folder-${index % 7}`,
          activeIndex >= 0 ? activeIndex !== index ? 'inactive' : 'active' : '',
        ]"
      >
        {{ item }}
      </div>
    </div>
    <!-- <el-breadcrumb-item class="ex-name-rule-input__path-file"
        >file Name</el-breadcrumb-item
      > -->
    <!-- </el-breadcrumb> -->
    <div v-show="activeIndex >= 0" class="ex-name-rule-input__btns">
      <exFolderNameDrop v-model="activePath" />
      <el-button @click="assignFolderPath">修改</el-button>
      <el-button @click="insertFolderPath(true)">向左插入</el-button>
      <el-button @click="insertFolderPath(false)">向右插入</el-button>
      <el-button type="danger" plain @click="removeFolderPath">删除</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import exFolderNameDrop from "./exFolderNameDrop.vue";
const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      folderPath: [
        "{user}{title}",
        "{user}{title}",
        "{user}{title}",
        "{user}{title}",
        "{user}{title}",
      ],
      fileName: "",
    }),
  },
});
const activePath = ref("");
const activeIndex = ref(-1);
const folderPath = ref([...props.modelValue.folderPath]);
const fileName = ref(props.modelValue.fileName);

watch(
  () => props.modelValue,
  (val) => {
    folderPath = val.folderPath;
    fileName = val.fileName;
  }
);
function editFolderPath(index, path) {
  activePath.value = path;
  activeIndex.value = index;
}
function assignFolderPath() {
  folderPath.value[activeIndex.value] = activePath.value;
  activeIndex.value = -1;
}
function removeFolderPath() {
  if (folderPath.value.length >= 1) {
    folderPath.value.splice(activePath.value, 1);
    activeIndex.value = -1;
  }
}
function insertFolderPath(isLeft) {
  const index = activeIndex.value;
  folderPath.value.splice(isLeft ? index : index + 1, 0, activePath.value);
  activeIndex.value = -1;
}
</script>

<style lang="scss" scoped>
.ex-name-rule-input {
  padding: 10px;
  &__path {
    display: flex;
    flex-wrap: wrap;
  }
  &__path-file {
    height: 24px;
  }

  &__btns {
    .ex-folder-name-drop {
      margin-bottom: 8px;
    }
  }
  .path-folder {
    position: relative;
    padding: 4px 8px;
    color: var(--text-btn);
    cursor: pointer;
    transition: .3s;
    &:hover {
      background-color: var(--primary-color);
    }
    // &::after {
    //   content: ' ';
    //   position: absolute;
    //   top: 50%;
    //   right: 0;
    //   z-index: 2;
    //   width: 2px;
    //   height: 20px;
    //   transform: rotate(15deg) translateY(-50%);
    //   background-color: var(--bg-primary);
    // }
    &:first-child {
      border-radius: 3px 0 0 3px;
    }
    &:last-child {
      border-radius: 0 3px 3px 0;
      // &::after {
      //   content: ' ';
      //   display: none;
      // }
    }
    &.inactive {
      background-color: var(--primary-color-4);
    }

    &.active {
      background-color: var(--primary-color);
    }
  }
  @for $i from 0 to 7 {
    .path-folder-#{$i} {
      background: rgba(40, 116, 230, calc(1 - #{$i/10}));
    }
  }
}
</style>