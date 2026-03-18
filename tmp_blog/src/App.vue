<template>
  <n-config-provider :theme="isDark ? darkTheme : null" :theme-overrides="themeOverrides">
    <div id='app'>
      <n-loading-bar-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-dialog-provider>
              <OnLoadingView></OnLoadingView>
              <router-view/>
            </n-dialog-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-loading-bar-provider>
    </div>
  </n-config-provider>
</template>
<script lang="ts" setup>
import {
  NMessageProvider,
  NLoadingBarProvider,
  NNotificationProvider,
  NConfigProvider,
  darkTheme,
  GlobalThemeOverrides
} from 'naive-ui'
import {useDark} from '@vueuse/core'
import OnLoadingView from '@/components/loading/index.vue'

const isDark = useDark()

const themeOverrides: GlobalThemeOverrides = {
}

</script>
<style lang="less" scoped>
#app {
  box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px, rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  border-radius: 5px;
}
</style>
