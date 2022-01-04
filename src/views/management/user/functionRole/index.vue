<template>
  <div>
    <div class="toolsbar">
      <ToolsBar
        v-if="toolsBar.baocun"
        module-name="FunctionRole"
        :items="btns"
        :width="180"
        @btnsHandler="btnsHandler"
      />
      <ToolsBar
        v-else
        module-name="FunctionRole"
        :items="save"
        :width="180"
        @btnsHandler="btnsHandler"
      />
    </div>
    <LeftWorkbench ref="leftWorkbench" :width="width" class="left" :additional="50">
      <Tree
        slot="tree"
        v-waiting="tree.loading"
        :data="tree.treeData"
        :node-props="{
          children: 'children',
          label: 'label'
        }"
        :rightmenus="rightmenus"
        :default-checked-keys="roleCheckedKeys"
        @update:rightmenus="rightmenusHandler"
        @setTargetNode="setChildRM"
      />
    </LeftWorkbench>
    <MiddleDrag :margin-top="middleDragTop" @hook:mounted="getTop" @move="move" />
    <div class="right"
         :style="{
           marginLeft: width + 18 +'px',
           width: 'calc(100% - '+(marginLeft + 30)+'px)'
         }"
    >
      <div class="title">
        <span>应用范围：</span>
        <el-select
          v-model="scopeType.selectValue"
          :disabled="toolsBar.baocun"
          placeholder="请选择"
          size="mini"
          style="margin-right:10px"
          @change="selectChange"
        >
          <el-option
            v-for="(item, key) in scopeType.allScopeType"
            :key="key"
            :label="item"
            :value="key"
          />
        </el-select>
        <el-select
          v-model="units"
          :disabled="toolsBar.baocun"
          multiple
          style="width: 250px;width: 500px"
          placeholder="请选择"
          size="mini"
          @remove-tag="removeTag"
        >
          <el-option value="" style="height: 250px; overflow-y:auto; padding: 0px;">
            <Tree
              :data="scopeType.treeData"
              :search="false"
              in-box
              @setTargetNode="setTargetNode"
            />
          </el-option>
        </el-select>
      </div>
      <div class="lefttree">
        <LeftWorkbench :width="300">
          <Tree
            slot="tree"
            ref="mlTree"
            :data="tree.menuData"
            :check-box="true"
            :node-props="{
              children: 'children',
              label: 'label'
            }"
            :default-checked-keys="defaultCheckedKeys"
            @setTargetNode="setChildNode"
            @check="menuCheck"
          />
        </LeftWorkbench>
        <div class="righttree">
          <Tree
            slot="tree"
            ref="apiTree"
            :search="false"
            :check-box="true"
            :data="tree.menuApis"
            node-key="path"
            :node-props="{
              children: 'children',
              label: 'label'
            }"
            default-expand-all
            :default-checked-keys="menuCheckedKeys"
            @setTargetNode="setChild"
            @check="apisCheck"
          />
        </div>
      </div>
    </div>
    <Role v-if="role.show" :show.sync="role.show" :update-id="role.updateId" @refreshTree="getRoleTree" />
    <UserData
      v-if="userData.show"
      :show.sync="userData.show"
      :sn="sn"
    />
    <Djsq
      v-if="djsq.show"
      :show.sync="djsq.show"
    />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */

export default {
  name: 'FunctionRole',
  components: {
    Role: () => import('./dialog/role'),
    UserData: () => import('./dialog/userData'),
    Djsq: () => import('./dialog/djsq')
  },
  data() {
    return {
      width: 300,
      marginLeft: this.width,
      middleDragTop: this.width,
      roleTreeStatus: false,
      obj: {},
      toolsBar: {
        baocun: true
      },
      roleCheckedKeys: [], // 添加角色默认展开
      defaultCheckedKeys: [], // 角色功能默认选中
      menuCheckedKeys: [], // 角色功能明细默认选中
      sn: '',
      menuId: [],
      tree: {
        treeData: [], // 角色
        menuData: [], // 角色功能
        menuApis: [], // 角色功能明细
        loading: false,
        targetNode: {}
      },
      role: {
        show: false,
        updateId: null
      },
      scopeType: { // 应用范围
        allScopeType: [],
        treeData: [],
        selectValue: '',
        treeValue: [],
        scopeSn: [],
        options: {}
      },
      form: {
        sn: '', // 角色编码(树节点上的id)
        scope: '', // 应用范围
        scopeSn: '', // 范围对象id，多个用英文逗号间隔
        menuApis: [] // 菜单-api json数组
      },
      userData: {
        show: false
      },
      djsq: {
        show: false
      }
    }
  },
  computed: {
    apis() {
      return this.$tools.getModuleAPIS('FunctionRole')
    },
    units: {
      get() {
        const { options } = this.scopeType
        return Object.keys(options)
      },
      set() {}
    },
    btns() { // toolsBar 按钮
      return [
        { method: 'add', name: '新增', icon: 'el-icon-circle-plus-outline', api: '/role/add' },
        { method: 'warranty', name: '授权', icon: 'el-icon-document' },
        // { method: 'moreWarranty', name: '批量授权', icon: 'el-icon-document-copy' },
        { method: 'billsWarranty', name: '单据授权', icon: 'el-icon-tickets' },
        { method: 'examine', name: '查看用户角色', icon: 'el-icon-view' }
      ]
    },
    save() {
      return [
        { method: 'save', name: '保存', icon: 'el-icon-folder-checked', api: '/role/updateRoleMenuApis' },
        { method: 'cancel', name: '取消', icon: 'el-icon-folder-delete' }
      ]
    }
  },
  watch: {
    // eslint-disable-next-line func-names
    'role.show': function (val) {
      if (!val) this.role.updateId = null
    }
  },
  created() {
    this.getRoleTree()
    // this.getMenuTree()
    this.getScopeType()
  },
  methods: {
    rightmenus() { // 右键
      const rs = [
        { label: '添加功能角色', icon: 'el-icon-plus', type: 'addRole', api: '/role/add' },
        { label: '修改功能角色', icon: 'el-icon-edit', type: 'editRole', api: '/role/update' },
        { label: '删除功能角色', icon: 'el-icon-delete', type: 'delRole', api: '/role/delete' }
      ]
      return rs.filter(r => this.apis.includes(r.api))
    },
    getRoleTree(expend = []) { // 获取功能角色树
      this.tree.loading = true
      this.$api.role.getRoleTree().then(res => {
        const { data } = res
        this.tree.treeData = [...data]
        this.tree.focusId = expend
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getMenuTree(rid) { // 获取所有功能权限树
      this.tree.loading = true
      this.$api.role.getMenuTree({ rid }).then(res => {
        const { data } = res
        this.tree.menuData = [data.tree]
        this.defaultCheckedKeys = data.checks.split(',')
        this.scopeType.selectValue = data.scopeType
        this.scopeType.options = data.scope
        this.tree.loading = false
      }).catch(e => {
        this.tree.loading = false
        this.$message.error(e.message)
      })
    },
    getRoleMenuApis() { // 获取当前角色已有的功能权限
      if (this.sn) {
        this.$api.role.getRoleMenuApis(this.sn).then(res => {
          const { data } = res
          this.menuId = [...data]
          this.defaultCheckedKeys = this.menuId.map(m => m.menu_id)
        })
      }
    },
    getMenuApis(id) { // 通过中间菜单id获取右侧权限明细
      this.$api.role.getMenuApis(id).then(res => {
        const { data } = res
        // console.log(data)
        this.tree.menuApis = [data]
        this.menuCheckedKeys = this.tree.menuApis.map(m => m.children.map(c => c.id))
      })
    },
    getScopeType() { // 获取获取应用范围
      this.$api.role.getScopeType().then(res => {
        const { data } = res
        this.scopeType.allScopeType = data
      })
    },
    btnsHandler(met) { // toolsBar 事件
      const actives = {
        add: () => {
          this.role.show = true
          this.role.updateId = null
        },
        warranty: () => {
          if (this.sn === '') {
            this.$message.warning('请选择功能角色')
          } else this.toolsBar.baocun = false
        },
        moreWarranty: () => {
          console.log('批量授权')
        },
        billsWarranty: () => {
          if (this.sn === '') {
            this.$message.warning('请选择功能角色')
          } else this.djsq.show = true
        },
        examine: () => {
          console.log(this.sn)
          if (this.sn === '') {
            this.$message.warning('请选择功能角色')
          } else this.userData.show = true
        },
        save: () => {
          if (!this.roleTreeStatus) {
            this.$message('请选择功能角色')
          } else {
            this.form.scope = this.scopeType.selectValue
            this.form.scopeSn = Object.values(this.scopeType.options).join(',')
            if (this.form.scope === '' || this.form.scopeSn === '') {
              this.$message('请选择应用范围以及范围对象')
            }
            const params = { ...this.form }
            const nodes = this.$refs.mlTree.getCheckedNodes()
            const menuApis = []
            nodes.forEach(node => {
              menuApis.push({
                menuId: node.id,
                apis: node.apis || ''
              })
            })
            params.menuApis = JSON.stringify([...menuApis])
            if (params.sn !== '' && params.scope !== '' && params.scopeSn !== '' && params.menuApis.length !== 0) {
              this.$api.role.updateRoleMenuApis(params).then(res => {
                this.toolsBar.baocun = true
                this.$message.success('保存成功')
              }).catch(e => this.$message.error(e.error))
            }
          }
        },
        cancel: () => {
          this.toolsBar.baocun = true
        }
      }
      actives[met]()
    },
    removeTag(val) {
      this.$delete(this.scopeType.options, val)
    },
    rightmenusHandler(obj) { // tree 右键事件
      const { data, type } = obj
      const processor = {
        addRole: () => {
          this.role.show = true
          this.role.updateId = null
        },
        editRole: () => {
          this.role.show = true
          this.role.updateId = data.id
        },
        delRole: () => {
          this.$confirm('当前操作将会删除该行数据，是否继续？', '删除', {
            confrimButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.$api.role
                .delRole({ sn: data.id })
                .then(res => {
                  console.log(res)
                  this.$message.success('删除成功')
                  this.getRoleTree()
                })
                .catch(e => this.$message.error(e.message))
            })
            .catch(e => e)
        }
      }
      processor[type]()
    },
    // tree 节点权限
    setChildRM(node) { // 获取角色功能权限
      this.sn = node.id
      this.form.sn = node.id
      this.roleTreeStatus = true
      this.getMenuTree(node.id)
    },
    setChildNode(node) { // 获取权限明细
      this.tree.targetNode = node
      this.tree.menuApis = [node.apiList]
      this.menuCheckedKeys = node.apis ? node.apis.split(',') : []
    },
    setChild(node) {
      console.log(node)
    },
    setTargetNode(node) { // 应用范围的tree节点
      if (node.disabled) this.$message.warning('当前节点无法选择！')
      else this.$set(this.scopeType.options, node.label, node.id)
    },
    selectChange(val) { // 应用范围
      const dispose = {
        zt: () => {
          this.scopeType.options = {}
          this.$api.role.getZT().then(res => {
            const { data } = res
            this.scopeType.treeData = [data]
          })
        },
        unit: () => {
          this.scopeType.options = {}
          this.$api.role.getDWtree().then(res => {
            const { data } = res
            this.scopeType.treeData = [data]
          })
        },
        '': () => false
      }
      dispose[val]()
    },
    menuCheck(val) {
      if (this.toolsBar.baocun) {
        this.$message('无法保存，请点击授权后更改')
      }
    },
    apisCheck(val) {
      if (this.toolsBar.baocun) {
        this.$message('无法保存，请点击授权后更改')
      } else {
        const { checkedNodes } = val
        const path = checkedNodes.map(check => check.path)
        console.log(path)
        this.tree.targetNode.apis = path.join(',')
      }
    },
    getTop() { // 拖拽
      this.middleDragTop = this.$refs.leftWorkbench.$el.offsetHeight / 2
    },
    move(x) { // 移动
      if (x < 300) x = 300
      else if (x > 800) x = 800
      this.width = x
    }
  }
}
</script>

<style lang="scss" scoped>
.toolsbar {
  display: flex;
}
.left {
  margin-top: 10px;
  height: calc(99% - 50px);
}
.right {
  margin-top: 10px;
  height: calc(99% - 70px);
  // margin-left: 310px;
  border: 1px solid #ddd;
  border-radius: 5px;
  // width: calc(100% - 350px);
  padding: 10px;
  overflow-y: auto;
}
.lefttree {
  margin-top: 10px;
  height: calc(99% - 30px);
}
.righttree {
  border: 1px solid #ddd;
  border-radius: 5px;
  margin-left: 310px;
  height: 99%;
}
</style>
