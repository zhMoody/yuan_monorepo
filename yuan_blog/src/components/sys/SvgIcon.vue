<template>
  <svg aria-hidden="true" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
const props = defineProps({
  // icon path name
  name: {
    type: String,
    default: '',
    required: true
  },
  prefix: {
    type: String,
    default: 'icon'
  },
  color: {
    type: String,
    default: '#373C43'
  }
})

const symbolId = computed(() => `#${props.prefix}-${props.name}`)
</script>
<script lang="ts">
export default { name: 'SvgIcon' };
</script>
<style lang="less" scoped>
.svg-icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}
</style>

