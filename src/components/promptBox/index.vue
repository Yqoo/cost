<template>
  <el-dialog
    v-dialogDrag
    :modal="false"
    width="40%"
    :visible.sync="show"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
    :before-close="() => $emit('update:show', false)"
  >
    <div slot="title">
      {{ titleName }}
    </div>
    <div class="testBox">
      <div v-if="status === ''" class="success">
        <i class="el-icon-loading" />
        <p>{{ titleName }}进行中......</p>
      </div>
      <div v-else-if="status === 'success'" class="success">
        <i class="el-icon-success" />
        <p>{{ titleName }}成功</p>
        <p v-if="!!id" class="edit" @click="toCheck">
          查看结果
        </p>
      </div>
      <div v-else class="fail">
        <i class="el-icon-error" />
        <p>{{ titleName }}失败</p>
        <p class="errMsg">
          {{ errMsg }}
        </p>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'PromptBox',
  props: {
    id: {
      type: String,
      default: ''
    },
    show: {
      type: Boolean,
      default: false
    },
    titleName: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      default: 'success'
    },
    errMsg: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    toCheck() {
      this.$emit('send', '')
    }
  }
}
</script>

<style lang="scss" scoped>
.testBox{
  width:100%;
  min-height: 200px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  i{
    font-size:50px;
    margin-bottom: 14px;
  }
  .el-icon-loading{
    color:#1295DB;
  }
  .el-icon-success{
    color:green;
  }
  .el-icon-error{
    color:red;
  }
  p{
    line-height: 30px;
    text-align: center;
  }
  .errMsg{
      color:red;
  }
  .success,.fail{
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  .edit{
    cursor: pointer;
    color:#1295DB;
  }
}
</style>
