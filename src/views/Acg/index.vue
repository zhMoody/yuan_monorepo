<template>
  <!--  <div class="text">当前模拟数据量:{{ state.DataList.length }}条</div>-->
  <!--  <div class="box">-->
  <!--    <div ref="scrollBox" class="container" @scroll="doscroll">-->
  <!--      <div ref="items">-->
  <!--        <div class="item" v-for="item in virtualList" :key="item.tid">-->
  <!--          <img v-lazy="item.src" alt=""/>-->
  <!--          <span>{{ item.text }}</span>-->
  <!--        </div>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <code class="code">{{ virtualList }}</code>-->
  <!--  </div>-->
  <div class="content">
    <div class="qrcode">
      <div ref="shellContainerRef" class="qrcodeBox">
        <QrcodeVue :size="size" :value="value" background="#0acf97" level="H"/>
        <div>手机端体验</div>
      </div>
      <div>
        <NButton disabled="true" @click="handleClick">下载</NButton>
      </div>
    </div>
    <div>
      <img :src="imgUel" alt="">
    </div>
  </div>
</template>

<script lang="ts" setup>

import {arr} from './testData'
import {reactive, ref, computed, watchEffect, nextTick} from "vue";
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'
import {NButton} from 'naive-ui'

const value = ref<string>("http://36.133.74.165:9000/")
const size = ref<string>('200')
const shellContainerRef = ref<HTMLDivElement | null>()
const imgUel = ref<string>('')
const handleClick = () => {
  if (shellContainerRef.value) {
    html2canvas(shellContainerRef.value, {
      width: shellContainerRef.value.clientWidth, //dom 原始宽度
      height: shellContainerRef.value.clientHeight,
      scrollY: 0, // html2canvas默认绘制视图内的页面，需要把scrollY，scrollX设置为0
      scrollX: 0,
      useCORS: true, //支持跨域，但好像没什么用
      allowTaint: true, //允许跨域（默认false）
      scale: 1
    }).then((canvas) => {
      // 生成的ba64图片
      const base64Data = canvas.toDataURL('image/jpeg', 1)
      imgUel.value = base64Data
    })
  }
}

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

<style lang="less" scoped>
.content {
  min-height: calc(100vh - 120px);
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
  background: var(--c-f1f3f4);

  .qrcode {
    width: 300px;
    height: 470px;
    background: #0acf97;
    border-radius: 5px;
    margin: 300px auto;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    overflow: hidden;

    .qrcodeBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 300px;
      height: 400px;
      margin: 0 auto;
      background: #0acf97;
      font-size: 30px;
    }
  }
}

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
