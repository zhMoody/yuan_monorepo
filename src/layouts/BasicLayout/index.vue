<template>
  <div class='basic-layout' @scroll="scoll">
    <div class="box-show">
      <basic-header class="header"/>
      <div class="basic">
        <div v-if="!menuStore.isShowMenu.ShowMenu">
          <BasicMenu class="basic-menu animate__animated  animate__fadeIn"></BasicMenu>
        </div>
        <div class="content">
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
          <basic-footer/>
        </div>
        <BasicRightNav class="basic-right-nav"></BasicRightNav>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
// import BasicHeader from './components/BasicHeader.vue';
// import BasicFooter from './components/BasicFooter.vue';
import {defineAsyncComponent, watchEffect, watch, ref} from 'vue';

const BasicHeader = defineAsyncComponent(() => import('./components/BasicHeader.vue'));
const BasicMenu = defineAsyncComponent(() => import('./components/BasicMenu.vue'));
const BasicRightNav = defineAsyncComponent(() => import('./components/basicRightNav.vue'));
const BasicFooter = defineAsyncComponent(() => import('./components/BasicFooter.vue'));
import useMenu from "@/stores/useMenu";

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
</script>

<style lang="less" scoped>
.basic-layout {
  width: 1350px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;

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
        background-color: rgba(218, 220, 222, 0.74);
      }
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
