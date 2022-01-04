// 映射方案
<template>
  <div>
    <el-dialog
      v-dialogDrag
      :modal="false"
      width="90%"
      :fullscreen="fullscreen"
      :visible.sync="show"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :before-close="() => $emit('update:show', false)"
    >
      <div slot="title">
        {{ id ? "编辑" : "新增" }}映射方案
      </div>
      <el-form
        ref="form"
        v-waiting="loading"
        :model="form"
        :rules="rules"
        size="mini"
        label-width="120px"
        status-icon
      >
        <el-row>
          <el-col :span="6">
            <el-form-item label="编码" prop="sn">
              <el-input v-model="form.sn" clearable placeholder="请填写编码" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="名称" prop="name">
              <el-input v-model="form.name" clearable placeholder="请填写名称" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="分类" prop="categorySn">
              <el-select
                v-model="categoryName"
                placeholder="请选择分类"
              >
                <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
                  <Tree
                    :data="categoryTree"
                    :search="false"
                    in-box
                    @setTargetNode="setTargetNode"
                  />
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="状态" prop="disabled">
              <el-radio v-model="form.status" :label="true">
                启用
              </el-radio>
              <el-radio v-model="form.status" :label="false">
                禁用
              </el-radio>
            </el-form-item>
          </el-col>
        </el-row>

        <hr>
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="档案类型" prop="sourceType">
                  <el-select v-model="form.sourceType" placeholder="请选择" @change="setSourceType">
                    <el-option
                      v-for="item in filesType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="来源档案" prop="sourceDossier">
                  <el-select
                    v-model="sourceName"
                    placeholder="请选择"
                  >
                    <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
                      <Tree
                        :data="sourceTree"
                        :search="false"
                        in-box
                        @setTargetNode="setSource"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="sourceShowFields">
              <template slot="label">
                <p>展示字段</p>
              </template>
              <cols ref="sourceCols" :left-table="leftTable" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-row>
              <el-col :span="12">
                <el-form-item label="档案类型" prop="targetType">
                  <el-select v-model="form.targetType" placeholder="请选择" @change="setTargetType">
                    <el-option
                      v-for="item in filesType"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="目标档案" prop="targetDossier">
                  <el-select
                    v-model="targetName"
                    placeholder="请选择"
                  >
                    <el-option value="" style="height: 250px; overflow-y:auto;padding:0px;">
                      <Tree
                        :data="targetTree"
                        :search="false"
                        in-box
                        @setTargetNode="setTarget"
                      />
                    </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item prop="targetShowFields">
                <template slot="label">
                  <p>展示字段</p>
                </template>
                <cols ref="targetCols" :left-table="rightTable" />
              </el-form-item>
            </el-row>
          </el-col>
        </el-row>
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
      <i class="el-icon-full-screen scale" @click="full" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {
    cols: () => import('./cols')
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ''
    },
    sn: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      categoryTree: [],
      tableData: [],
      loading: false,
      form: {
        id: '',
        categorySn: '',
        sn: '',
        name: '',
        status: true,
        sourceType: 'DOSSIER',
        targetType: 'DOSSIER',
        sourceDossier: '', // 来源档案编码
        sourceShowFields: '', // 来源档案展示字段
        targetDossier: '', // 目标档案编码
        targetShowFields: ''// 目标档案展示字段
      },
      filesType: [
        {
          value: 'DOSSIER',
          label: '系统档案'
        }, {
          value: 'KJQJFA',
          label: '期间方案'
        }
      ],
      sourceTree: [],
      targetTree: [],
      targetName: '',
      sourceName: '',
      categoryName: '',
      fullscreen: false, // 是否全屏
      rules: {
        categorySn: [
          { required: true, message: '请选择分类', trigger: 'change' }
        ],
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        sn: [{ required: true, message: '请填写编码', trigger: 'blur' }]
      },
      sysData: [],
      dosData: [],
      isTime: false,
      leftTable: [],
      rightTable: []
    }
  },
  watch: {
    id: {
      immediate: true,
      handler: 'getInfo'
    },
    sn: {
      immediate: true,
      handler(val) {
        this.form.categorySn = val
      }
    }
  },
  created() {
    this.getDAXZTree()
    this.getQJFATree()
    this.getCategory()
  },
  methods: {
    // 改变来源档案类型
    setSourceType(val) {
      this.sourceName = ''
      if (val === 'DOSSIER') {
        this.sourceTree = this.sysData
      } else {
        this.sourceTree = this.dosData
      }
    },
    // 改变目标档案类型
    setTargetType(val) {
      this.targetName = ''
      if (val === 'DOSSIER') {
        this.targetTree = this.sysData
      } else {
        this.targetTree = this.dosData
      }
    },
    full() {
      this.fullscreen = !this.fullscreen
    },
    // 获取分类
    getCategory(expand = []) {
      this.$api.dataMap
        .getYSFATree()
        .then(s => {
          this.categoryTree = Array.isArray(s.data) ? [...s.data] : [s.data]
        })
        .catch(e => e)
    },
    //   获取档案信息
    getInfoBySn(sn, val) {
      this.$api.dataMap
        . getInfoBySn({ sn })
        .then(s => {
          if (val === 'source') {
            this.leftTable = Array.isArray(s.data.cols) ? [...s.data.cols] : [s.data.cols]
          } else {
            this.rightTable = Array.isArray(s.data.cols) ? [...s.data.cols] : [s.data.cols]
          }
        })
        .catch(e => e)
    },
    // 获取会计期间方案的元数据
    getInfoByQJFA(val) {
      this.$api.dataMap
        .getInfoByQJFA()
        .then(s => {
          if (val === 'source') {
            this.leftTable = Array.isArray(JSON.stringify(s.data.cols)) ? [...JSON.stringify(s.data.cols)] : [JSON.stringify(s.data.cols)]
          } else {
            this.rightTable = Array.isArray(JSON.stringify(s.data.cols)) ? [...JSON.stringify(s.data.cols)] : [JSON.stringify(s.data.cols)]
          }
        })
        .catch(e => e)
    },
    // 获取档案档案选择树
    getDAXZTree() {
      this.$api.dataMap
        .getDAXZTree('ignoreRoot=true')
        .then(s => {
          this.adjustData(s.data)
          this.sysData = Array.isArray(s.data) ? [...s.data] : [s.data]
          if (this.form.targetType === 'DOSSIER') {
            this.targetTree = this.sysData
          }
          if (this.form.sourceType === 'DOSSIER') {
            this.sourceTree = this.sysData
          }
        })
        .catch(e => e)
    },
    // 获取期间方案选择树
    getQJFATree() {
      this.$api.dataMap
        .getQJFATree()
        .then(s => {
          this.adjustData(s.data)
          this.dosData = Array.isArray(s.data) ? [...s.data] : [s.data]
          if (this.form.targetType !== 'DOSSIER') {
            this.targetTree = this.dosData
          }
          if (this.form.sourceType !== 'DOSSIER') {
            this.sourceTree = this.dosData
          }
        })
        .catch(e => e)
    },
    adjustData(datas) {
      if (datas != null) {
        datas.forEach(e => {
          if (e.type === 'dossier') {
            e.id = e.icon
          }
          if (e.dataType === 3) {
            e.id = e.sn
          }
          if (e.children) {
            this.adjustData(e.children)
          }
        })
      }
    },
    setTargetNode(node) {
      this.categoryName = node.label
      this.form.categorySn = node.id
    },
    setSource(node) {
      if (node.type === 'dossier') {
        this.sourceName = node.label
        this.getInfoBySn(node.icon, 'source')
        this.form.sourceDossier = node.icon
      } else if (node.dataType === 3) {
        this.sourceName = node.label
        this.getInfoByQJFA('source')
        this.form.sourceDossier = node.sn
      } else {
        this.$message.warning('此节点不可选！')
      }
    },
    setTarget(node) {
      if (node.type === 'dossier') {
        this.targetName = node.label
        this.getInfoBySn(node.icon, 'target')
        this.form.targetDossier = node.icon
      } else if (node.dataType === 3) {
        this.targetName = node.label
        this.getInfoByQJFA('target')
        this.form.targetDossier = node.sn
      } else {
        this.$message.warning('此节点不可选！')
      }
    },
    // 保存数据算法
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.form.sourceShowFields = JSON.stringify(this.$refs.sourceCols.tableData)
          this.form.targetShowFields = JSON.stringify(this.$refs.targetCols.tableData)
          this.form.status ? this.form.status = '1' : this.form.status = '0'
          this.loading = true
          this.$api.dataMap
            .saveYSFATable({
              id: this.form.id,
              categorySn: this.form.categorySn,
              sn: this.form.sn,
              name: this.form.name,
              sourceDossier: this.form.sourceDossier,
              sourceShowFields: this.form.sourceShowFields,
              targetDossier: this.form.targetDossier,
              targetShowFields: this.form.targetShowFields,
              status: this.form.status,
              sourceType: this.form.sourceType,
              targetType: this.form.targetType
            })
            .then(s => {
              this.$emit('success', this.form.categorySn)
              this.$emit('update:show', false)
              this.loading = false
            })
            .catch(e => {
              this.loading = false
              this.$emit('update:show', false)
              this.$message.error(e.message)
            })
        }
      })
    },
    // 修改数据回显
    getInfo(val) {
      if (val) {
        this.$api.dataMap
          .getYSFAInfo({ idOrSn: val })
          .then(s => {
            this.leftTable = [s.data.sourceShowFields]
            this.rightTable = [s.data.targetShowFields]
            this.categoryName = `${s.data.categorySn} ${s.data.categoryName}`
            this.targetName = `${s.data.targetDossier} ${s.data.targetDossierName}`
            this.sourceName = `${s.data.sourceDossier} ${s.data.sourceDossierName}`
            this.form = s.data
          })
          .catch(e => this.$message.error(e.message))
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dialog{
  min-height: 300px;
  position: relative;
  .scale{
    position: absolute;
    top:11px;
    right:47px;
    cursor:pointer;
  }
}
hr{
    width:100%;
    height:1px;
    background-color: #ddd;
    border:none;
    margin-bottom: 20px;
}
</style>
