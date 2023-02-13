<template>
  <div class="text">当前模拟数据量:{{ state.DataList.length }}条</div>
  <div class="box">
    <div ref="scrollBox" class="container" @scroll="doscroll">
      <div ref="items">
        <div class="item" v-for="item in virtualList" :key="item.tid">
          <img v-lazy="item.src" alt=""/>
          <span>{{ item.text }}</span>
        </div>
      </div>
    </div>
    <code class="code">{{ virtualList }}</code>
  </div>
</template>

<script lang="ts" setup>
import {arr} from './testData'
import {reactive, ref, computed, watchEffect, nextTick} from "vue";

const scrollBox = ref<null | HTMLDivElement>(null);
const items = ref<null | HTMLDivElement>(null);

const state = reactive({
  DataList: arr,
  ItemBoxHeight: 0,
  itemNum: 1,
  startIndex: 0,
});

const virtualList = computed(() => {
  let endIndex = state.startIndex + state.itemNum;
  if (endIndex >= state.DataList.length) endIndex = state.DataList.length;
  return state.DataList.slice(state.startIndex, endIndex);
});

const doscroll = () => {
  const curScrollTop = scrollBox.value!.scrollTop;
  if (curScrollTop > state.ItemBoxHeight) {
    const index = ~~(scrollBox.value!.scrollTop / state.ItemBoxHeight);
    items.value!.style.setProperty(
      "padding-top",
      `${index * state.ItemBoxHeight}px`
    );
    state.startIndex = index;
  } else {
    items.value!.style.setProperty("padding-top", "0px");
    state.startIndex = 0;
  }
};

watchEffect(() => {
  if (state.DataList.length > 0) {
    nextTick(() => {
      // 计算每行高度
      // @ts-ignore
      state.ItemBoxHeight = items.value!.children[0].offsetHeight;
      //计算屏幕内能显示的行数   +5是防止下拉过快出现白屏
      state.itemNum = ~~(scrollBox.value!.clientHeight / state.ItemBoxHeight) + 5;
      // 设置列表总高度
      const ListHeight = state.ItemBoxHeight * state.DataList.length;
      items.value!.style.setProperty("height", `${ListHeight}px`);
    });
  }
});
</script>

<style scoped lang="less">
.text {
  width: 500px;
  font-size: 36px;
  margin: 0 auto;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;

  .code {
    margin-left: 10px;
    padding: 10px 10px;
    border: 1px dotted #000;
    border-radius: 10px;
    background-color: #f1f1f1;
    width: 400px;
    font-size: 16px;
  }
}

.container {
  height: 250px;
  overflow-y: scroll;
  width: 250px;
}

.container::-webkit-scrollbar {
  width: 3px;
  background: rgb(73, 73, 73);
}

.container::-webkit-scrollbar-thumb {
  background-color: rgba(218, 220, 222, 0.74);
}

.container .item {
  height: 30px;
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  
}

.container .item img {
  width: 30px;
  height: 30px;
}
</style>
