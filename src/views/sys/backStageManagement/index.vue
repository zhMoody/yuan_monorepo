<template>
  <n-layout v-if="userStore.userInfo.token" has-sider style="height: 100vh;background: #ffa500;">
    <n-layout-sider content-style="padding: 24px;box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;">
      Blog后台管理
      {{ userStore.userInfo.nickname }}
      <n-menu :options="menuOptions"/>
    </n-layout-sider>
    <n-layout style="">
      <n-layout-header style="height: 50px;">
        <div style="height:49px;box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;">
          title
        </div>
      </n-layout-header>
      <n-layout-content content-style="padding: 24px;" style="height: calc(100vh - 50px);">
        <router-view></router-view>
      </n-layout-content>
    </n-layout>
  </n-layout>
  <!--  <div class="backStageManagement">-->
  <!--    后台管理页面-->
  <!--    {{ userStore.userInfo.token }}-->
  <!--    {{ route.query.id }}-->
  <!--  </div>-->
</template>
<script lang='ts' setup>
import useShowLoading from "@/stores/useShowLoading";
import {nextTick, onMounted, h} from "vue";
import {useRoute, RouterLink} from "vue-router";
import useUser from "@/stores/useUser";
import {useNotification, NLayout, NLayoutSider, NLayoutHeader, NLayoutContent, NMenu, NIcon} from "naive-ui";
import type {MenuOption} from 'naive-ui'
import {
  LaptopOutline as WorkIcon,
  LogOutOutline as HomeIcon
} from '@vicons/ionicons5'

const notification = useNotification()
const route = useRoute()
const userStore = useUser()
const loadingStore = useShowLoading()

function renderIcon(icon: Component) {
  return () => h(NIcon, null, {default: () => h(icon)})
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
        {default: () => '全览'}
      ),
    key: 'backStageManagement',
    icon: renderIcon(HomeIcon)
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
    icon: renderIcon(HomeIcon)
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
        {default: () => '新增/编辑文章'}
      ),
    key: 'addArticle',
    icon: renderIcon(WorkIcon)
  }
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

<style scoped>

</style>
