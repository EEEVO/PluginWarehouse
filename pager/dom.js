let dom = {
  /**
   * 添加事件
   * 
   * @param {object} element 目标对象
   * @param {string} eventType 事件类型
   * @param {string} selector 一般是css选择器
   * @param {function} fn 绑定的事件函数
   * @returns 传入的目标对象
   */
  on(element, eventType, selector, fn) {
    element.addEventListener(eventType, e => {
      let el = e.target
      while (!el.matches(selector)) {
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

  onSwipe: function (element, fn) {
    let x0, y0
    element.addEventListener('touchstart', function (e) {
      x0 = e.touches[0].clientX
      y0 = e.touches[0].clientY
    })
    element.addEventListener('touchmove', function (e) {
      if (!x0 || !y0) {
        return
      }
      let xDiff = e.touches[0].clientX - x0
      let yDiff = e.touches[0].clientY - y0

      if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          fn.call(element, e, 'right')
        } else {
          fn.call(element, e, 'left')
        }
      } else {
        if (yDiff > 0) {
          fn.call(element, e, 'down')
        } else {
          fn.call(element, e, 'up')
        }
      }
      x0 = undefined
      y0 = undefined
    })
  },

  /**
   * 
   * 
   * @param {any} element 
   * @returns 
   */
  index(element) {
    let siblings = element.parentNode.children
    for (let index = 0; index < siblings.length; index++) {
      if (siblings[index] === element) {
        return index
      }
    }
    return -1
  },

  uniqueClass(element, className) {
    dom.every(element.parentNode.children, el => {
      el.classList.remove(className)
    })
    element.classList.add(className)
    return element
  },

  every(nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i], i)
    }
    return nodeList
  },

  /**
   * 
   * 
   * @param {String} html 模板字符串，类似于<button class=first>首页</button>
   * @param {any} children 
   * @returns 
   */
  create(html, children) {
    // 创建一个模板dom元素
    var template = document.createElement('template')
    // 去除传入的模板串中的空格
    template.innerHTML = html.trim()
    let node = template.content.firstChild
    if (children) {
      dom.append(node, children)
    }
    return node
  },
  append(parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = 0; i < children.length; i++) {
      parent.appendChild(children[i])
    }
    return parent
  },
  prepend: function (parent, children) {
    if (children.length === undefined) {
      children = [children]
    }
    for (let i = children.length - 1; i >= 0; i--) {
      if (parent.firstChild) {
        parent.insertBefore(children[i], parent.firstChild)
      } else {
        parent.appendChild(children[i])
      }
    }
    return parent
  },
  removeChildren: function (element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild)
    }
    return this
  },

  dispatchEvent: function (element, eventType, detail) {
    let event = new CustomEvent('pageChange', {
      detail
    })
    element.dispatchEvent(event)
    return this
  },
}