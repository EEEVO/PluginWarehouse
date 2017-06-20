// let dom = {
//   on: function (element, eventType, selector, fn) {
//     element.addEventListener(eventType, e => {
//       let el = e.target
//       while (!el.matches(selector)) {
//         if (element === el) {
//           el = null
//           break
//         }
//         el = el.parentNode
//       }
//       el && fn.call(el, e, el)
//     })
//     return element
//   },

//   index: function (element) {
//     let siblings = element.parentNode.children
//     for (let index = 0; index < siblings.length; index++) {
//       if (siblings[index] === element) {
//         return index
//       }
//     }
//     return -1
//   },
//   uniqueClass: function (element, className) {
//     dom.every(element.parentNode.children, el => {
//       el.classList.remove(className)
//     })
//     element.classList.add(className)
//     return element
//   },
//   create: function (html, children) {
//     var template = document.createElement('template')
//     template.innerHTML = html.trim()
//     let node = template.content.firstChild
//     if (children) {
//       dom.append(node, children)
//     }
//     return node
//   },
// }


// 定义一个插件类
class Tabs {
  constructor(options) {
    // 设置一个默认配置项
    let defaultOptions = {
      element: '',
      navSelector: '[data-role="tabs-nav"]',
      panesSelector: '[data-role="tabs-panes"]',
      activeClassName: 'active',
    }
    this.options = Object.assign({}, defaultOptions, options)
    this.checkOptions().bindEvents().setDefaultTab()
  }
  // 设置一个检查属性
  checkOptions() {
    if (!this.options.element) {
      throw new Error('element is required')
    }
    return this
  }
  // 绑定切换事件
  bindEvents() {
    dom.on(this.options.element, 'click', `${this.options.navSelector}>li`, (e, el) => {
      let index = dom.index(el)
      let children = this.options.element.querySelector(this.options.panesSelector).children
      dom.uniqueClass(el, this.options.activeClassName)
      dom.uniqueClass(children[index], this.options.activeClassName)
    })
    return this
  }
  setDefaultTab() {
    this.options.element.querySelector(`${this.options.navSelector}>li:first-child`).click()
    return this
  }
}