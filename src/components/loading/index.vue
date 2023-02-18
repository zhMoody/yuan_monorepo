<template>
  <div class="loading">
    <div class="left"></div>
    <div class="right"></div>
    <div v-show="loadingStore.onLoading" class="loadingText">{{ loadingStore.loadingText }}</div>
    <div v-show="loadingStore.onLoading" class="second-wrapper">
      <div class="circle-loader">
        <div class="circle circle_four"></div>
        <div class="circle circle_three"></div>
        <div class="circle circle_two"></div>
        <div class="circle circle_one"></div>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import useShowLoading from "@/stores/useShowLoading";
import {watch, ref} from "vue";

const loadingStore = useShowLoading()
const onWidth = ref('50%')
const zIdx = ref(999)
watch(() => loadingStore.onLoading, (val) => {
  console.log('val变化了', val)
  if (val) {
    onWidth.value = '50%'
    zIdx.value = 999
  } else {
    onWidth.value = '0'
    setTimeout(() => {
      zIdx.value = -1
    }, 800)
  }
})
</script>

<style lang="less" scoped>
.left, .right {
  position: absolute;
  top: 0;
  width: v-bind(onWidth);
  height: 100vh;
  transition: all .8s;
}

.left {
  left: 0;
  background: #34d9da;
}

.right {
  right: 0;
  background: #34d9da;
  //border: 1px solid;
}

.loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: v-bind(zIdx);
  display: flex;
  justify-content: center;
  align-items: center;

  .loadingText {
    position: absolute;
    top: 50%;
    left: 50%;
    white-space: nowrap;
    transform: translate(-50%, -50%);
    font-size: 20px;
    color: var(--c-text-666);
  }
}

.second-wrapper {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

//.circle-loader {
//  //position: relative;
//}

.circle {
  border-radius: 50% 50% 50% 50%;
  position: absolute;
  border-top: 2px solid #fff;
  border-bottom: 2px solid transparent;
  border-left: 2px solid #fff;
  border-right: 2px solid transparent;
  animation: animate 2s infinite;
}

.circle_one {
  left: -30px;
  top: -30px;
  width: 50px;
  height: 50px;
}

.circle_two {
  left: -40px;
  top: -40px;
  width: 70px;
  height: 70px;
  animation-delay: 0.2s;
}

.circle_three {
  left: -50px;
  top: -50px;
  width: 90px;
  height: 90px;
  animation-delay: 0.4s;
}

.circle_four {
  left: -60px;
  top: -60px;
  width: 110px;
  height: 110px;
  animation-delay: 0.6s;
}

@keyframes animate {
  50% {
    transform: rotate(360deg) scale(0.8);
  }
}

</style>
