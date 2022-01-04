<template>
  <div class="ProtectSheet">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="25%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ protect && psd ? '撤销工作表保护' : '保护工作表' }}
      </div>
      <div v-if="!protect">
        <div class="password">
          <span>密码：</span>
          <el-input v-model="password" size="mini" show-password />
        </div>
        <div class="list">
          <span>允许用户对工作表进行：</span>
          <div class="checkList">
            <el-checkbox-group v-model="checkList">
              <el-checkbox label="checkCell">
                选定单元格
              </el-checkbox>
              <el-checkbox label="edit">
                编辑对象
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div v-if="protect && psd">
        <span>密码：</span>
        <el-input v-model="repealPsd" size="mini" show-password />
      </div>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => this.$emit('update:show', false)">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="save">
          确定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-dialogDrag
      :visible.sync="surePsd.show"
      :model="false"
      width="20%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => surePsd.show = false"
    >
      <div slot="title">
        确认密码
      </div>
      <div>
        <span>重新输入密码：</span>
        <el-input v-model="surePsd.psd" size="mini" show-password />
      </div>
      <p class="warn">
        警告：密码一旦丢失或遗忘，将无法恢复，建议将密码及其相应的工作表名称的工作表保存在安全的地方（注意：密码区分大小写）
      </p>
      <div slot="footer">
        <el-button size="mini" type="info" @click="() => surePsd.show = false ">
          取消
        </el-button>
        <el-button size="mini" type="primary" @click="sure">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProtectSheet',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    protect: {
      type: Boolean,
      default: false
    },
    psd: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      password: '',
      repealPsd: '',
      checkList: [],
      surePsd: {
        show: false,
        psd: ''
      }
    }
  },
  methods: {
    save() { // 工作表
      if (this.password && !this.protect) this.surePsd.show = true
      else if (this.protect && this.psd) {
        if (this.repealPsd !== this.psd) {
          this.$alert('您所提供的密码不一致，请检查是否正确使用大小写', '提示', {
            confirmButtonText: '确定',
            callback: action => {}
          })
        } else {
          this.$emit('repeal')
          this.$emit('update:show', false)
        }
      } else if (!this.password && this.checkList.length !== 0) {
        this.$emit('setPsd', {
          psd: this.password,
          checkList: this.checkList
        })
        this.$emit('update:show', false)
      }
    },
    sure() { // 密码框
      if (this.password !== this.surePsd.psd) {
        this.$alert('两次密码输入不一致', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surePsd.show = false
          }
        })
      } else {
        this.$emit('setPsd', {
          psd: this.password,
          checkList: this.checkList
        })
        this.surePsd.show = false
        this.$emit('update:show', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ProtectSheet {
  .password {
    display: flex;
    align-items: center;
    span {
      width: 50px;
    }
  }
  /deep/ .el-dialog__body {
    min-height: 80px !important;
  }
  .list {
    margin-top: 10px;
    .checkList {
      margin-top: 5px;
      border: 1px solid #ddd;
      height: 120px;
      padding: 10px;
      overflow: auto;
    }
  }
  .warn {
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
