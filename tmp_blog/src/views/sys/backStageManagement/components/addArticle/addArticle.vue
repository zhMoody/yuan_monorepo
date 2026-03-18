<template>
  <div class="">
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      :show-label="false"
      label-placement="left"
    >
      <n-grid :cols="2" class="info" x-gap="12">
        <n-gi>
          <n-form-item label="文章标题" path="title">
            <n-input v-model:value="formValue.title" placeholder="文章标题"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="文章分类" path="category_id">
            <n-select v-model:value="formValue.category_id" :on-focus="selectQingqiu" :options="selectOptions"
                      placeholder="文章分类"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="关键字" path="keyword">
            <n-input v-model:value="formValue.keyword" placeholder="文章搜索关键字"/>
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item label="文章封面url" path="cover">
            <n-input v-model:value="formValue.cover" placeholder="文章封面url"/>
          </n-form-item>
        </n-gi>
        <n-gi :span="2">
          <n-form-item label="文章简介" path="description">
            <n-input v-model:value="formValue.description" placeholder="文章简介" type="textarea"/>
          </n-form-item>
        </n-gi>
      </n-grid>
      <div class="form-item">
        <n-form-item path="content">
          <md-editor
            v-model="formValue.content"
            class="hText"
            prettier
            themes
          ></md-editor>
        </n-form-item>
        <n-form-item>
          <n-button attr-type="button" type="success" @click="handleValidateClick">
            {{ route.query.id ? '更新文章' : '创建文章' }}
          </n-button>
        </n-form-item>
      </div>
    </n-form>


  </div>
</template>
<script lang='ts' setup>
import MdEditor from 'md-editor-v3';
import {onMounted, ref} from "vue";
import {NForm, NInput, NFormItem, NButton, NSelect, NGrid, NGi, useMessage} from "naive-ui";
import {addArticle, getCategroy, updateArticle} from "@/api/article";
import useUser from "@/stores/useUser";
import {useRoute} from "vue-router";
import {getArticleDetail} from '@/api/article'

const route = useRoute()
const userStore = useUser()
const message = useMessage()
const content = ref('xxxxxxx')
const selectOptions = ref<{ label: string, value: string }[]>([])
const formRef = ref()
const selectQingqiu = async () => {
  const res = await getCategroy()
  selectOptions.value = res.data.result.map((item) => {
    return {
      label: item.name,
      value: item._id
    }
  })
}

const formValue = ref({
  title: '',
  description: '',
  category_id: null,
  keyword: '',
  content: '',
  cover: '',
  author: userStore.userInfo.nickname
})
const rules = {
  title: {
    required: true,
    message: '请输入标题',
    trigger: 'blur'
  },
  description: {
    required: true,
    message: '请输入关键字',
    trigger: ['input', 'blur']
  },
  category_id: {
    required: true,
    message: '请选择分类',
    trigger: ['input']
  },
  keyword: {
    required: true,
    message: '请输入关键字',
    trigger: ['input']
  },
  content: {
    required: true,
    message: '请输入内容',
    trigger: ['input']
  },
  cover: {
    required: true,
    message: '请输入文章封面url',
    trigger: ['input']
  },
}
const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        if (route.query.id) {
          let res = await updateArticle(route.query.id, formValue.value)
          message.success(res.data)
        } else {
          const res = await addArticle(formValue.value)
          message.success(res.data)
        }
      } catch (err: any) {
        message.error(err)
      }

    } else {
      message.error('所有字段必填！')
    }
  })
}
onMounted(async () => {
  if (route.query.id) {
    const res = await getArticleDetail(route.query.id)
    // @ts-ignore
    formValue.value = res.data.articleDetail
    selectOptions.value = [{
      label: res.data.articleDetail.category_id.name,
      value: res.data.articleDetail.category_id._id,
    }]
    formValue.value.category_id = res.data.articleDetail.category_id._id
    console.log(res)
  }
})
</script>

<style lang="less" scoped>
.info {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 5px;
}

.form-item {
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  padding: 20px;
  border-radius: 5px;
}
</style>
