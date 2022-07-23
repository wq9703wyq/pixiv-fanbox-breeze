<template>
  <div class="ex-date-pick-view">
    <div class="ex-date-pick-view__head">
      <div v-if="rangeBelong" class="ex-date-pick-view__head-preview">
        <el-button
          type="text"
          :icon="DArrowLeft"
          @click="moveBeforeDate('year')"
        ></el-button>
        <el-button
          type="text"
          :icon="ArrowLeft"
          @click="moveBeforeDate('month')"
        ></el-button>
      </div>
      <div class="ex-date-pick-view__head-cur-time">
        <div class="ex-date-pick-view__head-cur-time-year">
          {{ curYear }}
        </div>
        <div class="ex-date-pick-view__head-cur-time-month">
          {{ curMonth }}
        </div>
      </div>
      <div v-if="!rangeBelong" class="ex-date-pick-view__head-next">
        <el-button
          type="text"
          :icon="ArrowRight"
          @click="moveAfterDate('month')"
        ></el-button>
        <el-button
          type="text"
          :icon="DArrowRight"
          @click="moveAfterDate('year')"
        ></el-button>
      </div>
    </div>
    <div class="ex-date-pick-view-content">
      <div class="ex-date-view__week">
        <div
          v-for="day in weekDays"
          :key="day"
          class="ex-date-view__week-single"
        >
          {{ day }}
        </div>
      </div>
      <div class="ex-date-view-day">
        <div
          v-for="(empty, index) in emptyDay"
          :key="`empty${index}`"
          class="ex-date-view-day__empty"
        ></div>
        <div
          v-for="(date, index) in daysInCurMonthArr"
          :key="date"
          class="ex-date-view-day__single"
          :class="{
            'is-range': daysInRange.includes(date),
            'is-start': daysInRange[0] === date,
            'is-end': daysInRange[daysInRange.length - 1] === date,
          }"
          @click="choiceActiveDate(date)"
          @mouseenter="preSetEnd(date)"
        >
          <div
            :class="{ 'is-active': activeDays.includes(date) }"
            class="ex-date-view-day__single-circle"
          >
            {{ index + 1 }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import dayjs from "dayjs";
import {
  ArrowLeft,
  DArrowLeft,
  ArrowRight,
  DArrowRight,
} from "@element-plus/icons-vue";

const $props = defineProps({
  modelValue: {
    type: [String, Array],
    default: "",
  },
  rangeBelong: {
    type: Boolean,
    default: true,
  },
});
const $emits = defineEmits(["update:modelValue", "change", "panelChange"]);
const curYear = ref("");
const curMonth = ref("");
const daysInCurMonthArr = ref([]);
const activeDays = ref([]);
const preEnd = ref();
const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const emptyDay = ref([]);

const daysInRange = computed(() => {
  if (activeDays.value.length <= 1 && !preEnd.value) {
    return [];
  }
  let [day1, day2] = activeDays.value;
  day1 = dayjs(day1);
  day2 = dayjs(preEnd.value || day2);
  const start = day1 > day2 ? day2 : day1;
  const end = day1 > day2 ? day1 : day2;
  return daysInCurMonthArr.value.filter(
    (date) => dayjs(date) >= start && dayjs(date) <= end
  );
});

const preSetEnd = (date) => {
  if (activeDays.value.length && activeDays.value.length < 2) {
    preEnd.value = date;
  }
};

const choiceActiveDate = (date) => {
  preEnd.value = undefined;
  const [pre, aft] = activeDays.value;
  if (pre && !aft) {
    activeDays.value = [pre, date];
  } else if (!pre && aft) {
    activeDays.value = [date, pre];
  } else {
    activeDays.value = [date];
  }
  $emits("update:modelValue", activeDays.value);
  $emits("change", date);
};

const dateInit = () => {
  let modelDate = null;
  if ($props.modelValue) {
    if (!Array.isArray($props.modelValue)) {
      modelDate = dayjs($props.modelValue || "");
      activeDays.value.push($props.modelValue);
    } else if ($props.modelValue.every((date) => !date)) {
      modelDate = $props.rangeBelong ? dayjs() : dayjs().add(1, "month");
    } else {
      const [pre, aft] = $props.modelValue;
      if ($props.rangeBelong) {
        modelDate = !pre && aft ? dayjs(aft).subtract(1, "month") : dayjs(pre);
      } else {
        modelDate = !aft && pre ? dayjs(pre).add(1, "month") : dayjs(aft);
      }
      activeDays.value = [pre || "", aft || ""];
    }
  } else {
    modelDate = $props.rangeBelong ? dayjs() : dayjs().add(1, "month");
  }
  curYear.value = modelDate.year();
  curMonth.value = modelDate.format("MM");
};

watch(
  () => $props.modelValue,
  () => dateInit()
);

const monthDayInit = () => {
  daysInCurMonthArr.value = [];
  let daysInCurMonth = dayjs(
    `${curYear.value}-${curMonth.value}`
  ).daysInMonth();
  while (daysInCurMonth) {
    daysInCurMonthArr.value.unshift(
      `${curYear.value}-${curMonth.value}-${
        daysInCurMonth < 10 ? "0" : ""
      }${daysInCurMonth}`
    );
    daysInCurMonth -= 1;
  }
  const day = dayjs(daysInCurMonthArr.value[0]).day();
  emptyDay.value = new Array(day).fill(0);
};

const moveAfterDate = (type) => {
  const before = type === "year" ? curYear.value : curMonth.value;
  if (type === "year") {
    curYear.value = dayjs(`${curYear.value}`).add(1, "year").year();
  } else if (type === "month") {
    curMonth.value = dayjs(`${curYear.value}-${curMonth.value}`)
      .add(1, "month")
      .format("MM");
  }
  $emits("panelChange", {
    before,
    dateType: type,
    changeType: "moveAfter",
    after: type === "year" ? curYear.value : curMonth.value,
  });
  monthDayInit();
};

const moveBeforeDate = (type) => {
  const before = type === "year" ? curYear.value : curMonth.value;
  if (type === "year") {
    curYear.value = dayjs(`${curYear.value}`).subtract(1, "year").year();
  } else if (type === "month") {
    curMonth.value = dayjs(`${curYear.value}-${curMonth.value}`)
      .subtract(1, "month")
      .format("MM");
  }
  $emits("panelChange", {
    before,
    dateType: type,
    changeType: "moveBefore",
    after: type === "year" ? curYear.value : curMonth.value,
  });
  monthDayInit();
};

dateInit();
monthDayInit();
</script>

<style lang="scss" scoped>
.ex-date-pick-view {
  width: 308px;
  &__head {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 5px;
    &-cur-time {
      display: flex;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-titles);
      &-year {
        &::after {
          content: "-";
          margin: 0 5px;
        }
      }
    }
    &-preview {
      position: absolute;
      left: 0;
    }

    &-next {
      position: absolute;
      right: 0;
    }
  }
  &-content {
    width: 308px;

    .ex-date-view__week {
      display: flex;
      flex-wrap: wrap;
      padding-bottom: 5px;
      border-bottom: 1px solid var(--border-primary);

      &-single {
        width: 24px;
        height: 24px;
        padding: 0 10px;
        text-align: center;
      }
    }
    .ex-date-view-day {
      display: flex;
      flex-wrap: wrap;

      &__empty {
        width: 24px;
        height: 24px;
        padding: 0 10px;
        margin: 5px 0;
      }
      &__single {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        margin: 5px 0;
        &-circle {
          width: 24px;
          height: 24px;
          line-height: 24px;
          text-align: center;
          cursor: pointer;

          &:hover {
            color: var(--button-default-color);
          }

          &.is-active {
            color: var(--button-default-text-hover-color);
            background-color: var(--button-default-color);
            border-radius: 50%;
          }
        }
        &.is-range {
          background-color: var(--primary-color-1);

          &.is-start {
            padding-left: 0;
            margin-left: 10px;
            border-top-left-radius: 15px;
            border-bottom-left-radius: 15px;
          }

          &.is-end {
            padding-right: 0;
            margin-right: 10px;
            border-top-right-radius: 15px;
            border-bottom-right-radius: 15px;
          }
        }
      }
    }
  }
}
</style>
