<template>
  <footer>
    <div class="github-badge" style="cursor: pointer; margin-left:20px ;">
      <a href="/" target="_blank">
        <span class="badge-subject">Powered by</span><span
        class="badge-value bg-blue">{{ userStore.userInfo.leftFooter }}</span>
      </a>
    </div>
    &nbsp;|&nbsp;
    <div class="github-badge" style="cursor: pointer;">
      <a href="/" target="_blank">
        <span class="badge-subject">Theme by</span><span
        class="badge-value bg-green">{{ userStore.userInfo.rightFooter }}</span>
      </a>
    </div>
  </footer>
</template>
<script lang="ts" setup>
import useUser from "@/stores/useUser";

const userStore = useUser()
</script>
<script lang="ts">
export default {
  name: 'BaseFooter',
};
</script>
<style lang="less" scoped>
footer {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  background: var(--c-f9f9f930) !important;
}

/*底部页脚*/

.github-badge {
  display: inline-block;
  border-radius: 4px;
  text-shadow: none;
  font-size: 12px;
  color: #fff;
  line-height: 15px;
  background-color: #abbac3;
}

.github-badge .badge-subject {
  display: inline-block;
  background-color: #4d4d4d;
  padding: 4px 4px 4px 6px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px
}

a {
  white-space: nowrap;
  color: var(--c-text-666);
}

.github-badge .badge-value {
  display: inline-block;
  padding: 4px 6px 4px 4px;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px
}

.github-badge .bg-blue {
  background-color: #007ec6
}

.github-badge .bg-orange {
  background-color: #ffa500
}

.github-badge .bg-red {
  background-color: #f00
}

.github-badge .bg-green {
  background-color: #3bca6e
}

.github-badge .bg-purple {
  background-color: #ab34e9
}
</style>
