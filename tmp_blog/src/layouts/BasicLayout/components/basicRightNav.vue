<template>
  <div class="right-nav">
    <div class="menu">
      <div class="menu-header">
        <div class="theme-switcher">
          <input id="newArticle-page" name="activePage" type="radio">
          <label for="newArticle-page" @click="getNewPage('newArticle-page')">
            <n-icon size="25">
              <HappyOutline />
            </n-icon>
          </label>
          <input id="mostViewed-page" name="activePage" type="radio">
          <label for="mostViewed-page" @click="getNewPage('mostViewed-page')">
            <n-icon size="25">
              <HeartOutline />
            </n-icon>
          </label>
          <input id="recommend-page" name="activePage" type="radio">
          <label for="recommend-page" @click="getNewPage('recommend-page')">
            <n-icon size="25">
              <GiftOutline />
            </n-icon>
          </label>
          <span class="slider"></span>
        </div>
      </div>
    </div>
    <div class="divider">
      <NDivider></NDivider>
    </div>
    <div class="recommend">
      <h5 class="rightTitle">{{ RightTitle }}</h5>
      <transition name="list-fade" mode="out-in">
        <div :key="nowPage">
          <div v-for="(item, index) in recommendList.list" :key="item._id" class="recommendItem"
               @click.stop="gotoDetail(item._id)">
            <div class="img">
              <img v-lazy="imgUrlList[index % imgUrlList.length]" alt="img">
            </div>
            <div class="rightInfoBox">
              <span>{{ item.title }}</span>
              <div class="author">
                <Icon color="var(--c-text-666)" size="12">
                  <PersonOutline></PersonOutline>
                </Icon>
                <span>{{ item.author }}</span>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="blogInfo">
      <div class="blogInfo-title">
        <h5>博客信息</h5>
        <div class="direTitle">
          <ul class="blogInfo-content">
            <li>
              <div class="blogInfo-content-left-text">
                <Icon color="var(--c-text-666)" size="12">
                  <BulbOutline></BulbOutline>
                </Icon>
                <span>文章总数</span></div>
              <span :style="{ backgroundColor: colorList[0] }" class="blogInfo-content-right-text">{{ pagingStore.fenye.tootal }}</span>
            </li>
            <li>
              <div class="blogInfo-content-left-text">
                <Icon color="var(--c-text-666)" size="12">
                  <CalculatorOutline></CalculatorOutline>
                </Icon>
                <span>内存占用</span></div>
              <span :style="{ backgroundColor: colorList[1] }" class="blogInfo-content-right-text">{{ performance.TakeUp }}</span></li>
            <li>
              <div class="blogInfo-content-left-text">
                <Icon color="var(--c-text-666)" size="12">
                  <CodeSlashOutline></CodeSlashOutline>
                </Icon>
                <span>渲染耗时</span></div>
              <span :style="{ backgroundColor: colorList[2] }" class="blogInfo-content-right-text">{{ performance.TimeOut }}</span></li>
            <li>
              <div class="blogInfo-content-left-text">
                <Icon color="var(--c-text-666)" size="12">
                  <EarthOutline></EarthOutline>
                </Icon>
                <span>响应耗时</span></div>
              <span :style="{ backgroundColor: colorList[3] }" class="blogInfo-content-right-text">{{ performance.response }}</span></li>
            <li>
              <div class="blogInfo-content-left-text">
                <Icon color="var(--c-text-666)" size="12">
                  <CalendarOutline></CalendarOutline>
                </Icon>
                <span>博客已运行</span></div>
              <span :style="{ backgroundColor: colorList[4] }" class="blogInfo-content-right-text">{{ formateDate }}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="route.params.id" class="directory">
      <h5>文章目录</h5>
      <div class="item">
        <div v-for="(item,i) in articleStore.titleList.list" :key="item.text" class="direListItem"
             @click="sectionChange(`yuan-${item.level}-${i+1}`)">
          <span> {{ item.text }}</span>
        </div>
      </div>
    </div>

  </div>
</template>
<script lang="ts" setup>
import {
  GiftOutline,
  HeartOutline,
  HappyOutline,
  BulbOutline,
  CalculatorOutline,
  CodeSlashOutline,
  EarthOutline,
  PersonOutline,
  CalendarOutline
} from '@vicons/ionicons5'
import {Icon} from "@vicons/utils";
import {NDivider, NIcon} from 'naive-ui'
import {onMounted, reactive, ref, watch, watchEffect, computed} from 'vue'
import useArticle from "@/stores/useArticle";
import {useRoute} from "vue-router";
import usePaging from "@/stores/usePaging";
import {imgUrlList} from "@/layouts/BasicLayout/components/index";
import {useRouter} from "vue-router";
import useUser from "@/stores/useUser";
import {useDark} from '@vueuse/core'

type P = {
  TakeUp: string | null,
  TimeOut: string | null,
  response: string | null,
}
const isDark = useDark()
const userStore = useUser()
const router = useRouter()
const pagingStore = usePaging()
const route = useRoute()
const articleStore = useArticle()

// 针对亮色和暗色模式提供两套不同的配色
const colorList = computed(() => {
  return isDark.value 
    ? ['#c05b5b', '#4c8da1', '#518c5d', '#a87f4a', '#6c62a3'] // 暗色模式：低饱和度莫兰迪色
    : ['#F05050', '#23B7E5', '#27C24C', '#FF9800', '#7266BA'] // 亮色模式：高亮色
})

const RightTitle = ref('热门文章')
const nowPage = ref<string>('newArticle-page')
const getNewPage = (key) => {
  nowPage.value = key
}
const recommendList = reactive<{ list: Array<Specify.NewArticleList> }>({list: []})
const performance = reactive<P>({
  TakeUp: null,
  TimeOut: null,
  response: null
})
watchEffect(() => {
  const list = articleStore.specifyList.list
  if (!list) {
    recommendList.list = []
    return
  }
  
  switch (nowPage.value) {
    case 'newArticle-page':
      recommendList.list = list.newArticleList || []
      RightTitle.value = '最新文章'
      break
    case 'mostViewed-page':
      recommendList.list = list.mostViewedList || []
      RightTitle.value = '最多浏览'
      break
    case 'recommend-page':
      recommendList.list = list.randomdList || []
      RightTitle.value = '文章推荐'
      break
  }
})

const sectionChange = (child) => {
  const scrollBox = document.documentElement; // 容器
  let distance = scrollBox.scrollTop;
  const curTag: HTMLDivElement | null = document.querySelector("#" + child); // 节点tag
  const offsetTop = curTag!.offsetTop - 20; // 滚动距离
  let step = offsetTop / 50;
  if (offsetTop > distance) {
    console.log(111)
    smoothDown();
  } else {
    const newTotal = distance - offsetTop;
    step = newTotal / 50;
    smoothUp();
  }
  scrollBox.scrollTop = offsetTop;

  function smoothDown() {
    if (distance < offsetTop) {
      distance += step;
      scrollBox.scrollTop = distance;
      setTimeout(smoothDown, 10);
    } else {
      scrollBox.scrollTop = offsetTop;
    }
  }

  function smoothUp() {
    if (distance > offsetTop) {
      distance -= step;
      scrollBox.scrollTop = distance;
      setTimeout(smoothUp, 10);
    } else {
      scrollBox.scrollTop = offsetTop;
    }
  }
}
//跳转到详情页
const gotoDetail = (id) => {
  router.push(`/article/${id}`)
}

const formateDate = computed(() => {
  function addZero(n) {
    return n >= 10 ? n : `0${n}`
  }

  let seconds = 1000
  let minutes = seconds * 60
  let hours = minutes * 60
  let days = hours * 24
  let years = days * 365
  let t1: any = new Date(userStore.userInfo?.createAt)
  let t2 = Date.now()
  let diff = t2 - t1
  let diffYears = Math.floor(diff / years)
  let diffDays = Math.floor((diff / days) - diffYears * 365)
  if (!diffYears) {
    return `${diffDays || 0}天`
  } else {
    return `${diffYears} 年 ${addZero(diffDays)} 天`
  }
})
onMounted(() => {
  articleStore.getSpecifyList()
  let _per = window.performance;
  // 内存占用
  performance.TakeUp = Math.ceil((_per.memory.totalJSHeapSize / _per.memory.jsHeapSizeLimit) * 100) + 'Mb';
  //dom渲染耗时
  performance.TimeOut = Math.ceil((_per.timing.domComplete - _per.timing.domLoading)) + 'ms'
  // 响应耗时
  performance.response = (_per.timing.responseEnd - _per.timing.responseStart) + "s";
})
</script>
<style lang="less" scoped>
.right-nav {
  position: relative;
  padding-top: 10px;

  .blogInfo {
    padding: 20px;

    h5 {
      color: var(--c-text-666);
      margin-bottom: 10px;
    }

    .blogInfo-title {
      font-size: 16px;
      color: var(--c-text-666);
      margin-bottom: 10px;
    }

    .blogInfo-content {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
      border-radius: 5px;
    }

    .blogInfo-content li {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 10px 10px 15px;
      transition: all .3s;
      color: var(--c-text-666);
      font-size: 12px;

      .blogInfo-content-left-text {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 5px;
      }

      .blogInfo-content-right-text {
        padding: 2px 10px;
        border-radius: 5px;
        color: #fff !important;
        font-weight: bold;
        transition: background-color 0.5s ease;
      }
    }
  }


  .menu {
    border-radius: 15px;
  }

  .menu-header {
    padding: 1rem;
  }


  .menu-header .theme-switcher {
    position: relative;
    border-radius: 10px;
    display: flex;
    padding: 0 3px;
  }

  .theme-switcher input {
    display: none;
  }

  .theme-switcher label {
    position: relative;
    display: flex;
    z-index: 2;
    padding: 8px 0;
    width: calc(100% / 3);
    color: var(--c-text-secondary);
    align-items: center;
    justify-content: center;

    &:hover {
      opacity: 1;
      cursor: pointer;
    }
  }

  .theme-switcher label span {
    display: flex;
    justify-content: center;
    font-weight: 600;
    opacity: 0.8;

  }

  .theme-switcher .slider {
    position: absolute;
    z-index: 1;
    width: calc((100% - 110px) / 3);
    height: 3px;
    left: 20px;
    bottom: -6px;
    transform: translateX(0);
    border-radius: 8px;
    transition: .3s ease, transform .25s ease-out;
    background: #0acf97;
  }

  .theme-switcher input:nth-of-type(1):checked ~ .slider {
    transform: translateX(0);
  }

  .theme-switcher input:nth-of-type(2):checked ~ .slider {
    transform: translateX(190%);
  }

  .theme-switcher input:nth-of-type(3):checked ~ .slider {
    transform: translateX(380%);
  }

  .divider {
    padding-bottom: 10px;

    :deep(.n-divider:not(.n-divider--dashed) .n-divider__line) {
      background: var(--c-divider);
    }

    :deep(.n-divider:not(.n-divider--vertical)) {
      margin: 0;
    }
  }

  .recommend {
    min-height: 350px;
    padding: 20px 5px;

    .list-fade-enter-active,
    .list-fade-leave-active {
      transition: opacity 0.2s ease, transform 0.2s ease;
    }

    .list-fade-enter-from {
      opacity: 0;
      transform: translateX(5px);
    }
    
    .list-fade-leave-to {
      opacity: 0;
      transform: translateX(-5px);
    }

    .rightTitle {
      padding: 0 15px;
      color: var(--c-text-666);
      margin-bottom: 10px;
      font-size: 14px;
    }

    .recommendItem {
      display: grid;
      grid-template-columns: 40px 1fr;
      gap: 20px;
      padding: 10px 15px;

      .img {
        height: 40px;
        width: 40px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;

        img {
          width: 100%;
          height: 100%;
          transition: all .5s;
        }
      }

      .rightInfoBox {
        display: grid;
        grid-template-columns: 1fr;
        color: var(--c-text-666);
        font-size: 12px;
        cursor: url('@/assets/link.cur'), pointer;

        .author {
          display: flex;
          align-items: center;
          gap: 5px;
        }
      }

      &:hover img {
        transform: rotate(360deg);
      }

      &:hover .rightInfoBox {
        color: #777777;
      }
    }
  }

  .directory {
    position: sticky;
    top: 50px;
    right: 0;
    padding: 20px;
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - 300px);
    overflow: hidden;

    h5 {
      color: var(--c-text-666);
      margin-bottom: 10px;
    }

    .direTitle {
      margin-bottom: 10px;
      font-size: 16px;
      color: var(--c-text-666);

    }

    .item {
      box-shadow: rgba(0, 0, 0, 0.1) 0px 0px 5px 0px, rgba(0, 0, 0, 0.1) 0px 0px 1px 0px;
      border-radius: 5px;
      overflow: scroll;
      background: var(--c-doclistBg);

      &::-webkit-scrollbar {
        width: 3px !important;
        height: 0;
        //background: transparent !important;
      }

      &::-webkit-scrollbar-thumb {
        background-color: transparent !important;
      }
    }

    //--c-doclistBg: #1c1c1c;
    //--c-doclistBg-item-hover: #0d0d0d;
    .direListItem {
      padding: 10px 0 10px 20px;
      transition: all .3s;
      cursor: url('@/assets/link.cur'), pointer;
      color: var(--c-text-666);
      font-size: 12px;
      //
      //a {
      //  color: var(--c-text-666);
      //}

      &:hover {
        background: var(--c-doclistBg-item-hover);
      }
    }
  }
}
</style>
