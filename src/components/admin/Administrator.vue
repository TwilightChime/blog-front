<template>
  <div>
    <el-card shadow="hover" style="text-align: left;margin-bottom: 10px">
      <div class="header">
        <div class="avatar-area">
          <el-image class="avatar" :src="userInfo.avatar"></el-image>
          <div class="avatar-upload" @click="dialogVisible = true">
            <el-image class="camera" :src="avatarUpload"></el-image>
          </div>
        </div>
        <div class="info">
          <h1 class="nickname">{{ userInfo.nickname }}<span class="change-password" @click="changePassword">修改密码</span>
          </h1>
          <p class="email">{{ userInfo.email }}</p>
        </div>
      </div>
    </el-card>
    <el-card shadow="hover">
      <h1 class="el-card__header" style="text-align: left;margin: 0">基本信息</h1>
      <el-form :data="userFrom" label-width="100px" label-position="left"
        style="text-align: left;width: 80%;margin-left: 30px;margin-top: 20px">
        <el-form-item label="用户类型">
          <div style="margin-left: 10px">{{ userInfo.type == 1 ? '管理员' : '普通用户' }}</div>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userFrom.nickname"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userFrom.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userFrom.email"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="changeUserInfo">提交修改</el-button>

    </el-card>
    <el-dialog style="z-index: 20000" title="上传头像" v-model="dialogVisible">
      <el-upload v-if="uploading" class="avatar-uploader" action="http://localhost:8090/upload" :show-file-list="false"
        :on-success="handleAvatarSuccess">
        <img v-if="imageUrl" :src="imageUrl" class="new-avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="setAvatar()">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { useCounterStore } from '@/stores/counter';
import { IMG } from '@/utils/constants';
import { onMounted, reactive, ref } from 'vue';

const userInfo = useCounterStore().userInfo
const avatarUpload = ref('')
const userFrom = reactive({
  nickname: '',
  username: '',
  email: ''
})
const dialogVisible = ref(false)

onMounted(() => {
  getUserInfo()
})

const getUserInfo = () => {
  Object.assign(userFrom, Object.fromEntries(Object.entries(userFrom).map(([k, val]) => [k, userInfo[k] ? userInfo[k] : val])))
}

const changePassword = () => {

}

const changeUserInfo = () => {

}


</script>

<style scoped>
.avatar {
  width: 100px;
  height: 100px;
  border: 2px solid white;
  box-shadow: 0 0 10px 2px rgba(0, 0, 0, .06);
  border-radius: 50%;
  box-sizing: border-box;
}

.avatar-upload {
  background-color: rgba(0, 0, 0, 0.15);
  z-index: 10000;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
}

.camera {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

.avatar-upload:hover {
  opacity: 1;
  cursor: pointer;
}

.header {
  display: flex;
  justify-content: flex-start;

  .avatar-area {
    width: 100px;
    position: relative;
    margin-right: 20px;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  border: 2px dashed #d9d9d9;
  border-radius: 20px;
}

.new-avatar {
  width: 120px;
  height: 120px;
  display: block;
}

.change-password {
  color: #3a8ee6;
  font-size: 12px;
  margin-left: 10px;
  font-weight: normal;
}

.change-password:hover {
  cursor: pointer;
}
</style>