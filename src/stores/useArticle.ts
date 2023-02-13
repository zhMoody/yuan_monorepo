import {defineStore} from 'pinia';
import {reactive, ref, watchEffect} from "vue"

export interface TITLETYPE {
  level: number,
  text: string
}

export default defineStore('useArticle', () => {
  const titleList = reactive<{ list: [TITLETYPE] | [] }>({list: []})

  const setTitleList = (payload) => {
    titleList.list = payload
  }
  return {titleList, setTitleList}
})
