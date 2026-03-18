import {defineStore} from 'pinia';
import {reactive, ref, watchEffect} from "vue"
import {getSpecify} from "@/api/article";

export interface TITLETYPE {
  level: number,
  text: string
}

export default defineStore('useArticle', () => {
  const titleList = reactive<{ list: [TITLETYPE] | [] }>({list: []})
  const specifyList = reactive({list: {} as Specify.Data})
  const getSpecifyList = async () => {
    try {
      const res = await getSpecify()
      specifyList.list = res.data
    } catch (err) {
      console.log(err)
    }
  }
  const setTitleList = (payload) => {
    titleList.list = payload
  }
  return {titleList, setTitleList, getSpecifyList, specifyList}
})
