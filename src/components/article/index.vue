<template>
  <div class="articleDetail">
    <div class="title">
      <h1 class="title-h1"> {{ articleData.detail.articleDetail?.title }}</h1>
      <div class="info">
        <!--            HappyOutline-->
        <div class="name">
          <Icon size="16">
            <PersonOutline></PersonOutline>
          </Icon>
          {{ articleData.detail.articleDetail?.author }}
        </div>
        <div class="time">
          <Icon size="16">
            <TimeOutline></TimeOutline>
          </Icon>
          {{ formatTime(articleData.detail.articleDetail?.created) }}
        </div>
        <div class="see">
          <Icon size="16">
            <EyeOutline></EyeOutline>
          </Icon>
          {{ articleData.detail.articleDetail?.browse }}次浏览
        </div>
        <div class="see">
          <Icon size="16">
            <LanguageOutline></LanguageOutline>
          </Icon>
          {{ content.length }}字
        </div>
        <div class="category">
          <Icon size="16">
            <StarOutline></StarOutline>
          </Icon>
          {{ articleData.detail.articleDetail?.category_id?.name }}
        </div>
      </div>
    </div>
    <div class="content">
      <div class="back">
        <Icon size="16">
          <HomeOutline></HomeOutline>
        </Icon>
        <n-tooltip trigger="hover">
          <template #trigger>
            <span class="goHome" @click="goToHome">  首页 </span>
          </template>
          <div style="font-size: 12px">
            返回首页
          </div>
        </n-tooltip>
        <span style="color: var(--c-text-secondary)"> / 正文</span>
      </div>
      <div class="edit">
        <h5 style="color: var(--c-text-777)">{{ articleData.detail.articleDetail?.description }}</h5>
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
import {NTooltip, NDivider} from 'naive-ui'
import {Icon} from "@vicons/utils/lib";
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
onMounted(async () => {
  const res = await getArticleDetail(route.params.id)
  content.value = res.data.articleDetail.content
  articleData.detail = res.data
  console.log('文章详情', res)
  document.documentElement.scrollTop = 0
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
    color: var(--c-text-777);
    font-family: 'rz', "yezi", serif;
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
