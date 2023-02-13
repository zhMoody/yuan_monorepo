import {defineStore} from 'pinia';
import {ref, watchEffect} from "vue"

export interface T {
  ShowMenu: boolean,
  menwWidth?: number | null
}

const defaultData = {
  ShowMenu: true,
  menwWidth: 1920
};
export default defineStore('useShowMenu', () => {
  const isShowMenu = ref<T>(defaultData)
  const isShow = (payload) => {
    isShowMenu.value.ShowMenu = payload
  }
  const setMenuWidth = (payload) => {
    isShowMenu.value.menwWidth = payload
  }
  return {isShow, isShowMenu, setMenuWidth}
})
