<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="36%"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ id?"编辑":"新增" }}应用期间
      </div>
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="80px"
      >
        <el-form-item label="期间类型" prop="rangeType">
          <el-select
            v-model="form.rangeType"
            placeholder="请选择"
            size="mini"
            style="width:100%"
            @change="selectChange"
          >
            <el-option
              v-for="item in typeData"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="开始期间" prop="startRange">
          <el-row>
            <el-col :span="form.rangeType==='QUARTER'?16:24">
              <el-date-picker
                v-model="form.startRange"
                :value-format="dateFormat"
                :type="dateType"
                placeholder="选择日期"
                size="mini"
                style="width:100%"
                @change="changeStartTime"
              />
            </el-col>
            <el-col :span="8">
              <el-select v-if="form.rangeType==='QUARTER'" v-model="startQuarter" clearable placeholder="请选择季度">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="结束期间" prop="endRange">
          <el-row>
            <el-col :span="form.rangeType==='QUARTER'?16:24">
              <el-date-picker
                v-model="form.endRange"
                :value-format="dateFormat"
                :type="dateType"
                placeholder="选择日期"
                size="mini"
                style="width:100%"
                @change="changeEndTime"
              />
            </el-col>
            <el-col :span="8">
              <el-select v-if="form.rangeType==='QUARTER'" v-model="endQuarter" clearable placeholder="请选择季度">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="启用状态" prop="status">
          <el-switch
            v-model="form.status"
            active-text="是"
            inactive-text="否"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button
          type="info"
          size="mini"
          @click="() => $emit('update:show', false)"
        >
          取消
        </el-button>
        <el-button type="primary" size="mini" @click="save">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    versionId: {
      type: String,
      default: ''
    },
    duringType: {
      type: Array,
      default: () => []
    },
    updateInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      status: true,
      versionid: '',
      form: {
        id: '',
        rangeType: '',
        startRange: '',
        endRange: '',
        status: true
      },
      startQuarter: '',
      endQuarter: '',
      dateFormat: 'yyyy',
      typeData: [],
      options: [{
        label: '第一季度',
        value: 1
      }, {
        label: '第二季度',
        value: 2
      }, {
        label: '第三季度',
        value: 3
      }, {
        label: '第四季度',
        value: 4
      }
      ],
      rules: {
        rangeType: [
          { required: true, message: '请选择期间类型', trigger: 'change' }
        ]
      },
      dateType: 'year'
    }
  },
  watch: {
    versionId: {
      immediate: true,
      handler(val) {
        this.versionid = val
      }
    },
    type: {
      immediate: true,
      handler(val) {
        this.form.rangeType = val
        this.selectChange(val)
      }
    },
    duringType: {
      immediate: true,
      handler(val) {
        this.typeData = val
      }
    },
    updateInfo: {
      immediate: true,
      handler: 'getInfo'
    }
  },
  methods: {
    // 选择日期后触发change方法，将开始和结束时间进行对比，不符合约束条件就清空该日期重新选择
    changeStartTime(val) {
      if (this.form.endRange) {
        if (this.form.endRange <= this.form.startRange) {
          this.$message.error('开始时间不能大于结束时间')
          this.form.startRange = ''
        }
      }
    },
    changeEndTime(val) {
      if (this.form.startRange) {
        if (this.form.endRange <= this.form.startRange) {
          this.$message.error('结束时间不能小开始时间')
          this.form.endRange = ''
        }
      }
    },
    selectChange(val) {
      this.form.startRange = ''
      this.form.endRange = ''
      if (val === 'YEAR') {
        this.dateType = 'year'
        this.dateFormat = 'yyyy'
      } else if (val === 'QUARTER') {
        this.dateType = 'year'
        this.dateFormat = 'yyyy'
      } else if (val === 'MONTH') {
        this.dateFormat = 'yyyyMM'
        this.dateType = 'month'
      } else {
        this.dateFormat = 'yyyyMMdd'
        this.dateType = 'date'
      }
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.form.rangeType === 'QUARTER') {
            this.form.startRange = `${this.form.startRange}${this.startQuarter}`
            this.form.endRange = `${this.form.endRange}${this.endQuarter}`
          }
          this.$api.dataMapManage
            .saveAppDuring({
              id: this.form.id || '',
              versionId: this.versionid,
              rangeType: this.form.rangeType,
              startRange: this.form.startRange,
              endRange: this.form.endRange,
              status: this.form.status
            })
            .then(s => {
              this.$emit('success')
              this.$emit('update:show', false)
            })
            .catch(e => {
              this.$message.error(e.message)
            })
        }
      })
    },
    getInfo(val) {
      if (val && val.id) {
        this.form.id = val.id
        this.form.rangeType = val.rangeType
        this.form.startRange = val.startRange
        this.form.endRange = val.endRange
        this.form.status = val.status
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
