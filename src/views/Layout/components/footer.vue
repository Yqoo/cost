<template>
  <div class="footer">
    <el-row>
      <el-col :span="8">
        版本号：{{ footerInfo.version }}
      </el-col>
      <el-col :span="8">
        软件过期时间：{{ footerInfo.expire }}
      </el-col>
      <el-col :span="8">
        挚友公司： {{ footerInfo.company }}
      </el-col>
    </el-row>
  </div>
</template>

<script>

export default {
  name: 'Footer',
  data() {
    return {}
  },
  computed: {
    footerInfo() {
      return JSON.parse(localStorage.getItem('footerInfo'))
    }
  }
}
</script>

<style lang="scss" scoped>
  .footer {
    position: fixed;
    bottom: 0px;
    width: 100%;
    border-top: 1px solid #ddd;
    height: 40px;
    line-height: 40px;
    padding: 0px 20px;
  }
</style>
