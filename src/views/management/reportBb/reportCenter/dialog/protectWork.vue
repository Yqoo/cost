<template>
  <div class="ProtectWork">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="15%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ protectWorkB ? '取消共享保护' : '保护共享工作簿' }}
      </div>
      <div v-if="protectWorkB" class="password">
        <span>密码：</span>
        <el-input v-model="password" size="mini" show-password />
      </div>
      <div v-else class="main">
        <p class="tips">
          <span>
            保护工作簿：用此方法可以共享工作簿，并避免丢失记录
          </span>
        </p>
        <div class="input">
          <p class="text">
            <span>
              如要设置密码，必须在此时进行
            </span>
          </p>
          <p class="psd">
            <span>密码：</span>
            <el-input v-model="psd" size="mini" show-password />
          </p>
        </div>
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
        <el-button size="mini" type="primary" @click="surepsd">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'ProtectWork',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    protectWorkB: {
      type: Boolean,
      default: false
    },
    surePswd: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      psd: '',
      password: '',
      surePsd: {
        psd: '',
        show: false
      }
    }
  },
  methods: {
    surepsd() {
      if (this.psd === this.surePsd.psd) {
        this.$emit('saveWorkB', this.surePsd.psd)
        this.surePsd.show = false
        this.$emit('update:show', false)
      } else {
        this.$alert('两次密码输入不一致', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            this.surePsd.show = false
          }
        })
      }
    },
    save() {
      if (!this.protectWorkB && this.psd) {
        this.surePsd.show = true
      } else if (this.surePswd && this.protectWorkB) {
        this.$emit('cancel')
        this.$emit('update:show', false)
      } else if (!this.protectWorkB && !this.psd) {
        this.$emit('saveWorkB', this.psd)
        this.$emit('update:show', false)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.ProtectWork {
  /deep/ .el-dialog__body {
    min-height: 80px !important;
  }
  .password {
    display: flex;
    align-items: center;
    span {
      width: 50px;
    }
  }
  .main {
    .tips {
      border-bottom: 1px solid #ddd;
      padding: 10px 5px;
    }
    .text, .psd {
      padding-top: 10px;
    }
  }
  .warn {
    font-size: 12px;
    margin-top: 10px;
  }
}
</style>
