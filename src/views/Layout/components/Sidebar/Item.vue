<script>
import variables from '@/styles/variables.scss'
import { mapGetters } from 'vuex'

export default {
  name: 'MenuItem',
  functional: true,
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    info: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    ...mapGetters(['theme']),
    variables() {
      return variables
    }
  },
  render(h, context) {
    const { icon, title, info } = context.props
    const vnodes = []
    if (icon) {
      vnodes.push(<i class={['iconfont', icon]} />)
    }

    if (title) {
      vnodes.push(<elTooltip slot='title' class="item" effect="dark" content={title} placement="top-start">
        <span>{(title)}</span>
      </elTooltip>)
      vnodes[1].data.on = {
        // eslint-disable-next-line func-names
        '!click': () => {
          if (info && info.sceneId) {
            context.parent?.$router.push({ path: `/sceneDesign/${info.sceneId}/${info.sceneName}/view` })
          }
        }
      }
    }
    return vnodes
  }
}
</script>

<style lang='scss' scoped>
@import "~@/styles/variables.scss";
@import '~@/styles/mixin.scss';

.iconSpan {
  width: 21px;
  display: inline-block;
}
.iconfont {
  width: 1em;
  height: 1em;
  @include iconfont_color('sidebar-iconfont-color');
  margin-right: 6px;
  font-size: 13px;
}
.itemtitle {
  @include title_color('sidebar-title-color')
}
</style>
