<template>
  <div class="subject">
    <div class="usenbox">
      <div class="userAvatar">
        <n-avatar
          :size="100"
          :src="store.userInfo.baseAvatarUrl"
          bordered
          round
        />
      </div>
      <div class="introduction">
        <span style="margin-right: 5px;font-size: 16px;color:var(--c-text-666)">{{ store.userInfo.userName }}</span>
        <Icon color="#666" size="12">
          <CaretDown tag="span"></CaretDown>
        </Icon>
      </div>
      <div style="height: 50px">
        <div ref='signature' class="signature"></div>
      </div>
      <div class="posa"></div>
    </div>

    <div class="navgo">
      <div class="menu_card">
        <ul class="menu">
          <li class="text">导航</li>
          <li v-for="navigation in navigationList" :key="navigation.path" class="navLink" data-aos="fade-up">
            <router-link :to="navigation.path">
              <svg aria-hidden="true" class="icon">
                <use :xlink:href="navigation.icon"></use>
              </svg>
              <span style='padding:0 10px'> {{ navigation.name }}</span>
            </router-link>
          </li>
          <li id="text" class="text">构成</li>
          <li
            v-for="(item, index) in navItemList"
            :key="item.name"
            class="oneMenu"
            @click.stop="showSubItem(item, index)"
          >
            <div :class="item.isSubShow ? 'active' : 'myactive'">
              <svg aria-hidden="true" class="icon">
                <use :xlink:href="item.icon"></use>
              </svg>
              <span>{{ item.name }}</span>
              <svg aria-hidden="true" class="icon float">
                <use xlink:href="#icon-youjiantou"></use>
              </svg>
            </div>
            <ul :style="{height:item.isSubShow? (item.subItems.length * 40) - 20 +'px' : 0}" class="box" @click.stop>
              <li v-for="subItem in item.subItems" :key="subItem.name" :style="{color:id===subItem.id ? '#0acf97':''}"
                  class="itemLi"
                  @click.stop="gotoC(subItem)">
                {{ subItem.name }}
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {NAvatar} from 'naive-ui'
import useUserStore from "@/stores/useUser";
import {CaretDown} from '@vicons/ionicons5'
import {Icon} from '@vicons/utils'
import {useDynamicText} from "@/hooks/useDynamicText";
import {ref, onMounted, reactive, nextTick} from "vue";
import {useRouter} from "vue-router";
import {getCategroy} from "@/api/article";

const router = useRouter()
const store = useUserStore()
const signature = ref<HTMLDivElement>()
onMounted(() => {
  useDynamicText(signature.value, store.userInfo.userIntro)
})

const navItemList = reactive([
  {
    name: "分类",
    isSubShow: false,
    icon: "#icon-calendar",
    subItems: []
  },
  {
    name: "页面",
    isSubShow: false,
    icon: "#icon-biaoqian",
    subItems: [
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      }
    ]
  },
  {
    name: "友链",
    isSubShow: false,
    icon: "#icon-lianjie1",
    subItems: [
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录",
        path: "/"
      },
      {
        name: "二级目录33333",
        path: "/"
      }
    ]
  }
])
const navigationList = reactive([
  {
    name: "首页",
    path: "/",
    icon: "#icon-zhuye"
  },
  {
    name: "归档",
    path: "/placeOnFile",
    icon: "#icon-wendang"
  },
  {
    name: "关于",
    path: "/acg",
    icon: "#icon-biaoqian1"
  }
])
const id = ref('')
const gotoC = (subItem) => {
  id.value = subItem.id
  router.push(subItem.path)
}
const showSubItem = (item, ind) => {
  navItemList.forEach((i) => {
    // 判断如果数据中的menuList[i]的show属性不等于当前数据的isSubShow属性那么menuList[i]等于false
    if (i.isSubShow !== navItemList[ind].isSubShow) {
      i.isSubShow = false;
    }
  });
  item.isSubShow = !item.isSubShow;
}
const getCategroyData = async () => {
  const res = await getCategroy()
  navItemList[0].subItems = res.data.result.map((item) => {
    return {
      name: item.name,
      path: `/categroy?id=${item._id}&name=${item.name}`,
      id: item._id
    }
  })
}
getCategroyData()

</script>
<style lang="less" scoped>


.subject {
  overflow: hidden;

  .usenbox {
    padding: 30px 20px 0 20px;
    position: relative;

    //&::after {
    //  content: '';
    //  position: absolute;
    //  top: 0;
    //  left: 0;
    //  background: url("@/assets/waves.png") no-repeat;
    //  width: 100%;
    //  height: 100%;
    //  z-index: -1;
    //}

    .posa {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      transition: all 1s;
    }

    &:hover {
      background: url('@/assets/snow.gif');
    }
  }

  .userAvatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;

    :deep(.n-avatar) {
      transition: all 1s;
    }

    &:hover :deep(.n-avatar) {
      transform: rotate(720deg) scale(1.2);
    }
  }

  .introduction, .signature {
    text-align: center;
    color: var(--c-text-666);
  }

  .navgo {
    height: calc(100vh - 270px);
    overflow-x: hidden;
    overflow-y: auto;
    padding-bottom: 100px;
    padding-top: 20px;

    &::-webkit-scrollbar {
      width: 0 !important;
      background: transparent !important;
    }

    &::-webkit-scrollbar-thumb {
      background-color: transparent !important;
    }

    .text {
      color: var(--c-text-666);
      font-size: 18px;
      padding-left: 10px;
    }

    .menu {
      display: flex;
      gap: 15px;
      flex-direction: column;
    }

    .box {
      overflow: hidden;
      transition: all .5s;
      display: flex;
      flex-direction: column;
      gap: 15px;

      li:hover {
        color: #0acf97;
      }
    }

    .menu li {
      a {
        color: var(--c-text-666);
        position: relative;
        font-size: 14px;
        font-weight: 500;
        -webkit-transition: all 0.4s;
        transition: all 0.4s;
        padding: 0 30px;

        &:hover {
          color: #0acf97;
        }
      }
    }

    .font-12px {
      color: var(--c-text-666);
      font-size: 12px;
    }


  }

  .oneMenu {
    user-select: none;
    font-size: 14px;
    font-weight: 500;
    padding: 0 30px;
    color: var(--c-text-666);
    transition: all 0.4s;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 10px;

    .box {
      height: 35px;
      padding: 0 25px;
    }

    .myactive {
      .float {
        transform: rotate(00deg);
        transition: all 0.5s;
      }
    }

    .active {
      color: #0acf97 !important;

      .float {
        transform: rotate(90deg);
        transition: all 0.5s;
      }
    }

    .menu-item li a {
      padding: 30px 30px 0 30px !important;
    }

    .icon {
      margin-right: 10px;
    }

    .float {
      float: right;
    }
  }


}

</style>
