<template>
  <div >
    <p class="h-20">{{Name}}</p>
  </div>
</template>

<script setup>
import {ref, reactive, computed, watch,nextTick, getCurrentInstance, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import AuthorService from "@/api/index.js";
import {useUserInfoStore} from "@/store/index.js";

//***路由对象
const route = useRoute()
//***路由实例
const router = useRouter();
//***获取上下文对象
const {proxy} = getCurrentInstance()

//***定义props接收父组件传值
const props = defineProps({
  Name: {
    type: String,//接收类型
    default: '广场'
  }
})

//***定义Emits
const emits = defineEmits(['voidName'])

//***定义计算属性
const computedName = computed(() => {
})

//***方法、数据

//获取全部文章
const userInfoStore = useUserInfoStore()
const userInfo = computed(() => {
  return userInfoStore.userInfo.author
})
const params = reactive({
  PageIndex:'',
  PageSize:'',
  AuthorID:userInfo.id
})
const getAllArticleInUser = async () => {
  try {
    console.log(userInfoStore.userInfo.author,'userInfo')
    if(!userInfoStore.userInfo.author?.id) return
    params.AuthorID = userInfoStore.userInfo.author.id
    const result = await AuthorService.getAllArticleInUser(params)
    console.log(result,'result')
    return
    if(state !== 1){
      $notification.open({
        message: '错误',
        type:'error',
        description:Message,
        placement:'bottomRight'
      });
    }

  }catch(e){
    console.log(e)
  }
}

//***监听普通数据，多个属性，要用数组包起来[attributes1,attributes2]
//watch(attributes, (newVal, oldVal) => {
//}, {})

//***监听引用数据类型对象中的某个值，多个值，写法还是以函数返回的形式。但是多个属性，要用数组包起来[() =>obj.attributes1,() =>obj.attributes2]
//watch(() => obj.attributes, (newVal, oldVal) => {
//}, {})

watch(() => userInfoStore.userInfo, (newValue, oldValue) => {
  //这个回调会在someProperty发生变化时执行
  //你也可以检查newValue是否满足特定条件来决定是否执行方法

  if (newValue !== undefined) {
    console.log('加载时机', userInfoStore.userInfo)
    getAllArticleInUser()
  }
}, {
  immediate: true, // 立即执行一次回调以检查初始值
});

//***DOM挂载完毕
onMounted(() => {


})
//***销毁组件
onUnmounted(() => {
})

//***定义Expose暴露自己的属性方法
const exposeName = ref(null)
defineExpose({
  exposeName,
  getAllArticleInUser
})
</script>

<style scoped lang="scss"></style>
