<template>
  <div style="height: calc(100% - 50px)">
    <logo :collapse="isCollapse" />
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <transition>
        <el-menu
          :unique-opened="true"
          :collapse="isCollapse"
          mode="vertical"
          :background-color="variables[theme === 'dark' ? 'menuBg' : 'menuBg-light']"
          :text-color="variables[theme === 'dark' ? 'menuText' : 'menuText-light']"
          :active-text-color="variables.menuActiveText"
          collapse-transition
          :default-active="activePath"
        >
          <sidebar-item v-for="route in getRouters" :key="route.path" :item="route" :base-path="route.path" />
        </el-menu>
      </transition>
    </el-scrollbar>
  </div>
</template>

<script>
import variables from '@/styles/variables.scss'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import { mapGetters } from 'vuex'

export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters([
      'sidebar',
      'theme'
    ]),
    variables() {
      return variables
    },
    isCollapse() {
      return !this.sidebar.opened
    },
    someRoutes() {
      return this.permissionRoutes.filter(route => !route.hidden)
    },
    activePath() {
      return this.$route.path
    },
    getRouters() {
      return JSON.parse(localStorage.getItem('menuapis'))
    }
  }
}
</script>
