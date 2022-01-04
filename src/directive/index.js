/* eslint-disable indent */
/* eslint-disable func-names */
/* eslint-disable global-require */

import Vue from 'vue'
import maskLoading from '@components/maskLoading'

const Mask = Vue.extend(maskLoading)

// 主函数
const directive = () => {
  // 蒙版操作更新
  const toggleLoading = function (el, binding) {
    // console.log(binding, 'toggleLoading')
    if (binding.value) {
      Vue.nextTick(() => {
        if (binding.modifiers.fullscreen) {
          // 全屏情况下
          // document.body.appendChild(el.mask)
          el.instance.fullscreen = true
          document.body.style.overflow = 'hidden'
          document.body.appendChild(el.mask)
        } else {
          el.instance.fullscreen = false
          // 非全屏情况下
          const height = el.clientHeight // 当前元素高度
          const width = el.clientWidth // 当前元素宽度
          const { offsetTop } = el // 当前元素距离顶部距离
          // 给蒙版赋值
          const { x, y } = el.getBoundingClientRect()
          // el.mask.style.top = `${y}px`
          // el.mask.style.left = `${x}px`
          const parentClassName = el.parentElement.parentElement.parentElement.className.indexOf('el-dialog')
          ? el.parentElement.parentElement.parentElement.className
          : el.parentElement.parentElement.className
          el.mask.style.top = parentClassName.indexOf('el-dialog') > -1 ? `${offsetTop}px` : `${y}px`
          el.mask.style.height = `${height}px`
          el.mask.style.width = `${width - 2}px`
          el.appendChild(el.mask)
        }
      })
    } else {
      // 移除节点
      el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
      el.instance && el.instance.$destroy()
    }
  }
  Vue.directive('waiting', {
    // 只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
    bind(el, binding) {
      // console.log(binding.value, 'directive')
      const { background } = binding.value
          const { text } = binding.value
          const { iconSrc } = binding.value
          const { iconWidth } = binding.value
          const { iconHeight } = binding.value
          const { color } = binding.value
          const { fontSize } = binding.value
      const mask = new Mask({
        el: document.createElement('div'),
        data: {
          fullscreen: !!binding.modifiers.fullscreen,
          background: background || '255, 255, 255, .9',
          text: text || '数据加载中…',
          iconSrc: iconSrc || require('@/assets/images/loading/loading.gif'),
          iconWidth: iconWidth || null,
          iconHeight: iconHeight || null,
          color: color || null,
          fontSize: fontSize || null
        }
      })
      el.instance = mask // 将mask存入
      el.mask = mask.$el // dom存入，方便获取
      toggleLoading(el, binding)
    },
    // 所在组件的 VNode 更新时调用
    update(el, binding) {
      // console.log("更新了", binding);
      if (binding.oldValue !== binding.value) {
        toggleLoading(el, binding)
      }
    },
    // 只调用一次，指令与元素解绑时调用
    unbind(el) {
      // console.log("解绑了");
      // 指令解绑
      el.mask && el.mask.parentNode && el.mask.parentNode.removeChild(el.mask)
      el.instance && el.instance.$destroy()
    }
  })

  /**
   * @desc: 权限控制，用于是否显示相关功能标签
   * @params {value: Object}
   * @params {location：所属模块}
   */
  Vue.directive('display', {
    inserted: (el, binding) => {
      const { value } = binding
      if (value instanceof Object) {
        const roles = {}
        const index = roles[value.location].indexOf(value.name)
        if (index === -1) {
          // el.parentNode && el.parentNode.removeChild(el)
          el.style.display = 'none'
        } else {
          el.style.display = 'inline'
        }
      }
    }
  })

  /**
   * desc: 自定义弹框拖拽
  */
  Vue.directive('dialogDrag', {
    bind(el, binding, vnode, oldVnode) {
    // 弹框可拉伸最小宽高
      const minWidth = 400
      const minHeight = 300
      // 初始非全屏
      let isFullScreen = false
      // 当前宽高
      let nowWidth = 0
      let nowHight = 0
      // 当前顶部高度
      let nowMarginTop = 0
      // 获取弹框头部（这部分可双击全屏）
      const dialogHeaderEl = el.querySelector('.el-dialog__header')
      // 弹窗
      const dragDom = el.querySelector('.el-dialog')
      // 给弹窗加上overflow auto；不然缩小时框内的标签可能超出dialog；
      dragDom.style.overflow = 'auto'
      // 清除选择头部文字效果
      // eslint-disable-next-line no-new-func
      dialogHeaderEl.onselectstart = new Function('return false')
      // 头部加上可拖动cursor
      dialogHeaderEl.style.cursor = 'move'

      // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
      const sty = dragDom.currentStyle || window.getComputedStyle(dragDom, null)

      const moveDown = e => {
        // 鼠标按下，计算当前元素距离可视区的距离
        const disX = e.clientX - dialogHeaderEl.offsetLeft
        const disY = e.clientY - dialogHeaderEl.offsetTop

        // 获取到的值带px 正则匹配替换
        let styL
        let styT

        // 注意在ie中 第一次获取到的值为组件自带50% 移动之后赋值为px
        if (sty.left.includes('%')) {
          styL = +document.body.clientWidth * (+sty.left.replace(/\\%/g, '') / 100)
          styT = +document.body.clientHeight * (+sty.top.replace(/\\%/g, '') / 100)
        } else {
          styL = +sty.left.replace(/\px/g, '')
          styT = +sty.top.replace(/\px/g, '')
        }

        document.onmousemove = function (ele) {
          // 通过事件委托，计算移动的距离
          const l = ele.clientX - disX
          const t = ele.clientY - disY

          // 移动当前元素
          dragDom.style.left = `${l + styL}px`
          dragDom.style.top = `${t + styT}px`

          // 将此时的位置传出去
          // binding.value({x:e.pageX,y:e.pageY})
        }

        document.onmouseup = function () {
          document.onmousemove = null
          document.onmouseup = null
        }
      }
      dialogHeaderEl.onmousedown = moveDown
      // 双击头部效果
      dialogHeaderEl.ondblclick = e => {
        if (isFullScreen === false) {
          nowHight = dragDom.clientHeight
          nowWidth = dragDom.clientWidth
          nowMarginTop = dragDom.style.marginTop
          dragDom.style.left = 0
          dragDom.style.top = 0
          dragDom.style.height = '100VH'
          dragDom.style.width = '100VW'
          dragDom.style.transform = 'inherit'
          dragDom.style.marginTop = 0
          isFullScreen = true
          dialogHeaderEl.style.cursor = 'initial'
          dialogHeaderEl.onmousedown = null
        } else {
          dragDom.style.height = 'auto'
          dragDom.style.width = `${nowWidth}px`
          dragDom.style.marginTop = nowMarginTop
          isFullScreen = false
          dialogHeaderEl.style.cursor = 'move'
          dialogHeaderEl.onmousedown = moveDown
        }
      }
    }
  })

  /* 防止重复点击 */
  Vue.directive('debounce ', {
    inserted: (el, binding) => {
      let timer
      el.addEventListener('click', () => {
        if (timer) {
          clearTimeout(timer)
        }
        timer = setTimeout(() => {
          binding.value()
        }, 1000)
      })
    }
  })
}

export default directive
