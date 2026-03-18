<template>
  <div class="cross">
    <div class="cross_title_box">
      <div :style="`background:url(${userStore.userInfo.onFilebg}) center center; background-size:cover`"
           class="placeOnFile-top">
        <div class="wrapper-lg bg-white-opacity">
        <span class="HeaderText"
              style="text-align:center;height:40px;font-size: 24px;color: var(--c-text-666);margin-bottom: 20px">时光机</span>
        </div>
      </div>
      <div class="cross_title_box_form">
        <n-input
          v-model:value="value"
          :autosize="{ minRows: 3}"
          placeholder="发点想说的吧！"
          type="textarea"
        />
        <NButton type="success">发布动态</NButton>
      </div>
    </div>


    <div class="contents">
      <n-timeline>
        <transition-group name="list-fade-up">
          <n-timeline-item
            v-for="(item, index) in userStore.userInfo.onfile"
            :key="item._id"
            :style="{ transitionDelay: `${index * 0.05}s` }"
            style="--n-icon-size: 40px;--n-title-margin: 0 0 15px 0;"
            type="success"
            @click="gotoDetail(item._id)"
          >
            <template #header>
              <span class="timelineHeaderText">{{ item.author }}</span>
            </template>
            <template #icon>
              <div class="img">
                <img alt="" src="https://q1.qlogo.cn/g?b=qq&nk=2693131889&s=100">
              </div>
            </template>
            <template #footer>
              <span class="timelineFooterText">{{ dayjs(item.created).format('YYYY-MM-DD hh:mm:ss') }}</span>
            </template>
            <span style="font-size: 16px;color: var(--c-text-666)">  {{ item.title }}</span>
          </n-timeline-item>
        </transition-group>
      </n-timeline>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {NTimeline, NTimelineItem, NButton, NInput} from 'naive-ui'
import useUser from "@/stores/useUser";
import dayjs from "dayjs";
import {ref} from "vue";
import {useRouter} from 'vue-router'

const router = useRouter()
const gotoDetail = (id) => {
  router.push(`/article/${id}`)
}
const userStore = useUser()
const value = ref('')

</script>

<style lang="less" scoped>
.list-fade-up-enter-active,
.list-fade-up-leave-active {
  transition: all 0.5s ease;
}

.list-fade-up-enter-from,
.list-fade-up-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.cross {
  min-height: calc(100vh - 120px);
  overflow: hidden;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
  background: var(--c-f1f3f4);

  .cross_title_box {
    background: var(--c-f9f9f930);

    .cross_title_box_form {
      padding: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 10px;
    }
  }


  .placeOnFile-top {
    height: 157px;

    .wrapper-lg {
      padding: 30px;
    }

    .bg-white-opacity {
      height: 100%;
      background-color: rgba(255, 255, 255, .5);
    }
  }

  :deep(.n-timeline .n-timeline-item) {
    min-height: 100px;

  }

  :deep(.n-timeline.n-timeline--left-placement .n-timeline-item .n-timeline-item-content ) {
    border-radius: 5px;
    background: var(--c-f9f9f930);
    padding: 10px 20px;
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 13px;
      left: -5px;
      width: 10px;
      height: 10px;
      background: var(--c-f9f9f930);
      z-index: 1;
      transform: rotate(45deg);
    }
  }

  .contents {
    padding: 33px 20px 20px 20px !important;
  }

  :deep(.n-timeline .n-timeline-item .n-timeline-item-timeline .n-timeline-item-timeline__line) {
    width: 1px;
  }

  :deep(.n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__content) {
    margin-bottom: 30px;
  }

  :deep(.n-timeline .n-timeline-item .n-timeline-item-content .n-timeline-item-content__meta) {
    margin: 0;
  }

  :deep(.n-timeline.n-timeline--left-placement .n-timeline-item .n-timeline-item-content) {
    transition: all .4s;
    cursor: url('@/assets/link.cur'), pointer;
    box-shadow: 0 1px 3px rgb(0 0 0 / 5%);
    transform: translateY(-10px);

    &:hover {
      box-shadow: 0 8px 10px rgba(96, 206, 174, 0.3)
    }

  }

  .HeaderText, .timelineHeaderText, .timelineFooterText {
    display: inline-block;
    width: 100%;
    font-size: 12px;
    color: var(--c-text-666)
  }

  .timelineHeaderText {
    border-bottom: 1px solid var(--c-divider);
  }

  .timelineFooterText {
    text-align: right;
    border-top: 1px solid var(--c-divider);
  }

  .img {
    width: 40px !important;
    height: 40px;
    overflow: hidden;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 0px 2px 8px;
    transition: all .4s;

    img {
      width: 100%;
      height: 100%;
    }

    &:hover {
      transform: rotate(360deg);
    }
  }
}

</style>
