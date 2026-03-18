<template>
  <div class="article">
    <NButton type="success" @click="showModalRef = true">新增分类</NButton>
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="articleData"
      :loading="isLoading"
      :single-line="false"
    />
    <n-modal
      v-model:show="showModalRef"
      :mask-closable="false"
      :title="formValue._id ? '更新分类' : '新增分类'"
      preset="dialog"
      @positive-click="onPositiveClick"
    >
      <n-form
        ref="formRef"
        :label-width="80"
        :model="formValue"
        :rules="rules"
      >
        <n-form-item label="分类名称" path="name" style="margin-top: 30px">
          <n-input v-model:value="formValue.name" placeholder="输入分类名称"/>
        </n-form-item>
        <n-form-item label="关键字" path="keyword">
          <n-input v-model:value="formValue.keyword" placeholder="输入关键字"/>
        </n-form-item>
        <n-form-item>
          <n-button :loading="isLoading" attr-type="button" type="success" @click="onPositiveClick">
            {{ formValue._id ? '更新分类' : '新增分类' }}
          </n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </div>
</template>
<script lang='ts' setup>
import {useMessage, NDataTable, NButton, NModal, NForm, NFormItem, NInput} from 'naive-ui'
import {onMounted, ref, watch} from "vue";
import {createColumns} from "./ListColumns";
import {addCategroy, deleteCategroy, getCategroy, updateCategroy} from "@/api/article";
import {useRouter} from "vue-router";

const router = useRouter()
const message = useMessage()
const articleData = ref<any[]>([])
const isLoading = ref(false)
const showModalRef = ref(false)
const formRef = ref()
const formValue = ref({
  name: '',
  keyword: '',
  _id: ''
})
const rules = {
  name: {
    required: true,
    message: '请输入分类名',
    trigger: 'blur'
  },
  keyword: {
    required: true,
    message: '请输入关键字',
    trigger: ['input', 'blur']
  }
}
const createData = async () => {
  isLoading.value = true
  let res = await getCategroy()
  articleData.value = res.data.result
  isLoading.value = false
}
const onPositiveClick = (e: MouseEvent) => {
  e.preventDefault()
  formRef.value?.validate((errors) => {
    if (!errors) {
      if (!formValue.value._id) {
        isLoading.value = true
        addCategroy(formValue.value).then((res) => {
          showModalRef.value = false
          isLoading.value = false
          message.success(res.data)
          createData()
          formValue.value = {
            name: '',
            keyword: '',
            _id: ''
          }
        }).catch((err) => {
          isLoading.value = false
          showModalRef.value = true
          message.error(err)
        })
      } else {
        updateCategroy(formValue.value._id, formValue.value).then((res) => {
          showModalRef.value = false
          isLoading.value = false
          message.success(res.data)
          createData()
          formValue.value = {
            name: '',
            keyword: '',
            _id: ''
          }
        }).catch(err => {
          isLoading.value = false
          showModalRef.value = true
          message.error(err)
        })
      }
    } else {
      console.log(errors)
    }
  })
}
const columns = createColumns({
    editCategroy(rowData: CRowData.Data) {
      console.log(rowData)
      deleteCategroy(rowData._id).then((res) => {
        createData()
        message.success(res.data)
      }).catch(err => {
        message.error(err)
      })
    }
  },
  {
    deleteCategroy(rowData: CRowData.Data) {
      formValue.value = rowData
      showModalRef.value = true
    }
  }
)


onMounted(async () => {
  createData()
})
</script>

<style lang="less" scoped>
:deep(.n-form-item-blank) {
  justify-content: flex-end;
}
</style>
