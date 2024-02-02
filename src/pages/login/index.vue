

<template>
  <div class="flex justify-center login-container ">
    <!--  登录 -->
    <a-form
        :model="loginForm"
        name="basic"
        :label-col="{ span: 8 }"
        autocomplete="off"
        class="login-form w-2/5"
        v-if="isLogin"
    >
      <a-form-item
          label="用户名"
          name="userName"
          v-bind="validateLoginInfos.userName"
      >
        <a-input v-model:value="loginForm.userName" />
      </a-form-item>

      <a-form-item
          label=" 密码"
          name="passWord"
          v-bind="validateLoginInfos.passWord"
      >
        <a-input-password v-model:value="loginForm.passWord" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 12, span: 16 }">
        <a-button type="primary" @click.prevent="onLoginSubmit">提交</a-button>
        <a-button style="margin-left: 10px" @click="resetLoginFields">取消</a-button>
        <a-button style="margin-left: 10px" @click="goRegister">去注册</a-button>
      </a-form-item>
    </a-form>
    <!--  注册 -->
    <a-form
        :model="resisterForm"
        name="basic"
        :label-col="{ span: 8 }"

        autocomplete="off"
        class="login-form w-2/5"
        v-if="isRegister"
    >
      <a-form-item
          label="头像"
          name="PictureUrl"
          v-bind="validateRegisterInfos.PictureUrl"
      >
        <a-upload
            v-model:file-list="fileList"
            name="formFile"
            list-type="picture-card"
            class="avatar-uploader"
            :show-upload-list="false"
            :max-count="1"
            :action="`http://www.hellomylove.love:81/Login/UpLoadFile`"
            :before-upload="beforeUpload"
            @change="handleChange"
        >
          <img v-if="resisterForm.PictureUrl" :src="resisterForm.PictureUrl" alt="avatar" />
          <div v-else>
            <loading-outlined v-if="loading"></loading-outlined>
            <plus-outlined v-else></plus-outlined>
            <div class="ant-upload-text">Upload</div>
          </div>
        </a-upload>
      </a-form-item>
      <a-form-item
          label="用户名"
          name="Name"
          v-bind="validateRegisterInfos.Name"
      >
        <a-input v-model:value="resisterForm.Name" />
      </a-form-item>

      <a-form-item
          label="密码"
          name="PassWord"
          v-bind="validateRegisterInfos.PassWord"
      >
        <a-input-password v-model:value="resisterForm.PassWord" />
      </a-form-item>

      <a-form-item :wrapper-col="{ offset: 12, span: 16 }">
        <a-button type="primary" @click.prevent="onRegisterSubmit">提交</a-button>
        <a-button style="margin-left: 10px" @click="resetRegisterFields">取消</a-button>
        <a-button style="margin-left: 10px" @click="goLogin">返回登录</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>


<script setup>
import {ref, reactive,toRaw, computed, watch, getCurrentInstance, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'

//接口对象
import AuthorService from '@/api/index.js'

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
const computedName = computed(() => {
})

//***方法数据

import { Form } from 'ant-design-vue';
const useForm = Form.useForm;
// ------------------登录 start------------------------
const isLogin = ref(true)
const loginForm = reactive({
  userName: '',
  passWord: ''
})

//校验
const loginRulesRef = reactive({
  userName: [
    {
      required: true,
      message: '请输入名称',
    },
  ],
  passWord: [
    {
      required: true,
      message: '请输入密码',
    }
  ],

});
const { resetFields:resetLoginFields, validate:validateLogin, validateInfos:validateLoginInfos } = useForm(loginForm, loginRulesRef, {
  onValidate: (...args) => {},
});

const onLoginSubmit = () => {
  validateLogin()
      .then(() => {

        console.log(toRaw(loginForm));
      })
      .catch(err => {
        // console.log('error', err);
      });
};

const goRegister = () => {
  isLogin.value = false
  isRegister.value = true
}
// ------------------登录 end------------------------

// ------------------注册 start------------------------
const isRegister = ref(false)
const resisterForm = reactive({
  ID:'',
  Account:'',
  Name:'',
  PassWord:'',
  PictureUrl:'',
})

//头像
import { message } from 'ant-design-vue';
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}
const fileList = ref([]);
const loading = ref(false);
const handleChange = info => {
  if (info.file.status === 'uploading') {
    loading.value = true;
    return;
  }
  if (info.file.status === 'done') {
    // Get this url from response in real world.
    getBase64(info.file.originFileObj, base64Url => {
      resisterForm.PictureUrl = base64Url;
      loading.value = false;
    });
  }
  if (info.file.status === 'error') {
    loading.value = false;
    message.error('upload error');
  }
};
const beforeUpload = file => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

//校验
const rulesRegisterRef = reactive({
  Name: [
    {
      required: true,
      message: '请输入用户名',
    },
  ],
  PassWord: [
    {
      required: true,
      message: '请输入密码',
    },
    {
      min: 6,
      max: 10,
      message: '密码长度在6~16个字符之间',
      trigger: 'blur'
    }
  ],

});
const { resetFields:resetRegisterFields, validate:validateRegister, validateInfos:validateRegisterInfos } = useForm(resisterForm, rulesRegisterRef, {
  onValidate: (...args) => {},
});
const onRegisterSubmit = () => {
  validateRegister()
      .then(async () => {
         const result = await AuthorService.registerUser(toRaw(resisterForm))
        console.log(result,toRaw(resisterForm));

      })
      .catch(err => {
        // console.log('error', err);
      });
};

const goLogin = () => {
  isLogin.value = true
  isRegister.value = false
}
// ------------------注册 end------------------------




//***监听普通数据，多个属性，要用数组包起来[attributes1,attributes2]

// watch(attributes, (newVal, oldVal) => {
// }, {})

//***监听引用数据类型对象中的某个值，多个值，写法还是以函数返回的形式。但是多个属性，要用数组包起来[() =>obj.attributes1,() =>obj.attributes2]

// watch(() => obj.attributes, (newVal, oldVal) => {
// }, {})

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
.login-container{
  height: 100vh;
  background: url('@/assets/login_images/background.jpg') center center fixed no-repeat;
  background-size: cover;
  position: relative;

  .login-form{
    position: absolute;
    top: 30%;
    right: 10%;
  }
}
.avatar-uploader > .ant-upload {
  width: 128px;
  height: 128px;
}
.ant-upload-select-picture-card i {
  font-size: 32px;
  color: #999;
}

.ant-upload-select-picture-card .ant-upload-text {
  margin-top: 8px;
  color: #666;
}

</style>
