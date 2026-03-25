<template>
  <el-form :model="replyForm" :rules="replyFormRules" ref="replyFormRef">
      <el-form-item prop="content" style="margin-bottom: 2px">
          <el-input v-model="replyForm.content" type="textarea" placeholder="请输入内容"
                    autosize></el-input>
      </el-form-item>
      <el-form-item style="text-align: right; margin-bottom: 2px">
          <el-button size="small" @click="quit">取消</el-button>
          <el-button size="small" type="primary" @click="reply()"> 回复</el-button>
      </el-form-item>
  </el-form>
</template>

<script setup>

</script>

<style scoped>

</style>