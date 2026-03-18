<template>
  <div class="infoConfig">
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      label-placement="top"
    >
      <n-grid :cols="2" class="info" x-gap="12">
        <n-gi :span="2">
          <div style="margin-bottom: 30px;font-size: 20px">
            博客头部配置
          </div>
        </n-gi>
        <n-gi>
          <n-form-item label="blogTitle" path="blogTitle">
            <n-input v-model:value="formValue.blogTitle" placeholder="blogTitle"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="blog用户名" path="userName">
            <n-input v-model:value="formValue.userName" placeholder="blog展示名"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="个人简介" path="userIntro">
            <n-input v-model:value="formValue.userIntro" placeholder="个人简介"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="blog头像" path="baseAvatarUrl">
            <n-input v-model:value="formValue.baseAvatarUrl" placeholder="blog头像"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="首页标题" path="homeTitle">
            <n-input v-model:value="formValue.homeTitle" placeholder="首页标题"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="首页简介" path="homeIntro">
            <n-input v-model:value="formValue.homeIntro" placeholder="首页简介"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="博客运行开始时间" path="createAt">
            <n-input v-model:value="formValue.createAt" placeholder="博客运行开始时间"/>
          </n-form-item>
        </n-gi>
        <n-gi :span="2">
          <div style="margin-bottom: 30px;font-size: 20px">
            博客归档配置
          </div>
        </n-gi>
        <n-gi>
          <n-form-item label="归档背景图片Url" path="leftFooter">
            <n-input v-model:value="formValue.onFilebg" placeholder="归档背景图片Url"/>
          </n-form-item>
        </n-gi>
        <n-gi :span="2">
          <div style="margin-bottom: 30px;font-size: 20px">
            博客底部配置
          </div>
        </n-gi>
        <n-gi>
          <n-form-item label="页脚左边" path="leftFooter">
            <n-input v-model:value="formValue.leftFooter" placeholder="页脚左边"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="页脚右边" path="rightFooter">
            <n-input v-model:value="formValue.rightFooter" placeholder="页脚右边"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-button attr-type="button" type="success" @click="handleValidateClick">
            更新配置
          </n-button>
        </n-gi>
      </n-grid>
    </n-form>
  </div>
</template>
<script lang='ts' setup>
import {onMounted, ref} from "vue";
import {NForm, NInput, NFormItem, NButton, NSelect, NGrid, NGi, useMessage} from "naive-ui";
import {getConfigInfo, updateConfigInfo} from "@/api";
import useUser from "@/stores/useUser";

const message = useMessage()
const formRef = ref()
const userStore = useUser()
const formValue = ref({
  userName: '',
  userIntro: '',
  baseAvatarUrl: '',
  leftFooter: '',
  rightFooter: '',
  homeTitle: '',
  homeIntro: '',
  onFilebg: '',
  blogTitle: '',
  createAt: Date.now()
})
const rules = {
  userName: {
    required: true,
    message: '请输入blog展示名',
    trigger: 'blur'
  },
  blogTitle: {
    required: true,
    message: '请输入blogTitle',
    trigger: 'blur'
  },
  userIntro: {
    required: true,
    message: '请输入个人简介',
    trigger: 'blur'
  },
  baseAvatarUrl: {
    required: true,
    message: '请输入blog头像Url',
    trigger: 'blur'
  },
  homeTitle: {
    required: true,
    message: '请输入首页标题',
    trigger: 'blur'
  },
  homeIntro: {
    required: true,
    message: '请输入首页简介',
    trigger: 'blur'
  },
  createAt: {
    required: true,
    message: '请输入运行开始时间',
    trigger: 'blur'
  },
  onFilebg: {
    required: true,
    message: '请输入归档背景图片Url',
    trigger: 'blur'
  },
  leftFooter: {
    required: true,
    message: '请输入页脚左边内容',
    trigger: 'blur'
  },
  rightFooter: {
    required: true,
    message: '请输入页脚右边内容',
    trigger: 'blur'
  },
}
const handleValidateClick = () => {
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      if (userStore.userInfo.id) {
        try {
          const res = await updateConfigInfo(userStore.userInfo.id, formValue.value)
          message.success(res.data)
        } catch (err: any) {
          message.error(err)
        }
      }

    } else {
      message.error('更新失败')
    }
  })
}
onMounted(async () => {
  try {
    const res = await getConfigInfo(userStore.userInfo.id)
    formValue.value = res.data.result
    console.log(res)
  } catch (err: any) {
    message.error(err)
  }

})
</script>

<style scoped>

</style>
