<template>
  <div class="monitor">
    <div class="box">
      <div style="color: var(--c-text-666);text-align: center;font-size: 30px">文章</div>
      <div class="countBox">
        <n-statistic label="你一共发布了" tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="articleTotal"/>
          <template #suffix>
            篇文章
          </template>
        </n-statistic>
      </div>
    </div>
    <div class="box">
      <div style="color: var(--c-text-666);text-align: center;font-size: 30px">分类</div>
      <div class="countBox">
        <n-statistic label="你一共创建了" tabular-nums>
          <n-number-animation ref="numberAnimationInstRef" :from="0" :to="categoryTotal"/>
          <template #suffix>
            个分类
          </template>
        </n-statistic>
      </div>
    </div>
  </div>

  <div class="sysInfo">
    <div class="title">系统信息</div>
    <div class="infoList">
      <div class="infoItem"><span>操作系统</span><span>{{ sysInfo.platform }}</span></div>
      <div class="infoItem"><span>CPU 架构</span><span>{{ sysInfo.arch }}</span></div>
      <div class="infoItem"><span>CPU 核心数</span><span>{{ sysInfo.cpuCount }}</span></div>
      <div class="infoItem"><span>内存总量</span><span>{{ sysInfo.memory?.total }}</span></div>
      <div class="infoItem"><span>空闲内存</span><span>{{ sysInfo.memory?.free }}</span></div>
      <div class="infoItem"><span>内存使用率</span><span>{{ sysInfo.memory?.usage }}</span></div>
      <div class="infoItem">
        <span>运行时间</span>
        <span>{{ sysInfo.uptime?.days }}天{{ sysInfo.uptime?.hours }}小时{{ sysInfo.uptime?.minutes }}分</span>
      </div>
      <div class="infoItem"><span>Node 版本</span><span>{{ sysInfo.nodeVersion }}</span></div>
    </div>
  </div>
</template>
<script lang='ts' setup>
import {NStatistic, NNumberAnimation} from 'naive-ui'
import {onMounted, ref} from "vue";
import {getMonitorData, getSysInfo} from "@/api";

const articleTotal = ref<number>(0)
const categoryTotal = ref<number>(0)
const sysInfo = ref<any>({})

onMounted(async () => {
  const [monitorRes, sysRes] = await Promise.all([getMonitorData(), getSysInfo()])
  articleTotal.value = monitorRes.data.articleCount
  categoryTotal.value = monitorRes.data.categoryCount
  sysInfo.value = sysRes.data

  console.log(monitorRes, sysRes)
})
</script>

<style lang="less" scoped>
.monitor {
  display: flex;
  gap: 10px;

  .box {
    width: 252px;
    height: 136px;
    background: var(--c-f9f9f930);

    .countBox {
      display: flex;
      justify-content: center;
      align-items: center;
      text-align: center;
    }
  }
}

.sysInfo {
  margin-top: 20px;
  padding: 20px;
  background: var(--c-f9f9f930);
  border-radius: 8px;

  .title {
    font-size: 20px;
    margin-bottom: 15px;
    color: var(--c-text-333);
  }

  .infoList {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;

    .infoItem {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 12px;
      background: var(--c-f9f9f930);
      border-radius: 4px;
      border-bottom: none;

      span:first-child {
        color: var(--c-text-666);
        font-size: 13px;
      }

      span:last-child {
        font-weight: bold;
        font-size: 16px;
        color: var(--c-text-333);
      }
    }
  }
}
</style>
