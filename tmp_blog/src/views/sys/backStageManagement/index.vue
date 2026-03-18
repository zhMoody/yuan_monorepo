<template>
  <n-layout v-if="userStore.userInfo.token" has-sider style="height: 100vh;">
    <div class="siderBox">
      <div class="siderTitle">
        <div class="title-img"><img v-lazy="userStore.userInfo.avatar" alt="img"></div>
        <span v-if="!open" class="animate__animated animate__fadeIn" style="font-size: 20px"> Yuan Blog</span>
      </div>
      <n-menu :collapsed="open" :collapsed-icon-size="20" :options="menuOptions"/>
    </div>

    <n-layout>
      <n-layout-header class="layoutHeader">
        <NIcon v-if="!open" size="26" @click="menuOpen">
          <EllipsisHorizontalCircleSharp></EllipsisHorizontalCircleSharp>
        </NIcon>
        <NIcon v-else color="#666666" size="26" @click="menuOpen">
          <EllipsisHorizontalCircleOutline></EllipsisHorizontalCircleOutline>
        </NIcon>
        <h2>
          {{ route.meta.title }}
        </h2>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;" style="height: calc(100vh - 50px);">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
<script lang='ts' setup>
import useShowLoading from "@/stores/useShowLoading";
import {nextTick, onMounted, h, ref} from "vue";
import {useRoute, RouterLink} from "vue-router";
import useUser from "@/stores/useUser";
import {useNotification, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NIcon} from "naive-ui";
import type {MenuOption} from 'naive-ui'

const notification = useNotification()
const route = useRoute()
const userStore = useUser()
const loadingStore = useShowLoading()
import {
  PricetagsOutline,
  SpeedometerOutline,
  ReaderOutline,
  PaperPlaneOutline,
  EllipsisHorizontalCircleSharp,
  EllipsisHorizontalCircleOutline,
  SettingsOutline
} from '@vicons/ionicons5'

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
}

const open = ref(false)
const siderTitleWidth = ref('260px')
const siderTitlePdding = ref('20px')
const imgSize = ref('60px')
const menuOpen = () => {
  if (open.value) {
    siderTitleWidth.value = '260px'
    siderTitlePdding.value = '25px'
    imgSize.value = '60px'
  } else {
    siderTitleWidth.value = '48px'
    siderTitlePdding.value = '5px'
    imgSize.value = '40px'
  }
  open.value = !open.value
}
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/backStageManagement',
          }
        },
        {default: () => '仪表盘'}
      ),
    key: 'backStageManagement',
    icon: renderIcon(SpeedometerOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/addArticle'
          }
        },
        {default: () => '新增文章'}
      ),
    key: 'addArticle',
    icon: renderIcon(PaperPlaneOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/articleManagement',
          }
        },
        {default: () => '文章管理'}
      ),
    key: 'articleManagement',
    icon: renderIcon(ReaderOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/categroyManagement'
          }
        },
        {default: () => '分类管理'}
      ),
    key: 'categroyManagement',
    icon: renderIcon(PricetagsOutline)
  },
  {
    label: () =>
      h(
        RouterLink,
        {
          to: {
            path: '/infoConfig'
          }
        },
        {default: () => '个人配置'}
      ),
    key: 'infoConfig',
    icon: renderIcon(SettingsOutline)
  },
]
onMounted(() => {
  if (userStore.userInfo.token) {
    setTimeout(() => {
      loadingStore.setLoading(false)
    }, 700)
  } else {
    loadingStore.setLoading(true, '请重新登录。')
  }

})

</script>

<style lang="less" scoped>
.layoutHeader {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99;
  height: 80px;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
  background: #f9f9f9;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
  align-items: center;
  color: #222;

  h2 {
    font-weight: 400;
    flex: 1;
    text-align: center;
  }
}

.siderBox {
  transition: all .3s;
  width: v-bind(siderTitleWidth);
  position: sticky;
  top: 0;
  left: 0;
  z-index: 99;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}

.siderTitle {
  height: 80px;
  width: v-bind(siderTitleWidth);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 10px;
  box-shadow: rgba(33, 35, 38, 0.1) 0px 10px 10px -10px;
  background: #f9f9f9;
  white-space: nowrap;
  padding-left: v-bind(siderTitlePdding);
  transition: all .2s;

  .title-img {
    width: v-bind(imgSize);
    height: v-bind(imgSize);
    border-radius: 50%;
    overflow: hidden;
    transition: all .3s;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
