<template>
  <div class="Revise">
    <el-dialog
      v-dialogDrag
      :visible.sync="show"
      :model="false"
      width="35%"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => this.$emit('update:show', false)"
    >
      <div slot="title">
        突出显示修订
      </div>
      <div class="main">
        <p>
          <el-checkbox v-model="allowRevise">
            编辑时跟踪修订信息
          </el-checkbox>
        </p>
        <div class="xdOptions">
          <h5>突出显示的修订选项</h5>
          <div class="checkBox">
            <el-checkbox-group v-model="xdOptions">
              <el-checkbox label="time">
                <span style="width: 48px; display: inline-block;">时间：</span>
                <el-select v-model="xdTime" size="mini">
                  <el-option v-for="item in timeList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
                <el-date-picker
                  v-if="xdTime === 'fromDate'"
                  v-model="date"
                  type="date"
                  style="width: 40%; margin-left: 8px"
                  size="mini"
                  placeholder="选择日期"
                />
              </el-checkbox><br>
              <el-checkbox label="user">
                <span>修订人：</span>
                <el-select v-model="xdPerson" size="mini">
                  <el-option v-for="item in personList" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </el-checkbox>
            </el-checkbox-group>
          </div>
          <div class="show">
            <el-checkbox-group v-model="showInfo">
              <el-checkbox label="showMess">
                在屏幕上显示修订信息
              </el-checkbox><br>
            </el-checkbox-group>
          </div>
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
  </div>
</template>

<script>
export default {
  name: 'Revise',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    status: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showInfo: ['showMess'], // 是否展示修订信息
      date: '',
      allowRevise: this.status, // 是否允许修订
      xdOptions: [], // 修订选项
      xdTime: 'all', // 修订时间
      xdPerson: 'everyone', // 可修订人
      timeList: [
        { label: '全部', value: 'all' },
        { label: '无', value: 'none' },
        { label: '起自日期', value: 'fromDate' }
      ],
      personList: [
        { label: '每个人', value: 'everyone' },
        { label: '出我之外每个人', value: 'other' },
        { label: 'ADMIN', value: 'admin' }
      ]
    }
  },
  methods: {
    save() {
      this.$emit('showRevise', this.allowRevise)
      this.$emit('update:show', false)
    }
  }
}
</script>

<style lang="scss" scoped>
.Revise {
  align-items: center;
  /deep/ .el-dialog__body {
    min-height: 50px !important;
  }
  .xdOptions {
    margin-top: 20px;
    border-top: 1px solid #ddd;
    position: relative;
    h5 {
      position: absolute;
      top: -12px;
      left: -1px;
      background: #fff;
      font-size: 12px;
      padding: 2px;
    }
    .checkBox {
      margin: 20px 0;
      padding-bottom: 10px;
      border-bottom: 1px solid #ddd;
      .el-checkbox {
        margin: 5px 0;
      }
    }
  }
}
</style>
