<!--主广场-->

<template>
  <!-- top -->
  <div class="py-3 px-6  border-solid border-x-0 border-t-0 border-b-[1px] border-indigo-500">
    <a-row class="items-center ">
      <a-col :span="4" class="flex justify-end">
        <div class="w-12 h-12 mr-3 border border-solid border-indigo-500/100 rounded-full text-center leading-[42px]">
          logo
        </div>
      </a-col>
      <a-col :span="12">
        <a-input-search
            v-model:value="searchValue"
            size="large"
            placeholder="input search text"
            enter-button
            @search="onSearch"
        />
      </a-col>
      <a-col :span="8" class="pl-3 flex items-center">
        <a-dropdown :trigger="['click']">
          <a class="ant-dropdown-link" @click.prevent>
            <span v-if="!isLogin"
                class="w-12 h-12 inline-block mr-3 border border-solid border-indigo-500/100 rounded-full text-center leading-[42px]">登录</span>
            <a-avatar v-else :size="{ xs: 12, sm: 16, md: 20, lg: 32, xl: 40, xxl: 50 }" :src="userInfo.pictureUrl">
              <template #icon>
                <AntDesignOutlined />
              </template>
            </a-avatar>
            <DownOutlined/>
          </a>
          <template #overlay>
            <a-menu>
              <a-menu-item key="0">
               <span @click.prevent="signOut">退出登录</span>
              </a-menu-item>

            </a-menu>
          </template>
        </a-dropdown>
        <a-button type="link">
          <template #icon>
            <HomeTwoTone/>
          </template>
          小树洞
        </a-button>
        <a-button type="link" @click="goRouter('createArticle')">
          <template #icon>
            <EditTwoTone/>
          </template>
          写文章
        </a-button>
        <a-button type="link">
          <template #icon>
            <AppstoreTwoTone/>
          </template>
          站点管理系统
        </a-button>
      </a-col>
    </a-row>
  </div>
  <!-- content -->
  <a-row class="px-6 py-3">
    <a-col :span="4">
      <a-card hoverable>
        <template #cover>
          <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        </template>
        <template #actions>
          <setting-outlined key="setting" class="!leading-[34px]"/>
          <a-badge :count="bloginfo?bloginfo.blogs:0" :title="`哇，小主您已经写了这么5篇文章了呦`">
            <a-button type="link" class="py-0 px-2">
              我的文章
            </a-button>
          </a-badge>
          <a-badge :count="bloginfo?bloginfo.views:0" title="快去看看谁浏览小主写的大作了吧">
            <a-button type="link" class="py-0 px-2">
              浏览数
            </a-button>
          </a-badge>
          <a-badge :count="bloginfo?bloginfo.likes:0" title="快去看看谁给小主点赞了吧">
            <a-button type="link" class="py-0 px-2">
              点赞数
            </a-button>
          </a-badge>

        </template>
        <a-card-meta :title="isLogin?userInfo.name:'UserName'" :description="isLogin?userInfo.introduction:'还未详细的介绍自己哦'">
          <template #avatar>
            <a-avatar :src="isLogin?userInfo.pictureUrl:'头像'"/>
          </template>
        </a-card-meta>
      </a-card>
    </a-col>
    <a-col :span="20" class="px-6">
      <a-tabs v-model:activeKey="activeKey" @tabClick="handleContentTab">
        <a-tab-pane v-for="item in contentTabs" :key="item.ID">
          <template #tab>
            <span>
              <apple-outlined/>
              {{item.Name}}
            </span>
          </template>
        </a-tab-pane>
      </a-tabs>
      <template v-for="i in componentTas" :key="i.ID">
        <keep-alive>
          <component :is="dom[i.Component]" :Name="i.Name" v-if="i.ID === activeKey" :ref="`article${i.ID}`"></component>
        </keep-alive>
      </template>
    </a-col>
  </a-row>


</template>


<script setup>
import {computed, getCurrentInstance, nextTick, onMounted, onUnmounted, reactive,watch, ref, shallowReactive} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {AppstoreTwoTone, EditTwoTone, HomeTwoTone, SettingOutlined} from '@ant-design/icons-vue';
import AuthorService from '@/api/index.js'
import { useUserInfoStore } from '@/store'
const { $notification } = getCurrentInstance().appContext.config.globalProperties;

import {guid} from '@/utils'
//***路由对象
const route = useRoute()
//***路由实例
const router = useRouter();
//***获取上下文对象
const {proxy} = getCurrentInstance()

//***定义props接收父组件传值
const props = defineProps({
  propsName: {
    type: Object,//接收类型
    default: () => {
      return {} || []//默认值
    }
  }
})

//***定义Emits
const emits = defineEmits(['voidName'])

//***定义计算属性
// const userInfo = computed(() => {
//     return userInfoStore.userInfo.author
// })

//***方法、数据

//获取用户信息
const userInfoStore = useUserInfoStore()
const isLogin = computed(() => {
  return userInfoStore.isLogin
})

const valueExists = (obj, valueToFind) => {
  return Object.values(obj).includes(valueToFind);
}
const userInfo = computed(() => {
    return userInfoStore.userInfo.author
})
const bloginfo = computed(() => {
  return userInfoStore.userInfo.bloginfo
})
const article1 = ref(null)
const getUserInfo = async () => {
  try {
    if(valueExists(userInfoStore.userInfo,'author')) return
    const {state,Message,result:{author,bloginfo}} = await AuthorService.userInfos()

    if(state !== 1){
      $notification.open({
        message: '错误',
        type:'error',
        description:Message,
        placement:'bottomRight'
      });
    }
    await userInfoStore.setUserInfo({author,bloginfo})
    // nextTick(() => {
    //   console.log(article1.value,'article1')
    //   article1.value.getAllArticleInUser()
    // })
  }catch(e){
    console.log(e)
  }

}

//退出登录
const signOut = () => {
  userInfoStore.setUserInfo({})
  userInfoStore.setIsLogin(false)
  localStorage.removeItem('Authorization')
  router.push('/login');
}

//搜索
const searchValue = ref('');
const onSearch = searchValue => {
  console.log('use value', searchValue);
  console.log('or use this.value', searchValue.value);
};

//跳转写文章
const goRouter = (key) => {
  switch (key){
    case 'createArticle':
      router.push(`/home/${key}`)
  }
}


//content tabs
const activeKey = ref('1');
const contentTabs = reactive([
  {
    Name: '广场',
    ID: '1',
  },
  {
    Name: '我的文章',
    ID: guid(),
  },
  {
    Name: '喜欢',
    ID: guid(),
  },
  {
    Name: '评论',
    ID: guid(),
  },
  {
    Name: '关注',
    ID: guid(),
  },
  {
    Name: '黑名单',
    ID: guid(),
  }
])
import Article from '@/components/Page/Article'
const dom = shallowReactive({
  Article
})
const handleContentTab = (key,event) =>{
  const activeTab = contentTabs.filter(i => i.ID === key)
  const exists = componentTas.some(obj => obj.ID === key);
  if(!exists){
    componentTas.push({
      ID:key,
      Name:activeTab[0].Name,
      Component:'Article',
    })
  }
}

const componentTas = reactive([{
  ID:'1',
  Name:'广场',
  Component:'Article',
}])



//***监听普通数据，多个属性，要用数组包起来[attributes1,attributes2]
//watch(attributes, (newVal, oldVal) => {
//}, {})

//***监听引用数据类型对象中的某个值，多个值，写法还是以函数返回的形式。但是多个属性，要用数组包起来[() =>obj.attributes1,() =>obj.attributes2]
watch(() => userInfoStore.userInfo, (newVal, oldVal) => {
    userInfoStore.setIsLogin(!!newVal.author.id)
}, {})

//***DOM挂载完毕
onMounted(async() => {
  await getUserInfo()
})
//***销毁组件
onUnmounted(() => {
})

//***定义Expose暴露自己的属性方法
const exposeName = ref(null)
defineExpose({
  exposeName
})
</script>

<style scoped lang="scss"></style>
