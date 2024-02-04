<template>
  <div>
    <a-page-header title="传世大作" sub-title="思维点滴" class="pb-0" @back="() => $router.go(-1)">
      <template #tags>
        <a-tag color="blue">灵感迸发</a-tag>
      </template>
      <template #extra>

        <a-button key="1" type="primary" @click="publishArticle" :loading="isPublishDone">发布</a-button>
      </template>
      <a-row class="mb-6">
        <a-col :span="4">
          <div class="w-[80%] h-full max-h-[162px]">
            <a-upload
                v-model:file-list="fileList"
                name="formFile"
                list-type="picture-card"
                class="avatar-uploader  cover-style"
                :show-upload-list="false"
                :max-count="1"
                :action="`http://www.hellomylove.love:81/Login/UpLoadFile`"
                :before-upload="beforeUpload"
                @change="handleChange"
            >
              <img v-if="cover" :src="cover" class="w-full rounded-md" alt="avatar"/>
              <div v-else>
                <loading-outlined v-if="loading"></loading-outlined>
                <plus-outlined v-else></plus-outlined>
                <div class="ant-upload-text">封面</div>
              </div>
            </a-upload>
          </div>
        </a-col>
        <a-col :span="16" offest="1">
          <a-textarea
              v-model:value="title"
              placeholder="给您的大作起一个名字吧"
              auto-size
          />
          <div class="mt-3"/>
          <a-textarea
              v-model:value="description"
              placeholder="添加一点点描述，方便快速理解您的传世大作"
              :auto-size="{ minRows: 3, maxRows: 5 }"
          />
          <div class="flex mt-3">
            <a-tag  v-for="tag in tags" :key="tag.tagID" :color="tag.color" :bordered="false" :closable="isCloseTag" @close="handleClose(tag)" class="leading-[30px]">{{ tag.content }}</a-tag>
            <a-input class="w-32" :class="{'mx-3':tags.length > 0,'mr-3':tags.length === 0}" v-if="isInputTag" v-model:value="inputTagValue" placeholder="标记"  @keyup.enter.native="handleInputConfirm"
                     @blur="handleInputConfirm" />
            <a-button type="primary" @click="showInput">
              <template #icon>
                <PlusOutlined />
              </template>
              添加标记
            </a-button>
          </div>
        </a-col>
      </a-row>
      <v-md-editor v-model="mdText" height="calc(100vh - 266px)"></v-md-editor>
    </a-page-header>
  </div>
</template>

<script setup>
import {computed, h,getCurrentInstance, onMounted, onUnmounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {getRandomColor,getRandomElementFromArray,guid} from '@/utils'
import {PlusOutlined}  from '@ant-design/icons-vue';
import AuthorService from '@/api/index.js'
import { useUserInfoStore } from '@/store'
//***路由对象
const route = useRoute()
//***路由实例
const router = useRouter();
//***获取上下文对象
const {proxy} = getCurrentInstance()
const {$notification} = getCurrentInstance().appContext.config.globalProperties;

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
const computedName = computed(() => {
})

//***方法、数据
let blogID = guid()
//标题
const title = ref('')
//描述
const description = ref('')

//标签
let tags = reactive([])
const isCloseTag = ref(true)
const isInputTag = ref(false)
const inputTagValue = ref('')
//移除tag
const handleClose = tag => {
  const index = tags.findIndex(item => item.tagID === tag.tagID);
  if(index > -1){
    tags.splice(index, 1);
  }
}
//添加tag
const colorArray = reactive(['pink','red','orange','green','cyan','blue','purple','processing','success','error','warning',
'magenta','red','volcano','gold','lime','geekblue'])
const handleInputConfirm = () => {
  if (inputTagValue.value) {
    const index = tags.findIndex(item => item.content === inputTagValue.value);
    if(index > -1){
      $notification.open({
        message: '警告',
        type:'warning',
        description:'此标记已存在',
        placement:'bottomRight'
      });
    }else{
      tags.push({
        tagID:guid(),
        content:inputTagValue.value,
        blogID,
        color:getRandomElementFromArray(colorArray)
      });
    }
    inputTagValue.value = ''
  }
  isInputTag.value = false;
}
const showInput = () => {
  isInputTag.value = true
}
//封面
const cover = ref('')


let fileList = ref([]);
const loading = ref(false);
const handleChange = info => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    cover.value = info.file.response.pictureName
    loading.value = false;
  }
  if (info.file.status === 'error') {
    loading.value = false;
    $notification.open({
      message: '错误',
      type: 'error',
      description: 'upload error',
      placement: 'bottomRight'
    });
  }
};
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    $notification.open({
      message: '错误',
      type: 'error',
      description: '只能上传 JPG或PNG 文件!',
      placement: 'bottomRight'
    });
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    $notification.open({
      message: '错误',
      type: 'error',
      description: '图片必须小于 2MB!',
      placement: 'bottomRight'
    });
  }
  return isJpgOrPng && isLt2M;
};

//富文本
const mdText = ref('')

//发布文章
const isPublishDone = ref(false)
const userInfoStore = useUserInfoStore()
import { Button } from 'ant-design-vue';
//校验函数
const publishPost = () => {
  let notificationMessage = '';
  if (!cover.value) {
    notificationMessage = '小主，请给您的大作选取一张迷死人的照片';
  } else if (!title.value) {
    notificationMessage = '小主，给您的大作起一个高大上的名称再发布吧';
  } else if (!mdText.value.trim()) {
    notificationMessage = '小主,写点内容吧,不然别人会懵逼的';
  }
  return notificationMessage

  if (notificationMessage) {
    $notification.open({
      message: '警告',
      type: 'warning',
      description: notificationMessage,
      placement: 'bottomRight'
    });
    isPublishDone.value = false;
  } else {
    isPublishDone.value = true;
    // 这里可以放置发布文章的代码
  }
}
const publishArticle = async () => {
  if(isPublishDone.value) return
  isPublishDone.value = true
  const isInfo = publishPost()
  if(isInfo){
    $notification.open({
      message: '警告',
      type: 'warning',
      description: isInfo,
      placement: 'bottomRight'
    });
    isPublishDone.value = false
    return
  }


  const articleInfos = {
    blogID,
    title:title.value,
    tags,
    description:description.value,
    cover:cover.value,
    content:mdText.value,
    authorID:userInfoStore.userInfo.author.id,
    lastModified:new Date(),
    views:0,
    likes:0,
    approved:true
  }
  try {
    const {message,state} = await AuthorService.publishArticle(articleInfos)
    if(state !== 1){
      $notification.open({
        message: '错误',
        type:'error',
        description:message,
        placement:'bottomRight'
      });
      isPublishDone.value = false
      return
    }
    isPublishDone.value = false
    const key = `open${Date.now()}`;
    await $notification.open({
      message: '成功',
      type:'success',
      description:message,
      placement:'bottomRight',
      btn: () =>
          h(
              Button,
              {
                type: 'primary',
                size: 'small',
                onClick: () => closePage(),
              },
              {
                default: () => '继续编辑',
              },
          ),
      key,
      onClose: close,
    });
    isImplementation.value = true
    startTimer()
  }catch(e){
    console.log(e)
    isPublishDone.value = false
  }
}
const timerId = ref(null); // 用来存储定时器ID
const isImplementation = ref(false)
// 设置定时器
const startTimer = () => {
  timerId.value = setTimeout(() => {
    // 你可以在这里执行你的逻辑
    if(isImplementation.value){
      back()
    }
  }, 3000); // 假设3秒后触发
};

// 清除定时器的函数
const clearTimer = () => {
  if (timerId.value) {
    clearTimeout(timerId.value);
  }
};

//清空当前页面
const closePage = () =>{
  blogID = guid()
  title.value = ''
  description.value = ''
  tags = []
  inputTagValue.value = ''
  isInputTag.value = false
  fileList.value = []
  cover.value = ''
  mdText.value = ''

  isImplementation.value = false
  // 如果条件立即改变，我们需要在此清除定时器
  clearTimeout(timerId.value);

}
//返回上一页
const back = () => {
  router.go(-1)
}

// 定义关闭通知的函数
const closeNotification = () => {
  $notification.destroy();
};

//***监听普通数据，多个属性，要用数组包起来[attributes1,attributes2]
//watch(attributes, (newVal, oldVal) => {
//}, {})

//***监听引用数据类型对象中的某个值，多个值，写法还是以函数返回的形式。但是多个属性，要用数组包起来[() =>obj.attributes1,() =>obj.attributes2]
//watch(() => obj.attributes, (newVal, oldVal) => {
//}, {})

//***DOM挂载完毕
onMounted(() => {
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

<style scoped lang="scss">
.cover-style {
  height: 100%;

  ::v-deep .ant-upload {
    width: 100% !important;
    height: 100% !important;
    overflow: hidden;
  }
}

</style>
