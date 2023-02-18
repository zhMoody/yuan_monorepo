<template>
  <header id="header" class="header">
    <div class="default" @click="router.push('/')">
      <Icon size='22'>
        <HomeOutline tag="span"/>
      </Icon>
      <span style="padding-left: 10px;color: var(--c-text-666)">  {{ store.userInfo.userName }}</span>
    </div>
    <div class="onMobile" @click="showMenu">
      <Icon size='22'>
        <HomeOutline tag="span"/>
      </Icon>
    </div>
    <div class="blog-center">
      <div class="blog-center-search">
        <div class="search">
          <input class="ipt" placeholder="输入关键字搜索。。。" type="text">
          <button class="btn">
            <Icon color="#666" size='16'>
              <Search tag="span"></Search>
            </Icon>
          </button>
        </div>
      </div>
    </div>
    <div class="blog-right">
      <MusicPlayer class="musicBox"></MusicPlayer>
      <div class="login-container" @click.self="showBox">
        <Icon v-if="!store.userInfo.token" color="#777" size="24" @click="showBox">
          <PersonCircleOutline></PersonCircleOutline>
        </Icon>
        <span style="margin-right: 5px;font-size: 16px;color: var(--c-text-666)" @click="showBox">{{
            store.userInfo.nickname
          }}</span>
        <Icon color="var(--c-text-666)" size="12" @click="showBox">
          <CaretDown tag="span"></CaretDown>
        </Icon>
        <div class="avatar">
          <NAvatar
            v-if="store.userInfo.token"
            :size="40"
            :src="store.userInfo.avatar"
            bordered
            fallback-src="https://s1.ax1x.com/2020/07/25/UzAaMq.jpg"
            round
            @click="showBox"
          />
          <span v-if="store.userInfo.token" class="spa"></span>
        </div>
        <div class="login-posa">
          <n-form
            v-if="!store.userInfo.token"
            ref="formRef"
            :model="formValue"
          >
            <n-form-item class="ipt" label="用户名" path="user.nickname">
              <n-input v-model:value="formValue.nickname" placeholder="用户名"/>
            </n-form-item>
            <n-form-item label="密码" path="user.password" style="margin-bottom: 10px">
              <n-input v-model:value="formValue.password" placeholder="密码"/>
            </n-form-item>
            <n-button block type="info" @click="handleValidateClick">
              登录
            </n-button>
          </n-form>
          <div v-if="store.userInfo.token" class="isLoginBox" @click.self="logoutBlog">
            <div class="helloTitle">{{ getDate() }}</div>
            <div class="LoginOptions" @click="handleRouter('addArticle')">
              <div class="onNew">
                <Icon color="var(--c-text-666)" size="14">
                  <ColorWandOutline></ColorWandOutline>
                </Icon>
                <span>撰写文章</span></div>
              <Icon color="var(--c-text-666)" size="12">
                <CaretForward tag="span"></CaretForward>
              </Icon>
            </div>
            <div class="LoginOptions" @click="handleRouter('backStageManagement')">
              <div class="onNew">
                <Icon color="var(--c-text-666)" size="14">
                  <SettingsOutline tag="span"></SettingsOutline>
                </Icon>
                <span>后台管理</span></div>
              <Icon color="var(--c-text-666)" size="12">
                <CaretForward></CaretForward>
              </Icon>
            </div>
            <n-divider/>
            <div class="logoutBtn" @click="logoutBlog">
              退出登录
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>

</template>
<script lang='ts' setup>
import {computed, onMounted, ref, watch, watchEffect} from "vue";
import {NInput, FormInst, useMessage, NForm, NFormItem, NButton, NAvatar, NDivider, useNotification} from 'naive-ui'
import MusicPlayer from '@/components/musicPlay/index.vue'
import {useRouter} from "vue-router";
import {
  HomeOutline,
  Search,
  PersonCircleOutline,
  CaretDown,
  CaretForward,
  SettingsOutline,
  ColorWandOutline
} from '@vicons/ionicons5'
import useUserStore from "@/stores/useUser";
import useMenu from "@/stores/useMenu";
import {Icon} from '@vicons/utils'
import WOW from "wow.js";
import {auth} from "@/api";


const store = useUserStore()
const notification = useNotification()
const show = useMenu()
const router = useRouter()
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const isShowLoginInputBox = ref<boolean>(false)
const screenWidth = ref<any>(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
const formValue = ref<{ nickname: string, password: string }>({
  nickname: 'admin',
  password: 'Aa2597758'
})

const logoutBlog = () => {
  store.logout()
}
// 登录
const handleValidateClick = async () => {
  if (!formValue.value.nickname.trim()) {
    notification.create({
      title: '登录通知',
      content: "用户名是必填的哦～",
      type: 'warning',
      duration: 2000,
    })
  } else if (!formValue.value.password.trim()) {
    notification.create({
      title: '登录通知',
      content: "密码是必填的哦～",
      type: 'warning',
      duration: 2000,
    })
  } else {
    store.login(formValue.value)
  }
}
const onHeight = ref('0')
const op = ref(0)
const onPadding = ref('0')
const showBox = () => {
  isShowLoginInputBox.value = !isShowLoginInputBox.value
  if (isShowLoginInputBox.value) {
    onHeight.value = '220px'
    op.value = 1
    onPadding.value = '15px'
  } else {
    onHeight.value = '0'
    op.value = 0
    onPadding.value = '0'
  }
}

const showMenu = () => {
  show.isShow(!show.isShowMenu.ShowMenu)
}
const getDate = () => {
  let time_now = new Date();
  let hour = time_now.getHours();	//小时
  if (hour >= 0 && hour < 6) {
    return '凌晨好，注意休息！！'
  } else if (hour >= 6 && hour < 10) {
    return '早晨好呀～'
  } else if (hour >= 10 && hour < 12) {
    return '上午好呀～'
  } else if (hour >= 12 && hour <= 18) {
    return '下午好呀～'
  } else {
    return '晚上好呀～'
  }
}
//跳转到后台管理页面

const handleRouter = (path) => {
  if (store.userInfo.token && store.userInfo.id) {
    const {href} = router.resolve({
      name: "auth",
      query: {
        id: store.userInfo.id,
        path: path
      }
    })
    window.open(href, '_blank');
  }
}

// const setShowLoginBox = () => {
//   console.log(111)
//   isShowLoginInputBox.value = false
//   translate.value = 'translateY(-300px)'
//   op.value = 0
// }

onMounted(async () => {
  window.onresize = () => {
    return (() => {
      show.setMenuWidth(window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth)
      screenWidth.value = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
    })()
  }
  let wow = new WOW({
    boxClass: "wow",
    animateClass: "animated",
    offset: 0,
    mobile: true,
    live: true,
    callback: function (box) {
    },
    scrollContainer: null,
    resetAnimation: true,
  })
  wow.init()
})
</script>

<style lang="less" scoped>


:deep(.n-form-item .n-form-item-feedback-wrapper) {
  min-height: 10px !important;
}


.header {
  width: 100%;
  height: 50px;
  background-color: var(--c-f9f9f930);
  box-shadow: var(--c-header-boxShow) 0px 1px 2px 0px;
  position: sticky;
  top: 0;
  z-index: 990;
  backdrop-filter: var(--c-base-blur);
  display: flex;
  justify-content: space-between;
  padding: 0;

  .default {
    //background-color: #000000;
    display: inline-block;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
    border-radius: 50px;
    padding: 0 20px;
    user-select: none;
    transition: all .3s;
    cursor: url('../../../assets/link.cur'), pointer;

    span {
      font-size: 24px;
      text-align: center;
      transition: all .3s;
      color: var(--c-text-666);
    }
  }

  .onMobile {
    display: none;
    height: 40px;
    margin-top: 10px;
    line-height: 40px;
    border-radius: 50px;
    padding: 0 20px;
    user-select: none;
    transition: all .3s;
    cursor: url('../../../assets/link.cur'), pointer;
  }

  .blog-center {
    flex: 1;
    margin-left: 120px;
    padding-top: 10px;

    .search {
      width: 200px;
      height: 30px;
      border-radius: 50px;
      overflow: hidden;
      display: flex;
      box-shadow: rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px;
    }

    .ipt {
      width: 160px;
      height: 100%;
      font-size: 14px;
      padding-left: 10px;
      background-color: transparent;
      color: #666;
      transition: background-color .2s;
      border: 1px solid transparent;

      &:hover {
        background-color: #e0e6ed;
      }
    }

    .ipt:focus {
      outline: none;
      border-radius: 50px 0 0 50px;
      box-shadow: #cad6f2 0px 1px 0px, #cad6f2 0px 8px 24px, #cad6f2 0px 16px 48px;
      border: 1px solid #cad6f2;
      background-color: #fff;
    }


    .btn {
      padding: 0 10px;
      flex: 1;
      height: 100%;
      background-color: transparent;
      box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
      line-height: 36px;
      cursor: url('@/assets/link.cur'), pointer;
      border: 1px solid transparent;

      &:hover {
        border-radius: 0 50px 50px 0;
        box-shadow: #cad6f2 0px 3px 3px 0px;
        border: 1px solid #cad6f2;
      }
    }
  }

  .blog-right {
    height: 100%;
    display: flex;
    align-items: center;
    cursor: url('@/assets/link.cur'), pointer;

    .login-container {
      height: 50px;
      display: flex;
      align-items: center;
      padding: 0 15px;
      user-select: none;

      .avatar {
        margin-left: 5px;
        transition: all 1s;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;

        &:hover {
          transform: rotate(360deg);
        }

        .spa {
          position: absolute;
          bottom: 2px;
          right: 1px;
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #12e612;
          border: 2px solid #ffffff;
        }
      }

      .login-posa {
        position: absolute;
        top: 50px;
        right: 0;
        width: 280px;
        height: v-bind(onHeight);
        padding: v-bind(onPadding);
        transition: all .5s;
        opacity: v-bind(op);
        //transform: v-bind(translate);
        background: var(--c-musiclist-bg);
        z-index: 1;
        box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px, rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
        border-radius: 5px;
        overflow: hidden;

        .ipt {
          color: var(--c-text-666);;
        }
      }

      .isLoginBox {
        display: flex;
        flex-direction: column;

        :deep(.n-divider:not(.n-divider--vertical)) {
          margin: 0 !important;
          line-height: 0;
        }

        .LoginOptions {
          height: 35px;
          line-height: 35px;
          margin-bottom: 15px;
          padding: 0 10px;
          border-radius: 3px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .onNew {
            color: var(--c-text-666);
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          &:hover {
            background: var(--c-907e7e30);
          }
        }

        .helloTitle {
          height: 35px;
          line-height: 35px;
          margin-bottom: 15px;
          padding-left: 10px;
          border-radius: 3px;
          color: var(--c-text-666);

          &:hover {
            background: transparent;
          }
        }

        .logoutBtn {
          height: 35px;
          line-height: 35px;
          margin-bottom: 15px;
          border-radius: 3px;
          text-align: center;
          color: red;
          padding-left: 0;

          &:hover {
            background-color: rgba(0, 0, 0, .05);
          }
        }
      }

      &:hover {
        background-color: rgba(0, 0, 0, .05);
      }
    }

  }
}


@media screen and  (max-width: 750px) {
  .header {
    width: 100%;
    height: 50px;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    position: sticky;
    top: 0;
    z-index: 990;
    backdrop-filter: var(--c-base-blur);
    justify-content: space-between;
    align-items: center;
    display: flex;

    .blog-center {
      display: none;
    }

    .login-posa {
      width: 100% !important;
      right: 50% !important;
      transform: translate(50%, 0);
    }
  }

  .default {
    display: none !important;
  }

  .onMobile {
    display: inline-block !important;
  }

  .SearchBox {
    position: absolute;
    top: 50px;
    left: 0;
    width: 100%;
    height: v-bind(onHeight);
    opacity: v-bind(op);
    background: #ffa500;
    transition: all .5s;
  }
}
</style>
