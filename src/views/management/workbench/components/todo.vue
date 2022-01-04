<template>
  <div class="right-outer-box">
    <div class="title">
      <img :src="require('@/assets/images/icon/dbsx.png')" alt="">
      <span>待办事项</span>
      <el-button
        type="primary"
        size="mini"
        icon="el-icon-circle-plus"
        style="float: right;margin-right: 20px;"
        @click="todo.visible = true"
      />
    </div>
    <div class="right-top-box">
      <ul>
        <li v-for="(item, index) in todolist" :key="index">
          <span v-tooltip="item.desc">{{ item.desc }}</span>
          <span>{{ item.date }}</span>
          <span>{{ item.time }}</span>
        </li>
      </ul>
      <div>
        <i v-show="todo.current >= 1" class="el-icon-arrow-left" @click="todoPage('reduce')" />
        <span>{{ todo.current + 1 }}</span>
        <i v-show="showRightArrow" class="el-icon-arrow-right" @click="todoPage('add')" />
      </div>
    </div>
    <div class="title">
      <img :src="require('@/assets/images/icon/tzfw.png')" alt="">
      <span>通知发文</span>
    </div>
    <div class="right-middle-box">
      <h3>{{ hours }}</h3>
      <h4>
        <!-- Use Launchpad to start something new, pick up where you left off,
        or explore some resources to help you master Postman. -->
      </h4>
    </div>
    <!-- 添加待办 -->
    <el-dialog
      v-dialogDrag
      :visible.sync="todo.visible"
      :modal="false"
      width="30%"
      :close-on-click-modal="false"
    >
      <div slot="title">
        <span>添加待办</span>
      </div>
      <div slot="footer">
        <el-button type="info" size="mini" @click="todo.visible = false">
          取消
        </el-button>
        <el-button type="primary" size="mini">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      todo: {
        list: [],
        current: 0,
        size: 4,
        visible: false
      }
    }
  },
  computed: {
    todolist() {
      const { list, current, size } = this.todo
      return list.slice(current * size, current * size + size)
    },
    showRightArrow() {
      const { list, current, size } = this.todo
      return current < Math.ceil(list.length / size) - 1
    },
    hours() {
      const h = new Date().getHours()
      return ''
    }
  },
  methods: {
    todoPage(type) {
      this.todo.current = type === 'reduce' ? this.todo.current - 1 : this.todo.current + 1
    }
  }
}
</script>

<style lang='scss' scoped>
  .right-top-box {
    height: 202px;
    ul {
      height: 90%;
      overflow-y: auto;
      li {
        height: 30px;
        line-height: 30px;
        display: flex;
        justify-content: space-around;
        cursor: pointer;
        & :first-child {
          width: 30%;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      li:hover {
        color: #4390de;
      }
    }
    div {
      text-align: right;
      padding-right: 30px;
      i { cursor: pointer; }
      span {
        color: #4390de;
        font-weight: bold;
        font-size: 13px;
        padding: 0px 5px;
      }
    }
  }
  .right-middle-box {
    padding: 10px;
    h3 {
      font-weight: bold;
      font-size: 14px;
    }
  }
  .title {
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    padding: 5px 0px 5px 10px;
    img {
      width: 32px;
      height: 32px;
      vertical-align: middle;
    }
    span {
      font-weight: bold;
      font-size: 13px;
      padding-left: 10px;
    }
  }
</style>
