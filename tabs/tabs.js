let dom = {
  /**
   * es6版
   * 添加事件
   * 
   * @param {any} element 目标对象
   * @param {any} eventType 事件类型
   * @param {any} selector 选择器
   * @param {any} fn 事件函数
   */
  on: function (element, eventType, selector, fn) {
    element.addEventListener(eventType, (e) => {
      // 获取当前点击对象
      let el = e.target
      //处理在html模板里面li标签里面嵌套了子标签还能正常使用
      while (!el.matches(selector)) {
        // 避免html模板中没有按指定的li标签做导航功能块
        if (element === el) {
          el = null
          break
        }
        el = el.parentNode
      }
      console.log(fn);
      el && fn.call(el, e, el)
    })
    return element
  },
  uniqueClass: function (element, className) {
    // console.log(el);
    dom.every(element.parentNode.children, (el) => {
      el.classList.remove(className)
    })
    element.classList.add(className)
    return element
  },
  every: function (nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      // TODO:call null有啥用
      fn.call(null, nodeList[i], i)
    }
    return nodeList
  },
  getIndex: function (element) {
    // 获取当前导航栏的项数
    let siblings = element.parentNode.children
    // 通过for循环找到当前index
    for (let index = 0; index < siblings.length; index++) {
      if (siblings[index] === element) {
        return index
      }
    }
    return -1
  },
}

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
      // 获取当前被点击块在导航栏中的索引
      let index = dom.getIndex(el)
      // 获取导航栏中的导航块集合
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