<!--
 * @Author: TwilightChime 403685461@qq.com
 * @Date: 2026-01-26 15:50:37
 * @LastEditors: TwilightChime 403685461@qq.com
 * @LastEditTime: 2026-02-12 14:45:44
 * @FilePath: \blog-front\src\components\admin\charts\BoxCard.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-card class="box-card-component" style="margin-left: 8px; margin-top: 14px" shadow="hover">
    <div slot="header" class="box-card-header">
      <img :src="IMG.BASE_URL+'93d8f36e-dbd5-48b0-bab0-3a145703efef..png'" />
    </div>
    <div style="position: relative">
      <div style="padding-top: 35px" class="progress-item">
        <span>Vue</span>
        <el-progress :percentage="70" />
      </div>
      <div class="progress-item">
        <span>JavaScript</span>
        <el-progress :percentage="18" />
      </div>
      <div class="progress-item">
        <span>CSS</span>
        <el-progress :percentage="12" />
      </div>
      <div class="progress-item">
        <span>ECharts</span>
        <el-progress :percentage="5" />
      </div>
    </div>
  </el-card>
</template>

<script setup>
import { IMG } from '@/utils/constants';


</script>

<style scoped>
.box-card-component {
  .el-card__header {
    padding: 0 !important;
  }
}
</style>

<style scoped>
.box-card-component {
  .box-card-header {
    position: relative;
    height: 235px;
    img {
      height: 100%;
      transition: all 0.2s linear;
      &:hover {
        transform: scale(1.1, 1.1);
        filter: contrast(130%);
      }
    }
  }
  .mallki-text {
    position: absolute;
    top: 0px;
    right: 0px;
    font-size: 20px;
    font-weight: bold;
  }
  .panThumb {
    z-index: 100;
    height: 70px !important;
    width: 70px !important;
    position: absolute !important;
    top: -45px;
    left: 0;
    border: 5px solid #ffffff;
    background-color: #fff;
    margin: auto;
    box-shadow: none !important;
    ::v-deep .pan-info {
      box-shadow: none !important;
    }
  }
  .progress-item {
    margin-bottom: 10px;
    font-size: 14px;
  }
  @media only screen and (max-width: 1510px) {
    .mallki-text {
      display: none;
    }
  }
}
</style>
