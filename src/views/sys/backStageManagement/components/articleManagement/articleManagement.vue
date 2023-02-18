<template>
  <div class="article">
    <n-data-table
      :bordered="false"
      :columns="columns"
      :data="articleData"
      :loading="isLoading"
      :pagination='pagination'
      :single-line="false"
    />
    一切都将一去杳然，任何人都无法将其捕获。
  </div>
</template>
<script lang='ts' setup>
import {useMessage, NDataTable} from 'naive-ui'
import {onMounted, ref, watch} from "vue";
import {createColumns} from "./ListColumns";
import {delArticle, getArticleList} from "@/api/article";
import {useRouter} from "vue-router";

const router = useRouter()
const message = useMessage()
const articleData = ref<any[]>([])
const isLoading = ref(false)
const createData = async () => {
  let data = {
    pagenum: 1,
    pagesize: 10
  }
  isLoading.value = true
  let res = await getArticleList(data)
  pagination.value.pageCount = +res.data.tootal
  pagination.value.pageNum = +res.data.pagenum
  pagination.value.pageSize = +res.data.pagesize
  articleData.value = res.data.result.map((item) => {
    let key = item._id
    return {...item, key}
  })
  isLoading.value = false
}
const columns = createColumns({
    editArticle(rowData: RowData.Data) {
      delArticle(rowData.key).then((res) => {
        message.success(res.data)
        createData()
      }).catch((err) => {
        message.error(err)
      })
    }
  },
  {
    deleteArticle(rowData: RowData.Data) {
      router.push({
        name: 'addArticle',
        query: {
          id: rowData.key
        }
      })
      message.info('编辑')
    }
  }
)
const pagination = ref({
  pageSize: 10,
  pageNum: 1,
  pageCount: 0
})

onMounted(async () => {
  createData()
})
</script>

<style scoped>

</style>
