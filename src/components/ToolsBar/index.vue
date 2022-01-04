<template>
  <div class="toolsBar">
    <div class="group">
      <slot name="preBtn" />
      <div
        v-for="(item, index) in btns"
        v-show="item.hasOwnProperty('show') ? item.show : true"
        :key="item.method || index"
      >
        <el-dropdown v-if="item.children && Array.isArray(item.children)">
          <el-button
            :type="item.type || ''"
            :size="item.size || 'mini'"
          >
            {{ item.name }}
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <ul class="dropdown-ul" :style="{ margin: '0px 10px', minWidth: '50px'}">
              <li
                v-for="(ite, ind) in item.children"
                :key="ite.method || ind"
                @click="click(ite.method)"
              >
                <span>{{ ite.name }}</span>
              </li>
            </ul>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip
          v-else-if="item.title"
          class="item"
          effect="dark"
          :content="item.title"
          placement="top"
        >
          <el-button
            :type="item.type || ''"
            :size="item.size || 'mini'"
            @click="click(item.method)"
          >
            {{ item.name || '未定义' }}
          </el-button>
        </el-tooltip>
        <el-button
          v-else
          :type="item.type || ''"
          :size="item.size || 'mini'"
          @click="click(item.method)"
        >
          {{ item.name || '未定义' }}
        </el-button>
      </div>
      <slot name="other" />
    </div>
    <div v-if="showZt" class="unit kj">
      <img :src="require('@/assets/images/middleImg/kjzd.png')" alt="">
      <el-select v-model="unit" filterable placeholder="单位" size="mini" style="width: 160px">
        <!--  <i slot="prefix" class="el-icon-office-building" style="padding-top:8px;" /> -->
        <el-option
          v-for="item in units"
          :key="item.id"
          :label="item.name"
          :value="item.sn"
        />
      </el-select>
      <img :src="require('@/assets/images/middleImg/hybb.png')" alt="">
      <el-select v-model="acset" filterable placeholder="账套" size="mini" default-first-option style="width: 160px">
        <!-- <i slot="prefix" class="el-icon-collection " style="padding-top:8px;" /> -->
        <el-option
          v-for="item in ztList"
          :key="item.zth"
          :label="item.ztmc"
          :value="item.ztsn"
        />
      </el-select>
    </div>
    <div v-if="showZd" class="unit kj">
      <img :src="require('@/assets/images/middleImg/kjzd.png')" alt="">
      <el-select v-model="kjzd" filterable placeholder="会计制度" size="mini" style="width: 350px">
        <el-option
          v-for="item in kjzds"
          :key="item.id"
          :label="item.name"
          :value="item.sn"
        />
      </el-select>
      <img v-if="hybbList.length" :src="require('@/assets/images/middleImg/hybb.png')" alt="">
      <el-select v-if="hybbList.length" v-model="hybb" filterable placeholder="行业版本" size="mini" style="width: 300px">
        <el-option
          v-for="item in hybbList"
          :key="item.id"
          :label="item.name"
          :value="item.sn"
        />
      </el-select>
    </div>
    <slot name="select" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ToolsBar',
  props: {
    items: {
      required: true,
      type: Array,
      default: () => []
    },
    showZt: { // 是否显示单位 和 账套
      type: Boolean,
      default: false
    },
    showZd: { // 是否显示会计制度 和 行业版本
      type: Boolean,
      default: false
    },
    width: {
      type: Number,
      default: () => 70
    },
    moduleName: { // 父组件name 用于获取父组件的按钮权限apis
      type: String,
      default: ''
    }
  },
  data() {
    return {
      unit: '', // 单位
      acset: '', // 账套
      ztList: [],
      kjzd: '', // 会计制度
      hybb: '', // 行业版本
      hybbList: []
    }
  },
  computed: {
    btns() {
      const { items, moduleName } = this
      if (!moduleName) return items
      return this.checkAPI(items)
    },
    apis() {
      const { moduleName } = this
      return this.$tools.getModuleAPIS(moduleName)
    },
    ...mapGetters([
      'units',
      'acsets',
      'kjzds'
    ])
  },
  watch: {
    unit(sn) {
      const f = this.units.filter(unit => unit.sn === sn)[0]
      this.acset = ''
      if (f) this.ztList = f.ztList
    },
    acset(id) {
      if (id) {
        this.$emit('ztChange', {
          unitId: this.unit,
          acsetId: id,
          meta: this.ztList.filter(l => l.ztsn === id)[0]
        })
      }
    },
    kjzd(sn) {
      const k = this.kjzds.filter(kj => kj.sn === sn)[0]
      this.hybb = ''
      this.hybbList = [...k.hybbs]
      if (sn) {
        this.$emit('hybbChange', {
          kjzd: sn,
          hybb: this.hybb
        })
      }
    },
    hybb(id) {
      if (id) {
        this.$emit('hybbChange', {
          kjzd: this.kjzd,
          hybb: id
        })
      }
    }
  },
  created() {
    if (this.showZt) {
      this.$store.dispatch('user/getUnits').then(data => {
        if (data && data.length) {
          const localAcsetId = localStorage.getItem('startZT')
          if (localAcsetId && !this.acset) { // 需已设置默认账套并且未选值时 （当用户从凭证簿跳转到填制凭证页面时已设置好账套无需再设置）
            const ztInfo = JSON.parse(localAcsetId)
            const unitId = ztInfo.unit_sn
            const acsetId = ztInfo.ztsn
            this.setUnitId(unitId)
            data.forEach(d => {
              if (d.ztList.some(zt => zt.ztsn === acsetId)) this.setAcsetId(acsetId)
            })
          }
        }
      })
      // this.$store.dispatch('user/getZT')
    }
    if (this.showZd) this.$store.dispatch('user/getKJZD')
  },
  methods: {
    checkAPI(items = []) {
      const { apis } = this
      const arr = []
      items.forEach(item => {
        if (item.children) {
          item.children = item.children.filter(child => apis.includes(child.api) || child.api === undefined)
          item.children.length && arr.push(item)
        } else {
          (item.api === undefined || apis.includes(item.api)) && arr.push(item)
        }
      })
      return arr
    },
    setUnitId(unitId) {
      this.unit = unitId
    },
    setAcsetId(acsetId) {
      this.$nextTick(() => {
        this.acset = acsetId
      })
    },
    click(method) {
      this.$emit('btnsHandler', method)
    }
  }
}
</script>

<style lang='scss' scoped>
  .toolsBar {
    display: flex;
    justify-content:space-between;
    flex-direction:row-reverse;
    padding: 5px 30px 5px 10px;
    .group {
      display: flex;
    }
    .el-button {
      margin-right: 10px;
    }
  }
  .dropdown-ul {
    li {
      height: 30px;
      line-height: 30px;
      text-align: left;
      cursor: pointer;
      i { padding-right: 5px;}
    }
    li:hover {
      color: #4390de;
    }
  }
  .unit {
    .el-select {
      margin-right: 10px;
      width: 150px;
    }
  }
  .kj {
    img {
      width: 26px;
      height: 25px;
      vertical-align: middle;
      padding-right: 5px;
      position: relative;
      top: -1px;
    }
  }
</style>
