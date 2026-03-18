<template>
  <div class="articleDetail">
    <div class="title">
      <h1 class="title-h1"> {{ articleData.detail.articleDetail?.title }}</h1>
      <div class="info">
        <!--            HappyOutline-->
        <div class="name">
          <NIcon size="16">
            <PersonOutline />
          </NIcon>
          {{ articleData.detail.articleDetail?.author }}
        </div>
        <div class="time">
          <NIcon size="16">
            <TimeOutline />
          </NIcon>
          {{ formatTime(articleData.detail.articleDetail?.created) }}
        </div>
        <div class="see">
          <NIcon size="16">
            <EyeOutline />
          </NIcon>
          {{ articleData.detail.articleDetail?.browse }}次浏览
        </div>
        <div class="see">
          <NIcon size="16">
            <LanguageOutline />
          </NIcon>
          {{ content.length }}字
        </div>
        <div class="category">
          <NIcon size="16">
            <StarOutline />
          </NIcon>
          {{ articleData.detail.articleDetail?.category_id?.name }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="back">
        <NIcon size="16">
          <HomeOutline />
        </NIcon>
        <NTooltip trigger="hover">
          <template #trigger>
            <span class="goHome" @click="goToHome">  首页 </span>
          </template>
          <div style="font-size: 12px">
            返回首页
          </div>
        </NTooltip>
        <span style="color: var(--c-text-secondary)"> / 正文</span>
      </div>
      <div class="edit">
        <h5 style="color: var(--c-text-777);font-size: 16px">{{ articleData.detail.articleDetail?.description }}</h5>
        <NDivider dashed></NDivider>
        <md-editor
          v-model="content"
          :markedHeadingId="markedHeadingId"
          :on-get-catalog="getCatalog"
          class="hText"
          prettier
          preview-only
          themes
        ></md-editor>
      </div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {computed, onMounted, reactive, ref, watch} from "vue";
import {
  PersonOutline,
  TimeOutline,
  EyeOutline,
  LanguageOutline,
  StarOutline,
  HomeOutline
} from '@vicons/ionicons5'
import {NTooltip, NDivider, NIcon} from 'naive-ui'
import {useRoute, useRouter} from "vue-router";
import {getArticleDetail} from "@/api/article";
import MdEditor from 'md-editor-v3';
import useArticle from "@/stores/useArticle";
import dayjs from "dayjs";

const articleStore = useArticle()
const route = useRoute()
const router = useRouter()
const articleData = reactive<any>({detail: {}})
const titleList = ref<string>('')
const content = ref<string>('')

const formatTime = computed((item) => () => {
  return dayjs(item).format('YYYY-MM-DD')
})
const getCatalog = (list) => {
  titleList.value = list;
};
const goToHome = () => {
  router.push('/')
}

// md配置
const list = ref([])
const markedHeadingId = (_text, _level, index) => {
  return `yuan-${_level}-${index}`
};
watch(() => titleList.value, (val) => {
  articleStore.setTitleList(val)
}, {deep: true})


const getArticleDetailList = async (id) => {
  try {
    const res = await getArticleDetail(id)
    content.value = res.data.articleDetail.content
    articleData.detail = res.data
    document.documentElement.scrollTop = 0
  } catch (err) {

  }
}
watch(() => route.params.id, async (val) => {
  if (route.params.id) {
    getArticleDetailList(val)
  }
})
onMounted(async () => {
  if (route.params.id) {
    getArticleDetailList(route.params.id)
  }
})
</script>

<style lang="less" scoped>
:deep(.n-popover) {
  background: #ffa500 !important;
}

.articleDetail {
  backdrop-filter: var(--c-base-blur);
  min-height: calc(100vh - 120px);
  background: var(--c-content-bg);
}

.title {
  min-height: 120px;
  background: var(--c-f9f9f930);
}

.content {
  padding: 20px;
  background: var(--c-f1f3f4);

  .back {
    display: flex;
    align-items: center;
    border-radius: 5px;
    background-color: var(--c-f9f9f930);
    gap: 5px;
    cursor: url('@/assets/link.cur'), pointer;
    transition: all .5s;
    margin-bottom: 20px;
    padding: 8px 15px;
    color: var(--c-text-777);
  }

  .edit {
    padding: 20px;
    border-radius: 5px;
    background-color: var(--c-f9f9f930);
    transition: all .3s;
  }

  .hText {
    background: transparent;
    box-sizing: border-box;
    border-radius: 10px;
    color: #fff !important;

    :deep(.default-theme a) {
      color: var(--c-text-666);
    }

    :deep(.default-theme) {
      color: var(--c-text-666);
    }

    :deep(.default-theme table tbody tr:nth-child(2n)) {
      background: var(--c-doclistBg);
    }

    :deep(.default-theme table tbody tr):hover {
      background: var(--c-divider);
    }

    :deep(.default-theme table tr td:nth-child(1)) {
      min-width: 150px;
    }
  }

  &:hover .edit {
    box-shadow: #3BD1E511 0px 1px 1px, #3BD1E511 0px 2px 2px, #3BD1E511 0px 4px 4px, #3BD1E511 0px 8px 8px, #3BD1E511 0px 16px 16px;
  }
}

:deep(.default-theme blockquote) {
  background: var(--c-blockquote);
}

:deep(pre) {
  white-space: break-spaces;
  overflow: scroll;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: rgb(73, 73, 73);
  }

  &::-webkit-scrollbar-thumb {
    background-color: transparent;
  }
}

.title {
  padding: 20px;
  color: var(--c-text-666);
}

.title-h1 {
  text-align: center;
  margin-bottom: 20px;
  color: var(--c-text-666);
}

.info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;

  .name, .time, .see, .category {
    padding-left: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: var(--c-text-666);
  }

  .name {
    cursor: url('@/assets/link.cur'), pointer;
  }

  .category {
    cursor: url('@/assets/link.cur'), pointer;
  }
}

@media screen and (max-width: 750px) {
  :deep(pre) {
    white-space: pre;
    overflow: scroll;

    &::-webkit-scrollbar {
      width: 3px;
      background: rgb(73, 73, 73);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(218, 220, 222, 0.74);
    }
  }
}
</style>
