<template>
  <header class='header'>
    <h1>header:</h1>
    <h2 class="h2" v-for="item in menuList" :key="item.path" :style="{ 'color': item.color }"
        @click="router.push(item.path)">|{{
        item.title
      }}|</h2>
    <div class="menu">
      <div class="menu-header">
        <div class="theme-switcher">
          <input type="radio" name="themes" id="ligit-theme">
          <label for="ligit-theme">
            <span>
              <SvgIcon name="sunny-outline"></SvgIcon>
            </span>
            light
          </label>

          <input type="radio" name="themes" id="dark-theme">
          <label for="dark-theme">
            <span>
              <SvgIcon name="moon-outline"></SvgIcon>
            </span>
            Dark
          </label>

          <input type="radio" name="themes" id="black-theme">
          <label for="black-theme"> <span>
              <SvgIcon name="contrast-outline"></SvgIcon>
            </span>
            Black
          </label>
          <span class="slider"></span>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang='ts' setup>

import {onMounted, withDefaults, watch, ref} from 'vue';
import {useRouter} from 'vue-router';

const router = useRouter()

interface Props {
  menuList?: any;
}

const props = withDefaults(defineProps<Props>(), {
  menuList: [
    {
      color: ' #FFC56C',
      path: '/',
      title: '首页',
    },
    {
      color: ' #6EC5E9',
      path: '/acg',
      title: '示例',
    },
    {
      color: 'rgb(110 233 128)',
      path: '/acgaaa',
      title: '动漫电影'
    },
  ],
});
const screenWidth = ref<any>(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)

watch(() => screenWidth, (val) => {
  screenWidth.value = val

})
console.log(screenWidth.value)
onMounted(() => {
  window.onresize = () => {
    return (() => {
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    })()
  }
  let htmlEl = document.getElementsByTagName('html')
  let radios = document.getElementsByName('themes')
  radios.forEach((el) => {
    el.addEventListener('change', function () {
      console.log(htmlEl[0].classList.item(0));
      htmlEl[0].classList.remove(htmlEl[0].classList.item(htmlEl[0].classList.length - 1) as string)
      htmlEl[0].classList.add(el.id)
    })
  })
})

</script>
<script lang='ts'>
export default {name: 'baseHeader'};
</script>
<style scoped lang="less">
.header {
  display: flex;
  height: 80px;
  align-items: center;
  justify-content: center;
  position: sticky;
  background-color: var(--c-bg-body);
  top: 0;
  color: var(--c-text-secondary);
}

.h2 {
  position: relative;
  cursor: pointer;
  margin-left: 10px;
}

.h2::after {
  content: '';
  display: block;
  position: absolute;
  bottom: -5px;
  width: 0;
  height: 5px;
  background-color: rgb(10, 189, 243);
  transition: width .5s;
}

.h2:hover::after {
  width: 100%;
}

.h2:active::after {
  width: 100%;
}

.menu {
  margin-left: 30px;
  line-height: 50px;
  width: 320px;
  border-radius: 15px;
}

.menu-header {
  padding: 1rem;
}


.menu-header .theme-switcher {
  position: relative;
  background-color: var(--c-bg-secondary);
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
  width: calc((100% - 6px) / 3);
  top: 3px;
  bottom: 3px;
  transform: translateX(0);
  border-radius: 8px;
  transition: .3s ease, transform .25s ease-out;
  background: var(--c-bg-button);
}

.theme-switcher input:nth-of-type(1):checked ~ .slider {
  transform: translateX(0);
}

.theme-switcher input:nth-of-type(2):checked ~ .slider {
  transform: translateX(100%);
}

.theme-switcher input:nth-of-type(3):checked ~ .slider {
  transform: translateX(200%);
}
</style>
