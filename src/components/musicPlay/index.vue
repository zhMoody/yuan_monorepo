<template>
  <div class="music">
    <div class="player">
      <div class="cover">
        <n-avatar
          :size="40"
          :src="options.musicImg"
          bordered
          round
        />
      </div>
      <div class="switch">
        <div class="songName">{{ options.musicTitle || '没有可播放的歌曲' }}</div>
        <div class="songOption">
          <div class="songOption-icon">
           <span @click="musicPlay('pre')">
              <SvgIcon color="#666" name="rewind"></SvgIcon>
           </span>
            <span @click="musicPlay('play')">
              <SvgIcon :name=" options.play ? 'pause' : 'play'" color="#666"></SvgIcon>
            </span>

            <span @click="musicPlay('next')">
              <SvgIcon color="#666" name="fast-forward"></SvgIcon>
            </span>
            <span>{{ options.currentTime || '00:00' }}</span>
          </div>
          <div class="Progress">
            <div :style="{width: options.currentProgressTime + '%'}" class="onProgress">
              <span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="music-option">
      <div class="btn" @click.self="showBox">
        <Icon color="#666" size="24" @click="showBox">
          <BowlingBallOutline tag="span"></BowlingBallOutline>
        </Icon>
      </div>
      <div class="music-posa wow animate__animated animate__fadeIn">
        <div class="text">当前歌单歌曲数量: {{ state.DataList.length }}</div>
        <div class="box">
          <div ref="scrollBox" class="container" @scroll="doscroll">
            <div ref="items">
              <div v-for="item in virtualList" :key="item" ref="item" :style="{
                color:options.index + 1 === item.id ? 'var(--c-7F780AFF)' : 'var(--c-text-666);',
                background:options.index + 1 === item.id ? 'var(--c-907e7e30)' : 'var(--c-bg-body)',
                   }" class="item"
                   @click="handlerPlay(item.id)">
                <span>
                  {{ item.id }}  {{ item.name }}
                </span>
                <span>
                  {{ item.artist }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <audio ref="singeBox"></audio>
</template>
<script lang='ts' setup>
import {
  BowlingBallOutline,
} from '@vicons/ionicons5'
import {Icon} from '@vicons/utils'
import {NAvatar} from 'naive-ui'
import {reactive, onMounted, ref, withDefaults, watchEffect, computed, nextTick, watch} from 'vue'
import {getMusicList} from "@/api/music";

// 关联歌单
const handlerPlay = (id) => {
  if (!options.player[id]) {
    // 没值触发新的播放
    options.index = state.DataList.findIndex((x) => x.id === id);
    console.log(options.index);
    options.play = false;
  }
  musicPlay("play")
}

interface Options {
  flag: boolean,
  isShow: boolean,
  musicPath: string, // mp3链接
  coverPath: string, // 封面
  musicTitle: string, // 当前播放标题
  musicImg: string, //  当前播放封面
  duration: number | string | any, // 音乐总时长
  currentTime: number | string | any, // 当前播放时长
  sliderVal: number, // 这个对接当前时长。
  sliderMin: number,
  sliderMax: number, // 这个对接总时长、
  voiceVal: number, // 当前声音大小。
  voiceMin: number,
  voiceMax: number, // 最大声音。
  index: number, // 当前播放的音乐素质索引
  play: boolean, //播放状态，true为正在播放
  player: {},
  currentProgressTime: number | null
}

interface Props {
  isShowMusicBox?: boolean,
}

const translate = ref('translateY(-400px)')
const op = ref(0)
const showPosa = ref(false)
const showBox = () => {
  showPosa.value = !showPosa.value
  if (showPosa.value) {
    translate.value = 'translateY(0)'
    op.value = 1
  } else {
    translate.value = 'translateY(-400px)'
    op.value = 0
  }
}

let singeBox = ref<HTMLAudioElement | undefined>()//audio对象
const options = reactive<Options>({
  flag: false,
  isShow: false,
  musicPath: "", // mp3链接
  coverPath: "", // 封面
  musicTitle: "", // 当前播放标题
  musicImg: "", //  当前播放封面
  duration: null, // 音乐总时长
  currentTime: null, // 当前播放时长
  currentProgressTime: null,
  sliderVal: 0, // 这个对接当前时长。
  sliderMin: 0,
  sliderMax: 0, // 这个对接总时长、
  voiceVal: 0, // 当前声音大小。
  voiceMin: 0,
  voiceMax: 100, // 最大声音。
  index: 0, // 当前播放的音乐素质索引
  play: false, //播放状态，true为正在播放
  player: {},
})
const scrollBox = ref<HTMLDivElement | null>()
const items = ref<HTMLDivElement | null>()
const state = reactive<{ DataList: Array<MusicTypes.Datum>, ItemBoxHeight: number, itemNum: number, startIndex: number }>({
  DataList: [],
  ItemBoxHeight: 0,
  itemNum: 100,
  startIndex: 0,
})
// ---- 音乐控件---

const musicPlay = (flag) => {
  switch (flag) {
    case "pre":
      if (state.DataList[options.index - 1]) {
        singeBox.value!.src = options.musicPath + state.DataList[options.index - 1].url
        options.index -= 1
      } else {
        singeBox.value!.src = options.musicPath + state.DataList[state.DataList.length - 1].url
        options.index = state.DataList.length - 1
      }
      break
    case "play":
      options.play = !options.play
      // 对接控件 同步 列表里的控件
      if (options.player[state.DataList[options.index].id!])
        options.player[state.DataList[options.index].id!].play = options.play
      // 新的歌曲播放
      if (options.play && !options.player[state.DataList[options.index].id!])
        singeBox.value!.src = options.musicPath + state.DataList[options.index].url
      break
    case "next":
      if (state.DataList[options.index + 1]) {
        singeBox.value!.src = options.musicPath + state.DataList[options.index + 1].url
        options.index += 1
      } else {
        singeBox.value!.src = options.musicPath + state.DataList[0].url
        options.index = 0
      }
      break
  }
  if (options.play && !options.player[state.DataList[options.index].id!]) {
    options.player = {}
    options.player[state.DataList[options.index].id!] = {}
    options.player[state.DataList[options.index].id!].play = true
  } else {
    options.play ? singeBox.value!.play() : singeBox.value!.pause()
  }
}
const init = () => {
  // @ts-ignore
  singeBox.value.src = state.DataList[0].url
  // 歌曲链接
  // 绑定三个触发方法
  // 当时长有变化时触发，由"NaN"变为实际时长也算
  singeBox.value!.ondurationchange = function () {
    // console.log("时长发生了变化")
    options.play ? singeBox.value!.play() : singeBox.value!.pause()
    options.sliderMax = singeBox.value!.duration
    // console.log("声音", singeBox.value!.volume * 100)
    options.voiceVal = singeBox.value!.volume * 100
    updateTime()
  }
  // 当前数据可用是触发
  singeBox.value!.oncanplay = function () {
    options.play ? singeBox.value!.play() : singeBox.value!.pause()
    console.log("已经可以播放了")
  }
  // 播放位置发送改变时触发。
  singeBox.value!.ontimeupdate = function () {
    // console.log("播放位置发送了变动")
    // console.log(options.sliderVal)
    updateTime()
  }
  // 音频播放完毕
  singeBox.value!.onended = function () {
    musicPlay("next")
    console.log("播放完毕，谢谢收听")
  }  // 音频播放完毕

  // 音频播放完毕
  singeBox.value!.onerror = function () {
    console.log("加载出错！")
  }
}
const updateTime = () => {
  const total = formatTime(singeBox.value!.duration)
  const current = formatTime(singeBox.value!.currentTime)
  options.currentProgressTime = singeBox.value!.currentTime / singeBox.value!.duration * 100
  options.duration = `${total.min}:${total.sec}`
  options.currentTime = `${current.min}:${current.sec}`
  // 值为xx.xxxxx 需要取整
  options.sliderVal = Math.floor(singeBox.value!.currentTime)
  options.musicTitle =
    state.DataList[options.index].name + " - " + state.DataList[options.index].artist
  options.musicImg = options.coverPath + state.DataList[options.index].cover
}
const formatTime = (time) => {
  // 格式化毫秒，返回String型分秒对象
  // 有可能没获取到，为NaN
  if (!time) return {min: "00", sec: "00"}
  return {
    min: Math.floor(time / 60)
      .toString()
      .padStart(2, "0"),
    sec: Math.floor(time % 60)
      .toString()
      .padStart(2, "0"),
  }
}
// ---- 音乐控件---

//--------------虚拟列表------------------

const virtualList = computed(() => {
  let endIndex = state.startIndex + state.itemNum
  if (endIndex >= state.DataList.length) endIndex = state.DataList.length
  return state.DataList.slice(state.startIndex, endIndex)
})
const doscroll = () => {
  const curScrollTop = scrollBox.value!.scrollTop
  if (curScrollTop > state.ItemBoxHeight) {
    const index = ~~(scrollBox.value!.scrollTop / state.ItemBoxHeight)
    items.value!.style.setProperty(
      "padding-top",
      `${index * state.ItemBoxHeight}px`
    )
    state.startIndex = index
  } else {
    items.value!.style.setProperty("padding-top", "0px")
    state.startIndex = 0
  }
}
watchEffect(() => {
  if (state.DataList.length >= 0) {
    nextTick(() => {
      // 计算每行高度
      // @ts-ignore
      state.ItemBoxHeight = items.value.children[0].offsetHeight
      //计算屏幕内能显示的行数   +1是防止下拉过快出现白屏
      state.itemNum = ~~(scrollBox.value!.clientHeight / state.ItemBoxHeight) + 1
      // 设置列表总高度
      const ListHeight = state.ItemBoxHeight * state.DataList.length
      items.value!.style.setProperty("height", `${ListHeight}px`)
    })
  }
})
//--------------虚拟列表------------------

onMounted(async () => {
  try {
    const res = await getMusicList()
    if (res.data) {
      state.DataList = res.data.map((item, i) => {
        let id = i + 1
        return {...item, id}
      })
      init()
    }
  } catch (err) {
    console.log(err)
  }
})
</script>
<style lang="less" scoped>
.music {
  display: flex
}

.player {
  width: 215px;
  height: 50px;
  display: flex;

  .songOption-icon {
    height: 16px;
  }

  .Progress {
    width: 160px;
    height: 3px;
    background-color: #f3f2d9;
    margin-top: 9px;
    border-radius: 3px;
    display: none;

    .onProgress {
      width: 1%;
      height: 3px;
      border-radius: 3px;
      background-color: #4f8984;
      position: relative;


      span {
        position: absolute;
        display: inline-block;
        right: -10px;
        top: 0;
        width: 10px;
        height: 3px;
        border-radius: 3px 3px 0 0;
        background-color: #4f8984;
        z-index: 99999;
        transition: all .5s;
        transform: scale(0);
      }
    }

    &:hover span {
      height: 8px;
      transform: scale(1);
      top: -5px;
    }
  }

  &:hover .Progress {
    display: block;
  }

  .songName {
    width: 121px;
    height: 16px;
    color: var(--c-text-666);
    font-size: 14px;
    line-height: 16px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .cover {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    padding-top: 5px;
  }

  .switch {
    flex: 1;
    padding-top: 5px;
    padding-left: 15px;

    .songOption-icon {
      display: flex;
      align-items: center;
    }

    span {
      display: flex;
      justify-content: center;
      align-items: center;
      color: #666;
    }

    .songOption {
      span:nth-child(1),
      span:nth-child(2),
      span:nth-child(3) {
        margin-right: 7px;
      }
    }
  }
}

.music-option {
  height: 50px;
  display: flex;
  align-items: center;
  user-select: none;
  position: relative;
  transition: all .5s;
  background-color: var(--c-f9f9f930);

  .music-posa {
    transition: all .5s;
    overflow: auto;
    position: absolute;
    top: 60px;
    right: 0;
    width: 254px;
    height: 285px;
    border-radius: 5px;
    transform: v-bind(translate);
    opacity: v-bind(op);
    background-color: var(--80background-color);
    z-index: -2;
    box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
    backdrop-filter: var(--c-base-blur);

    &::-webkit-scrollbar {
      width: 0px;
      background: rgb(73, 73, 73);
    }

    &::-webkit-scrollbar-thumb {
      background-color: rgba(218, 220, 222, 0.74);
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 100%;
  }

  &:hover {
    background-color: rgba(0, 0, 0, .05);
  }
}

.text {
  width: 250px;
  font-size: 16px;
  text-align: center;
  padding-bottom: 10px;
}

.box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.container {
  height: 250px;
  overflow-y: scroll;
  width: 250px;
  backdrop-filter: var(--c-base-blur);
}

.container::-webkit-scrollbar {
  width: 3px;
  background: rgb(73, 73, 73);
}

.container::-webkit-scrollbar-thumb {
  background-color: rgba(218, 220, 222, 0.74);
}

.container .item {
  padding: 0 10px;
  height: 30px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  transition: all .3s;

  span {
    font-size: 10px !important;
  }

  &:hover {
    background: var(--c-907e7e28) !important;
  }
}

.container .item img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
}

@media screen and (max-width: 1110px) {
  .music {
    width: 0;
    display: none;
  }
}

</style>
