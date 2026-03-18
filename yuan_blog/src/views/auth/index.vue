<template>
  <div class="auth"></div>
</template>
<script lang='ts' setup>
// 跳转验证
import {auth} from "@/api";
import {onMounted} from "vue";
import {useRoute, useRouter} from "vue-router";
import useUser from "@/stores/useUser";
import useShowLoading from "@/stores/useShowLoading";

const userStore = useUser()
const route = useRoute()
const router = useRouter()
const loadingStore = useShowLoading()
if (!route.query.id && !userStore.userInfo.token) {
  loadingStore.setLoading(true, '登录后才能跳转到后台管理')
}
const onAuth = async () => {
  let data = {
    id: route.query.id
  }
  const res = await auth(data).catch((err) => {
    loadingStore.setLoading(true, err)
  })
  if (res.code === 200) {
    router.push(`/${route.query.path}`)
  }
}
onMounted(() => {
  onAuth()
})
</script>

<style scoped>

</style>
