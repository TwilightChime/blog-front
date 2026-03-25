<template>
  <el-card class="blog-card">
    <div slot="header" class="blog-header">
      <div class="user-info">
        <el-avatar size="small" :src="blog.user.avatar"></el-avatar>
        <a href="#" class="header">{{ blog.user.nickname }}</a>
      </div>
      <div class="date-info">
        <i class="el-icon-date"></i>
        <span>{{ blog.createTime }}</span>
      </div>
      <div>
        <i class="el-icon-view"></i>
        <span>{{ blog.views }}</span>
      </div>
    </div>
    <el-image class="blog-pic" :src="blog.firstPicture"></el-image>
    <hr />
    <h2 class="blog-title header">{{ blog.title }}
      <el-tag effect="plain" type="warning" style="font-weight: bold; font-size: small; margin-left: 20px">
        {{ blog.flag }}
      </el-tag>
    </h2>
    <div class="typo m-padded-lr-responsive m-padded-tb-large" v-html="blog.content" v-highlight></div>
    <div class="tags">
      <div class="tag-item" v-for="tag in blog.tags" :key="tag.id">
        <div class="sjx-outer">
          <div class="sjx-inner"></div>
        </div>
        <div class="tag">
          {{ tag.name }}
        </div>
      </div>
    </div>
    <div class="appreciate">
      <el-popover placement="bottom" title="" width="300" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
        <div class="give-money">
          <div class="give-money-item">
            <el-image :src="wechart" title="微信支付"></el-image>
            <p>微信</p>
          </div>
          <div class="give-money-item">
            <el-image :src="alipay" title="支付宝支付"></el-image>
            <p>支付宝</p>
          </div>
        </div>
        <el-button class="zanshang" slot="reference" type="danger" round plain>赞赏</el-button>
      </el-popover>
    </div>
    <div class="author">
      <ul>
        <li>作者 {{ blog.user.nickname }}</li>
        <li>发表时间 {{ blog.createTime }}</li>
      </ul>
    </div>
    <el-card shadow="never" class="comments">
      <div class="header">
        评论
      </div>
      <div v-for="cmt in rootCmtTree" :key="cmt.id">
        <comment :cmt="cmt" :parent-id="-1" :rp-active-id="rpActiveId"></comment>
        <reply style="margin-left: 40px" v-if="rpActiveId === cmt.id" :id="cmt.id" :blog-id="blog.id" v-on:quit="cancel"
          v-on:newCmt="replyComp"></reply>

        <span v-else class="reply" @click="rpActiveId = cmt.id">回复</span>
        <span v-if="administrator || userInfo && cmt.userId === userInfo.id" class="delete"
          @click="deleteComment(cmt.id)">删除</span>
        <div style="margin-left: 40px" v-for="rp in cmt.children" :key="rp.id">
          <comment :cmt="rp" :parent-id="cmt.id" :rp-active-id="rpActiveId"></comment>
          <reply style="margin-left: 40px" v-if="rpActiveId === rp.id" :id="rp.id" :blog-id="blog.id" v-on:quit="cancel"
            v-on:newCmt="replyComp"></reply>
          <span v-else class="reply" @click="rpActiveId = rp.id">回复</span>
          <span v-if="administrator || userInfo && rp.userId === userInfo.id" class="delete"
            @click="deleteComment(rp.id)">删除</span>
        </div>
      </div>
    </el-card>
    <el-form class="commmet-reply" :model="commentForm" :rules="commentFormRules" ref="commentFormRef">
      <el-form-item prop="content">
        <el-input v-model="commentForm.content" :validate-event="false" type="textarea" class="write-commmet" :rows="6">
        </el-input>
      </el-form-item>
      <div class="submit">
        <el-button prefix-icon="el-icon-submit" type="primary" class="item" @click="submitCmt()">
          <i class="el-icon-edit"></i> 提交
        </el-button>
      </div>
    </el-form>
  </el-card>
</template>
<script setup>
import { frontEndBlog } from '@/api/blog';
import Comment from '@/components/front-end/comment/Comment.vue'
import Reply from '@/components/front-end/comment/Reply.vue'
import { onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute()

const blog = ref({user: {}})
const commentForm = ref({content: {}})

onMounted(() => {
  getBlogInfo()
})

const getBlogInfo = async() => {
  const {data: res} = await frontEndBlog.getBlogInfo(route.query.id)
  console.log(res)
  blog.value = res.data

}

</script>
<style scoped>
.blog-card {
  width: 80%;
  margin-left: 10%;
  margin-top: 100px;
  padding: 5px 5px;
  background-color: rgba(255, 255, 255, 1);
}

.blog-header {
  display: flex;
  align-items: center;
  .user-info, .date-info {
    margin-right: 30px;
  }
}
</style>