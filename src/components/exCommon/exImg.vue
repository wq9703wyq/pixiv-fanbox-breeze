<template>
  <div class="ex-img">
    <el-image :src="url" fit="contain" />
  </div>
</template>

<script setup>
// import { ref, watch, computed } from "vue";

defineProps({
  url: String,
});
</script>

<!-- <style lang="scss" scoped>
.ex-img {
}
</style> -->
