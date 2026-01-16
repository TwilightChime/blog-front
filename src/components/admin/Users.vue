<template>
  <div>
    <el-card shadow="never">
      <el-row :gutter="5">
        <el-col :span="8">
          <el-input placeholder="请输入用户名或用户昵称" v-model="inputUser"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click="searchUser()">查找用户</el-button>
        </el-col>
      </el-row>
      <el-table :data="userList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="头像" prop="avatar" min-width="60px">
          <template #default="props">
            <el-avatar :src="props.row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="昵称" prop="nickname"></el-table-column>
        <el-table-column label="账号" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email" min-width="100px"></el-table-column>
        <el-table-column label="注册时间" prop="createTime" min-width="100px">
          <template #default="props">{{ props.row.createTime | dataFormat }}</template>
        </el-table-column>
        <el-table-column label="最近登录" prop="loginTime">
          <template #default="props">{{ props.row.lastLoginTime === null ? props.row.createTime : props.row.lastLoginTime | dataFormat3 }}</template>
        </el-table-column>
        <el-table-column label="地址">
          <template #default="props">{{ props.row.loginProvince + ' ' + props.row.loginCity }}</template>
        </el-table-column>
        <el-table-column label="管理员" min-width="70px">
          <template #default="props">
            <el-switch
              active-value="1"
              inactive-value="0"
              v-model="props.row.type"
              :disabled="userInfo.id == props.row.id || props.row.id == 1"
              @change="userStateChange(props.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="60px">
          <template #default="props">
            <el-button size="small" circle type="danger" :icon="Delete" @click="deleteUser(props.row.id)"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script setup>
import { authApi } from '@/api/auth';
import { useCounterStore } from '@/stores/counter';
import { Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus';
import { onMounted, ref } from 'vue';

const userList = ref([])
const inputUser = ref('')
const stores = useCounterStore()
const userInfo = ref(stores.userInfo)

const getUserList = async () => {
  const {data: res} = await authApi.getUserList()
  if (res.code === 200) {
    if (inputUser.value !== '') {
      let st = inputUser.value
      let reg = RegExp(st)
      res.data = res.data.filter((item) => {
        return reg.test(item.nickname) || reg.test(item.username)
      })
    }
    userList.value = res.data
  } else {
    ElMessage.error('got userInfo fault')
  }
}

const searchUser = () => {
  if(inputUser) {
    getUserList()
  }
}

const userStateChange = async (row) => {
  const {data: res} = await authApi.updataUser(row)
  if (res.code === 200) {
    return ElMessage.success('updata user access successly')
  } else {
    return ElMessage.error('error, updata fault')
  }
}

const deleteUser = (id) => {
  ElMessageBox.confirm(
    'delete user forever, continue or not',
    'warning',
    {
      confirmButtonText: 'confirm',
      cancelButtonText: 'cancel',
      type: 'warning'
    }
  ).then(async () => {
    const {data: res} = await authApi.delUser(id)
    if (res.code === 200) {
      getUserList()
      return ElMessage.success('delete user successly')
    } else {
      return ElMessage.error('delete user defaultly')
    }
  }).catch(err => err)
}

onMounted(() => {
  getUserList()
})
</script>
