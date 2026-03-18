<template>
  <main class="main">
    <n-result description="生活总归带点荒谬" status="404" title="404 资源不存在">
      <template #footer>
        <p class="home__description">{{ countdown }} 秒后返回首页...</p>
      </template>
    </n-result>
  </main>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {useRouter} from 'vue-router';
import {NResult} from 'naive-ui'

const router = useRouter()
const countdown = ref(3);

const countdownInterval = setInterval(() => {
  countdown.value -= 1;
  if (countdown.value === 0) {
    router.push('/');
    clearInterval(countdownInterval);
  }
}, 1000);
</script>

<style lang="less" scoped>
.main {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}


</style>
