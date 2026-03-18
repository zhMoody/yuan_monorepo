<template>
  <div class="content">
    <div class="HomeTitle">
      <h1 style="color: var(--c-text-666)">{{ userStore.userInfo?.homeTitle }}</h1>
      <h3 style="color: var(--c-text-666)"> {{ userStore.userInfo?.homeIntro }}</h3>
    </div>
    <div v-show="!showPagination" class="empty">
      <NEmpty description="还没有文章，去创建属于你的第一篇文章吧！" size="large">
      </NEmpty>
    </div>
    <div class="itemContent">
      <transition-group name="list-fade-up">
        <div v-for="(item, index) in articleList.list" :key="item._id" 
             class="section"
             :style="{ transitionDelay: `${index * 0.05}s` }"
             @click="gotoDetail(item._id)">
          <div class="card">
            <div class="card-img">
              <img
                v-lazy="new RegExp(/(http|https):\/\/\S*/).test(item.cover) ? item.cover : bgImg[Math.ceil(Math.random() * 5)]"/>
            </div>
            <div class="titleInfo">
              <div class="title">{{ item.title }}</div>
              <div>
                <div class="divider">
                  <n-divider/>
                </div>
                <div class="info">
                  <!--            HappyOutline-->
                  <div class="name">
                    <n-icon size="16">
                      <PersonOutline />
                    </n-icon>
                    {{ item.author }}
                  </div>
                  <div class="time">
                    <n-icon size="16">
                      <TimeOutline />
                    </n-icon>
                    {{ dayjs(item.created).format('YYYY-MM-DD') }}
                  </div>
                  <div class="see">
                    <n-icon size="16">
                      <EyeOutline />
                    </n-icon>
                    {{ item.browse }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition-group>
      <div v-if="showPagination" class="pages">
        <n-pagination v-model:page="paging.pagenum" v-model:page-size="paging.pagesize"
                      :page-count="Math.ceil(paging.tootal / paging.pagesize)" :prev="nextPage"/>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {onMounted, reactive, ref, watch} from 'vue';
import {getArticleList} from "@/api/article";
import {bgImg} from "@/hooks/bgImport";
import usePaging from "@/stores/usePaging";
import useUser from "@/stores/useUser";
import {EyeOutline, PersonOutline, TimeOutline} from '@vicons/ionicons5';
import dayjs from 'dayjs';
import {NDivider, NEmpty, NPagination, NIcon, PaginationInfo} from 'naive-ui';
import {useRouter} from "vue-router";

type Data = {
  pagesize: number
  pagenum: number
  tootal: number
}
const userStore = useUser()
const pagingStore = usePaging()
const router = useRouter()
const articleList = reactive<{ list: Article.Result[] }>({list: []})
const paging = reactive<Data>({
  pagesize: 6,
  pagenum: 1,
  tootal: 0
})
const showPagination = ref<boolean>(false)
const nextPage = async (info: PaginationInfo) => {
  paging.pagesize = info.pageSize
  paging.pagenum = info.page
}
watch(() => paging.pagenum, () => {
  getList(paging)
})
const getList = async (data?) => {
  try {
    const res = await getArticleList(paging)
    if (res.code === 200) {
      articleList.list = Array.isArray(res.data) ? res.data : (res.data.result || [])

      paging.pagesize = +(res.data.pagesize || paging.pagesize)
      paging.pagenum = +(res.data.pagenum || paging.pagenum)
      paging.tootal = +(res.data.tootal || articleList.list.length)

      pagingStore.setTootal(paging.tootal)
      showPagination.value = articleList.list.length > 0
    }
  } catch (err) {
    console.error('获取文章列表失败:', err)
    showPagination.value = false
  }
}

const gotoDetail = (id) => {
  router.push(`/article/${id}`)
}

onMounted(async () => {
  await getList()
  userStore.getUserConfigInfo()
})
</script>

<style lang="less" scoped>
// 列表过渡动画
.list-fade-up-enter-active,
.list-fade-up-leave-active {
  transition: all 0.5s ease;
}

.list-fade-up-enter-from,
.list-fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

:deep(.n-pagination .n-pagination-item.n-pagination-item--button) {
  background: transparent;
  border: #fffccc;
}

.content {
  min-height: calc(100vh - 120px);
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);

  .HomeTitle {
    min-height: 120px;
    padding: 20px;
    text-align: center;
    background-color: var(--c-f9f9f930);
  }

  .itemContent {
    background: var(--c-f1f3f4);
    padding: 20px;

  }

  .card {
    //height: 230px;
    margin-bottom: 20px;
    display: grid;
    //grid-template-columns: 300px 1fr;
    gap: 20px;
    border-radius: 5px;
    transition: all .5s;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
    cursor: url('@/assets/link.cur'), pointer;
    background: var(--c-bg-bodyFFF);

    &:hover {
      transform: translateY(-10px);
      box-shadow: 0 8px 10px rgba(96, 206, 174, 0.3)
    }


    &:hover img {
      transform: scale(1.1);
    }

    .card-img {
      height: 250px;
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 5px 5px 0 0;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      img {
        width: 100%;
        transition: all .5s;
      }
    }


    .titleInfo {
      display: grid;
      align-content: space-between;

      .title {
        font-size: 18px;
        color: var(--c-text-666);
        text-align: left;
        padding: 15px 20px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
      }


      .description {
        padding: 10px 40px;

        span {
          text-align: left;
          font-size: 12px;
          color: var(--c-text-777);
          overflow: hidden;
          text-overflow: ellipsis;
          -webkit-line-clamp: 2;
          display: -webkit-box;
          -webkit-box-orient: vertical;
        }
      }

      .divider {
        padding: 0 10px;

        :deep(.n-divider:not(.n-divider--dashed) .n-divider__line) {
          //background: var(--c-divider);
          background: var(--c-divider);
          margin-bottom: 10px;
        }

        :deep(.n-divider:not(.n-divider--vertical)) {
          margin: 0;
        }
      }

      .info {
        display: grid;
        align-items: center;
        grid-template-columns: 1fr 1fr 1fr;
        //gap: 10px;
        padding-bottom: 10px;

        .name,
        .time,
        .see {
          padding-left: 20px;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: var(--c-text-666);
        }
      }
    }
  }


  .pages {
    display: flex;
    justify-content: center;
    align-items: flex-end;
    position: sticky;
    bottom: 0;
  }

  .empty {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 120px);
  }

  .icon {
    width: 5em;
    height: 5em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}

@media screen and (max-width: 750px) {
  .content {
    display: grid;
    gap: 10px;
    grid-template-columns: 1fr;
  }

  .content .card {
    height: 330px;
    margin-bottom: 40px;
    padding: 3px;
    display: grid;
    grid-template-columns: 1fr;
    flex-wrap: wrap;
    gap: 10px;
    border-radius: 10px;
    transition: all .5s;
    box-shadow: rgba(0, 0, 0, 0.1) 0 0 5px 0, rgba(0, 0, 0, 0.1) 0 0 1px 0;
    cursor: url('@/assets/link.cur'), pointer;

    .titleInfo {
      .title {
        padding: 0 20px;
      }
    }


    .card-img {
      overflow: hidden;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 10px;
      height: 200px;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      img {

        width: 100vmax;
        height: 100%;
        transition: all .5s;
      }
    }
  }


}
</style>
