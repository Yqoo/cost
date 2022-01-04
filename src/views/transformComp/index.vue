<template>
  <div class="main">
    <h4 class="title">
      <el-button type="primary" size="mini" @click.once="autoRun">
        执行
      </el-button>
    </h4>
    <div class="box">
      <div class="box-top">
        <h4 class="box-title">
          计算节点
        </h4>
        <el-steps :active="table.step" align-center style="margin: 20px 0px;">
          <el-step
            v-for="node in table.nodes"
            :key="node.id"
            :title="node.name"
          />
        </el-steps>
      </div>
      <div class="box-bottom">
        <h4 class="box-title">
          计算记录
        </h4>
        <el-table
          :data="table.data"
          size="mini"
          style="width: 100%"
          height="calc(100vh - 350px)"
        >
          <el-table-column label="时间" prop="createTime" />
          <el-table-column label="信息" prop="message" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransformComp',
  data() {
    return {
      targetTabInfo: null,
      table: {
        nodes: [],
        data: [],
        step: 0
      },
      timer: null,
      execute: false
    }
  },
  beforeRouteEnter(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
    next()
  },
  beforeRouteUpdate(to, from, next) {
    if (to.params.param) {
      const p = JSON.parse(decodeURIComponent(to.params.param))
      to.meta.title = p.name
      next()
    }
  },
  created() {
    const { param } = this.$route.params
    const p = JSON.parse(decodeURIComponent(param))
    this.targetTabInfo = JSON.parse(JSON.stringify(p))
    this.getInfo(p.sn)
  },
  beforeDestroy() {
    this.clear()
  },
  methods: {
    run() {
      const info = this.targetTabInfo
      this.$api.dataComparison.getCalculateStatus({
        sn: info.sn
      }).then(s => {
        const { recordes, done, step } = s.data
        const { data, complete } = done
        this.table.data = recordes
        if (complete) {
          const h = this.$createElement
          this.$notify({
            title: '提示',
            message: h('i', { style: 'fontSize: 12px' }, data.message),
            duration: 0,
            type: data.code === 200 ? 'success' : 'warning'
          })
          this.clear()
        }
        if (step) {
          for (let i = 0, len = this.table.nodes.length; i < len; i++) {
            if (this.table.nodes[i].id === step) {
              this.table.step = i + 1
              break
            }
          }
        }
      }).catch(e => {
        this.$message.error(e.message)
        this.clear()
      })
    },
    autoRun() {
      const info = this.targetTabInfo
      this.$api.dataComparison.doCalculate({
        sn: info.sn
      })
      this.timer = setInterval(() => {
        this.run()
      }, 1000)
    },
    clear() {
      clearInterval(this.timer)
      this.timer = null
    },
    getInfo(sn) {
      if (sn) {
        this.$api.dataComparison.getTransformInfo({
          sn
        }).then(s => {
          const { nodes, recordes, execute } = s.data
          this.execute = execute
          this.table.nodes = nodes
          this.table.data = recordes
          execute && this.autoRun()
        }).catch(e => {
          this.$message.error(e.message)
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .main {
    height: 100%;
  }
  .title {
    font-size: 15px;
    font-weight: bold;
    text-align: right;
    line-height: 30px;
    padding-right: 20px;
  }
  .box {
    overflow-y: auto;
    &-title {
      border-left: 5px solid #409eff;
      padding-left: 5px;
      color: #409eff;
      line-height: 30px;
    }
  }
</style>
