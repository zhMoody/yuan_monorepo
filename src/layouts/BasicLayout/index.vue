<template>
  <div class='basic-layout' @scroll="scoll">
    <div class="box-show">
      <basic-header class="header  animate__animated  animate__fadeIn"/>
      <div class="basic">
        <div v-if="!menuStore.isShowMenu.ShowMenu">
          <BasicMenu class="basic-menu animate__animated  animate__fadeIn"></BasicMenu>
        </div>
        <div class="content  animate__animated  animate__fadeIn">
          <router-view v-slot='{ Component, route }'>
            <keep-alive>
              <transition :enter-active-class='`animate__animated ${route.meta.transition}`'>
                <component :is='Component' v-if='route.meta.keepAlive'></component>
              </transition>
            </keep-alive>
            <transition :enter-active-class='`animate__animated ${route.meta.transition}`'>
              <component :is='Component' v-if='!route.meta.keepAlive'></component>
            </transition>
          </router-view>
          <basic-footer class=" animate__animated  animate__fadeIn"/>
        </div>
        <n-back-top :right="menuStore.isShowMenu.menwWidth > 750 ? 100:10" style="background: var(--c-f9f9f930)"/>
        <BasicRightNav class="basic-right-nav  animate__animated  animate__fadeIn"></BasicRightNav>
        <div class="setting">

          <n-tooltip placement="left" trigger="hover">
            <template #trigger>
              <div class="btn" @click.stop="onOpen">
                <Icon :class="showSetting?'animate':''" color="var(--c-text-666)" size="16px">
                  <SettingsOutline></SettingsOutline>
                </Icon>
              </div>
            </template>
            外观设置
          </n-tooltip>
          <div class="settingTitle">
            <span class="titleText">日/夜间模式</span>
          </div>

          <div class="settingOption">
            <span>夜间模式（固定）</span>
            <n-switch v-model:value="isDark" size="small" @click.stop="onDark">
              <template #checked-icon>
                <n-icon :component="ArrowForwardOutline"/>
              </template>
              <template #unchecked-icon>
                <n-icon :component="ArrowBackOutline"/>
              </template>
            </n-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import BasicHeader from './components/BasicHeader.vue';
// import BasicFooter from './components/BasicFooter.vue';
import {defineAsyncComponent, watchEffect, watch, ref, onMounted} from 'vue';
import {NBackTop, NTooltip, NSwitch} from 'naive-ui'
import {SettingsOutline, ArrowBackOutline, ArrowForwardOutline} from '@vicons/ionicons5'
import {Icon} from '@vicons/utils'
import {useDark, useToggle} from '@vueuse/core'
import useMenu from "@/stores/useMenu";
import {Live2d} from '@tomiaa/live2d'
import type {Live2dOptions} from "@tomiaa/live2d"

const isDark = useDark()
const toggleDark = useToggle(isDark)
const BasicHeader = defineAsyncComponent(() => import('./components/BasicHeader.vue'));
const BasicMenu = defineAsyncComponent(() => import('./components/BasicMenu.vue'));
const BasicRightNav = defineAsyncComponent(() => import('./components/basicRightNav.vue'));
const BasicFooter = defineAsyncComponent(() => import('./components/BasicFooter.vue'));
const menuStore = useMenu()
watchEffect(() => {
  if (menuStore.isShowMenu.menwWidth! >= 750) {
    menuStore.isShow(false)
  } else if (menuStore.isShowMenu.menwWidth! < 750) {
    menuStore.isShow(true)
  }
})
const scoll = () => {
  console.log(111)
}
const display = ref('none')
const grid1fr = ref('1fr')
watch(() => menuStore.isShowMenu.ShowMenu, (val) => {
  console.log(123444, val)
  if (val) {
    display.value = 'none'
    grid1fr.value = '1fr'
  } else {
    display.value = 'block'
    grid1fr.value = '260px 1fr'
  }
})
// setting
const onWidth = ref('0')
const showSetting = ref(false)
const onOpen = () => {
  showSetting.value = !showSetting.value
  if (showSetting.value) {
    onWidth.value = '220px'
  } else {
    onWidth.value = '0'
  }
}

const onDark = () => {
  isDark ? false : toggleDark()
}
const onReload = () => {

}

onMounted(() => {
  document.documentElement.addEventListener('click', () => {
    showSetting.value = false
    onWidth.value = '0'
  })
  console.log("\n %c Moody | http://36.133.74.165:9000/", "color:#fff;background: linear-gradient(to right , #7A88FF, #d26aff);padding:5px;border-radius: 10px;");
})
</script>

<style lang="less" scoped>

@keyframes rotation {
  to {
    transform: rotate(0);
  }
  from {
    transform: rotate(360deg);
  }
}

.basic-layout {
  width: 1350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background: var(--c-bg-body);


  .setting {
    position: fixed;
    top: 30%;
    right: 0;
    width: v-bind(onWidth) !important;
    height: 130px;
    background: var(--c-f9f9f930);
    transition: all .2s;
    white-space: nowrap;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 15px 25px, rgba(0, 0, 0, 0.05) 0px 5px 10px;
    border-radius: 0 0 10px 10px;

    .btn {
      content: '';
      position: absolute;
      top: 0;
      left: -40px;
      width: 40px;
      height: 40px;
      background: var(--c-bg-settingTitle);
      border-radius: 40px 0 0 40px;
      line-height: 46px;
      padding: 0 13px;
      box-shadow: rgba(191, 170, 183, 0.1) -1px 0px;
    }

    .settingTitle {
      height: 40px;
      width: 100%;
      background: var(--c-bg-settingTitle);
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .titleText, .reload {
      font-size: 12px;
      color: var(--c-text-666);
    }

    .reload {
      display: inline-block;
      padding: 2px 10px;
      background: #F05050D0;
      border-radius: 50px;
      color: #fff;
      user-select: none;
      cursor: url('@/assets/link.cur'), pointer;
      transition: all .4s;

      &:hover {
        background: #f05050;
      }
    }

    .settingOption {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: var(--c-text-666);
      padding: 20px 30px 20px 20px;
      font-size: 12px;
    }

    .animate {
      animation: rotation 1s infinite linear;
    }

  }

  :deep(.n-back-top) {
    background-color: var(--c-f9f9f930) !important;
  }

  .basic {
    display: grid;
    grid-template-columns: 260px 1fr 260px;
    transition: all .5s;
    //overflow: hidden;


    .basic-menu {
      position: sticky;
      top: 50px;
      left: 0;
      min-height: calc(100vh - 50px);
      background-color: var(--c-f9f9f930);
      //overflow: scroll;
      transition: all .5s;

      &::-webkit-scrollbar {
        width: 0px;
        background: rgb(73, 73, 73);
      }

      &::-webkit-scrollbar-thumb {
        background-color: var(--c-divider);
      }
    }

    .basic-right-nav {
      background-color: var(--c-f9f9f930);
    }
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}

.fade-enter,
.fade-leave-to

  /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}


.box-show {
  box-shadow: rgba(0, 0, 0, 0.07) 0px 1px 1px, rgba(0, 0, 0, 0.07) 0px 2px 2px, rgba(0, 0, 0, 0.07) 0px 4px 4px, rgba(0, 0, 0, 0.07) 0px 8px 8px, rgba(0, 0, 0, 0.07) 0px 16px 16px;
}

@media screen and (max-width: 1210px) {
  .basic-layout {
    width: 1000px;

  }

  .basic-layout .basic {
    grid-template-columns:260px 1fr;
  }

  .basic-layout .basic .basic-right-nav {
    width: 0;
    display: none;
  }
}

@media screen and (max-width: 1100px) {
  .basic-layout {
    width: 800px;
  }

  .basic-layout .basic {
    grid-template-columns: 220px 1fr;
  }

  .basic-layout .basic .basic-right-nav {
    width: 0;
    display: none;
  }

  .basic-layout .basic .content {
    margin: 0 auto;
  }
}

@media screen and (max-width: 750px) {

  .basic-layout {
    width: 100%;
  }

  .basic-layout .basic {
    grid-template-columns: v-bind(grid1fr);
  }

  .basic-layout .basic .basic-menu {
    display: v-bind(display);
  }

  .basic-layout .basic .content {
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
  }

}
</style>
