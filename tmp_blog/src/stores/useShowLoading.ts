import {defineStore} from "pinia";
import {ref} from "vue";

export default defineStore('useShowLoading', () => {
  const onLoading = ref<boolean>(true)
  const loadingText = ref<string>('正在加载中，请稍后。')
  const setLoading = (payload: boolean, text: string = '正在加载中，请稍后。'): void => {
    onLoading.value = payload
    loadingText.value = text
  }
  return {onLoading, loadingText, setLoading}
})
