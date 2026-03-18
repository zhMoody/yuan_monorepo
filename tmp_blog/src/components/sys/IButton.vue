<template>
  <div class="box" :style="{ 'width': width, 'height': height }">
    <span></span>
    <h2 :style="{ 'font-size': fontSize, 'color': color }">{{ content }}</h2>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width?: string;
  height?: string;
  content?: string
  fontSize?: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  width: '100px',
  height: '30px',
  content: '按钮',
  fontSize: '14px',
  color: 'var(--c-text-primary)'
});
</script>
<script lang="ts">
export default { name: 'IButton' };
</script>
<style scoped lang="less">
.box {
  position: relative;
  background-color: var(--c-bg-secondary);
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-right: 20px;

  &::before {
    position: absolute;
    content: '';
    background: conic-gradient(transparent, transparent, transparent, rgb(9, 224, 170));
    width: 500px;
    height: 500px;
    animation: animat 4s linear infinite;
  }

  &::after {
    position: absolute;
    content: '';
    background: conic-gradient(transparent, transparent, transparent, rgb(230, 7, 181));
    width: 500px;
    height: 500px;
    animation: animat 4s linear infinite;
    animation-delay: -2s;
  }

  span {
    position: absolute;
    inset: 2px;
    border-radius: 5px;
    background-color: var(--c-bg-primary);
    z-index: 1;
    cursor: pointer;
  }

  h2 {
    font-weight: 400;
    cursor: pointer;
    z-index: 2;
  }

  @keyframes animat {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }
}
</style>
