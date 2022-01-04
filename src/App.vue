<template>
  <div id="app" :class="getThemeName">
    <router-view />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['theme']),
    getThemeName() {
      window.document.documentElement.className = `theme-${this.theme}`
      return `theme-${this.theme}`
    }
  }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
</style>
