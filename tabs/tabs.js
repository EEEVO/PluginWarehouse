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
      el && fn.call(el, e, el)
    })
    return element
  },
  //设置选中状态
  uniqueClass: function (element, className) {
    // 遍历element.parentNode.children，移除className
    dom.every(element.parentNode.children, (el) => {
      el
        .classList
        .remove(className)
    })
    // 为选中项添加className
    element
      .classList
      .add(className)

    return element
  },
  // 遍历dom，对其每一项item运行fn
  every: function (nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
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
  }
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
      index: 0
    }
    this.options = Object.assign({}, defaultOptions, options)
    this
      .checkOptions()
      .bindEvents()
      .setDefaultTab(options.index == null
        ? defaultOptions.index
        : options.index)
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
      // 获取导航栏中的导航内容块集合
      let children = this
        .options
        .element
        .querySelector(this.options.panesSelector)
        .children
      //TODO:此处设计导航栏应一一与导航块对应，导航块的状态应该与导航栏直接绑定设置，无须分别两次设置 设置导航栏的状态事件
      dom.uniqueClass(el, this.options.activeClassName)
      // 设置导航块的状态事件
      dom.uniqueClass(children[index], this.options.activeClassName)
    })
    return this
  }
  
  // TODO:可以完善为自由添加索引，默认是哪项初始化被选中 设置默认的选项
  setDefaultTab(index) {
    this
      .options
      .element
      .querySelectorAll(`${this.options.navSelector}>li`)[index]
      .click()
    return this
  }
}