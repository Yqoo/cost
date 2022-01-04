<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <!-- <div class="right-menu-item">
        <span class="ztmc">{{ zt }}</span>
      </div> -->
      <el-date-picker
        v-model="date"
        type="date"
        placeholder="选择日期"
        size="mini"
        format="yyyy 年 MM 月 dd 日"
        value-format="yyyy/MM/dd"
        style="position:relative;top: -18px;width: 170px"
      />
      <!-- <search id="header-search" class="right-menu-item" /> -->
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <img :src="url" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <div class="dropdownbox">
            <div class="title">
              <img :src="url" class="user-avatar">
              <span>{{ userName }}</span>
            </div>
            <ul class="mainlist">
              <li v-for="item in roleTools" :key="item.type" @click="handler(item.type)">
                <i :class="item.icon" />
                <p>{{ item.name }}</p>
              </li>
            </ul>
            <div class="footer">
              <el-button type="primary" size="mini" @click="logout">
                退出登录
              </el-button>
            </div>
          </div>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <userInfo
      v-if="userInfoShow"
      :show.sync="userInfoShow"
    />
  </div>
</template>

<script>
/* eslint-disable object-curly-newline */

import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import Search from '@/components/HeaderSearch'
import { removeToken } from '@/utils/auth'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
    Search,
    userInfo: () => import('../components/userInfo')
  },
  data() {
    return {
      list: [
        { name: '个人信息', icon: 'iconfont icon-gerenzhongxin', type: 'info', platforms: ['cw', 'cb'] },
        { name: '切换主题', icon: 'iconfont icon-qiehuanzhuti', type: 'theme', platforms: ['cw', 'cb'] },
        { name: '附件管理', icon: 'iconfont icon-fujianguanli', type: 'enclosure', platforms: ['cw', 'cb'] }
      ],
      date: new Date(),
      userInfoShow: false,
      url: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ]),
    userName() {
      return localStorage.getItem('userName')
    },
    zt() {
      const { ztmc, unit_name } = JSON.parse(localStorage.getItem('startZT')) || {}
      return ztmc ? `当前账套：${ztmc}（${unit_name}）` : ''
    },
    platform() {
      const { platform } = JSON.parse(localStorage.getItem('footerInfo'))
      return platform
    },
    roleTools() {
      const { list, platform } = this
      return list.filter(item => item.platforms.includes(platform))
    }
  },
  watch: {
    avatar: {
      immediate: true,
      handler(val) {
        this.url = `${this.$http.defaults.baseURL}/user/getPhoto?id=
        ${localStorage.getItem('userId').trim()}&time=${new Date().getTime()}`
      }
    },
    date(val) {
      const date = this.$tools.timestamp(new Date(val), 'YYYY/MM/DD')
      // this.$store.dispatch('app/updateDate', date)
    }
  },
  created() {
    // this.date = localStorage.getItem('date') || new Date()
  },
  methods: {
    handler(type) {
      const Activeds = {
        theme: () => this.$store.dispatch('app/updateTheme'),
        info: () => {
          this.userInfoShow = true
        },
        env: () => {},
        setting: () => {},
        download: () => {},
        enclosure: () => {
          this.$router.push({
            path: '/enclosure'
          })
        }
      }
      Activeds[type]()
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      /* await this.$store.dispatch('user/logout') */
      localStorage.clear()
      removeToken()
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/mixin.scss';

.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .home {
    font-size: 19px;
    cursor: pointer;
  }
  .breadcrumb-container {
    float: left;
    transition: background .3s;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    a {
      color: #5a5e66;
    }
    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;
      .ztmc {
        color: #4093ff;
      }
      &.hover-effect {
        cursor: pointer;
        transition: background .3s;
        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 25px;
          height: 25px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 15px;
          font-size: 12px;
        }
      }
    }
  }
}
.dropdownbox {
  width: 300px;
  .title {
    height: 40px;
    border-bottom: 1px solid #ddd;
    padding-left: 10px;
    .user-avatar {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      vertical-align: middle;
      margin-right: 10px;
    }
  }
  .mainlist {
    padding: 10px;
    display: flex;
    flex: 1;
    flex-flow: row wrap;
    justify-content: space-around;
    li {
      width: 80px;
      margin: 5px;
      padding: 10px 0px;
      text-align: center;
      cursor: pointer;
      i {
        font-size: 30px;
      }
    }
    li:hover {
      background: #0270c1;
      color: #fff;
      border-radius: 5px;
    }
  }
  .footer {
    text-align: center;
    .el-button {
      width:90%
    }
  }
}
</style>
