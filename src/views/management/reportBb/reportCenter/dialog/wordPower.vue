<template>
  <div class="wordPower">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="30%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title" class="title">
        <span>文档权限</span>
        <span>当前账号：{{ userName ? userName : '未登录' }}</span>
      </div>
      <div class="main">
        <div class="image">
          <img :src="require('@/assets/images/middleImg/bbsj.png')" alt="">
          <p>{{ bbList.name }}</p>
        </div>
        <div class="protect">
          <p>
            <span>私密文档保护</span>
            <span> {{ isProtect ? '保护中' : '未保护' }} </span><br>
            <span>开启后，登录我的账号可查看/编辑文档</span>
          </p>
          <p>
            <el-switch
              v-model="isProtect"
            />
          </p>
        </div>
        <div class="appoint">
          <p>
            <span>指定人</span><br>
            <span>
              添加后，仅指定人可查看/编辑文档
            </span>
          </p>
          <p @click="addNominator">
            <i class="el-icon-user" />
            <span>添加指定人</span>
          </p>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'WordPower',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    bbList: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isProtect: false
    }
  },
  computed: {
    userName() {
      const name = localStorage.getItem('userName')
      return name
    }
  },
  methods: {
    addNominator() { // 添加指定人
      console.log(1)
    }
  }
}
</script>

<style lang="scss" scoped>
.wordPower {
  .title {
    display: flex;
    span {
      flex: 1;
    }
  }
  .main {
    padding: 10px;
    .image {
      background: #FCF7F6;
      padding: 10px;
      display: flex;
      align-items: center;
      img {
        width: 60px;
        height: 59px;
      }
      p {
        margin-left: 10px;
        color: #000;
        font-size: 15px;
      }
    }
    .protect {
      display: flex;
      justify-content: space-between;
      margin: 30px 0;
      align-items: center;
      position: relative;
      p {
        & span:nth-child(1) {
          font-size: 16px;
          color: #000;
        }
        & span:nth-child(2) {
          position: absolute;
          display: inline-block;
          border: 1px solid red;
          padding: 0px 10px;
          color: red;
          border-radius: 3px;
          margin-left: 15px;
          top: -2px;
        }
      }
    }
    .appoint {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 30px 0;
      & p:nth-child(1) {
        & span:nth-child(1) {
          color: #000;
          font-size: 16px;
        }
      }
      & p:nth-child(2) {
        border: 1px solid #ddd;
        padding: 5px 8px;
        border-radius: 8px;
        color: #000;
        i {
          margin-right: 3px;
        }
      }
    }
  }
}
</style>
