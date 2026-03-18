<template>
  <div class="content">
    <!-- 将注释移入根节点内部 -->
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
    
    <div class="qrcode-wrapper">
      <div class="qrcode">
        <div ref="shellContainerRef" class="qrcodeBox">
          <QrcodeVue :size="size" :value="value" background="#0acf97" level="H"/>
          <div>手机端体验</div>
        </div>
        <div>
          <NButton :disabled="true" @click="handleClick">下载</NButton>
        </div>
      </div>
    </div>
    <div v-if="imgUel" class="preview">
      <img :src="imgUel" alt="">
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref, computed, watchEffect, nextTick} from "vue";
import html2canvas from 'html2canvas'
import QrcodeVue from 'qrcode.vue'
import {NButton, useMessage} from 'naive-ui'

const message = useMessage()
const value = ref<string>("http://36.133.74.165:9000/")
const size = ref<number>(200)
const shellContainerRef = ref<HTMLDivElement | null>()
const imgUel = ref<string>('')

const handleClick = () => {
  if (shellContainerRef.value) {
    html2canvas(shellContainerRef.value, {
      width: shellContainerRef.value.clientWidth,
      height: shellContainerRef.value.clientHeight,
      scrollY: 0,
      scrollX: 0,
      useCORS: true,
      allowTaint: true,
      scale: 1
    }).then((canvas) => {
      const base64Data = canvas.toDataURL('image/jpeg', 1)
      imgUel.value = base64Data
    })
  }
}
</script>

<style lang="less" scoped>
.content {
  min-height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  background: var(--c-f1f3f4);

  .qrcode-wrapper {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .qrcode {
    width: 300px;
    height: 470px;
    background: #0acf97;
    border-radius: 5px;
    display: flex;
    gap: 20px;
    flex-direction: column;
    align-items: center;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);

    .qrcodeBox {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
      width: 300px;
      height: 400px;
      background: #0acf97;
      font-size: 30px;
      color: #fff;
    }
  }

  .preview {
    margin-top: 20px;
    img {
      max-width: 100%;
      border-radius: 5px;
    }
  }
}
</style>