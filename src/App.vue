<template>
  <div id='app'>
    <n-loading-bar-provider>
      <n-message-provider>
        <n-notification-provider>
          <n-dialog-provider>
            <router-view/>
          </n-dialog-provider>
        </n-notification-provider>
      </n-message-provider>
    </n-loading-bar-provider>
  </div>
</template>
<script lang="ts" setup>
import {NMessageProvider, NLoadingBarProvider, NNotificationProvider} from 'naive-ui'
</script>
<style lang="less" scoped>
#app {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  border-radius: 5px;
}
</style>

