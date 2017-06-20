let dom = {
  /**
   * es6版
   * 添加事件
   * 
   * @param {any} element 目标对象
   * @param {any} eventType 事件类型
   * @param {any} selector 
   * @param {any} fn 
   */
  on: function (element, eventType, selector, fn) {
    element.addEventListener(eventType, (e) => {
      // 获取当前点击对象
      let el = e.target
      // TODO:如果这里el.matches(selector)是为了判断当前对象是在这个选择器下。为啥里面还有一个if
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

  index: function (element) {
    let siblings = element.parentNode.children
    for (let index = 0; index < siblings.length; index++) {
      if (siblings[index] === element) {
        return index
      }
    }
    return -1
  },

  uniqueClass: function (element, className) {
    dom.every(element.parentNode.children, el => {
      el.classList.remove(className)
    })
    element.classList.add(className)
    return element
  },

  every: function (nodeList, fn) {
    for (var i = 0; i < nodeList.length; i++) {
      fn.call(null, nodeList[i], i)
    }
    return nodeList
  },

  // http://stackoverflow.com/a/35385518/1262580
  create: function (html, children) {
    var template = document.createElement('template')
    template.innerHTML = html.trim()
    let node = template.content.firstChild
    if (children) {
      dom.append(node, children)
    }
    return node
  },

  append: function (parent, children) {
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


/**
 * 兼容到ie8
 * 
 * @param {any} element 
 * @param {any} selector 
 * @returns 
 */
function matchesSelector(element, selector) {
  if (element.matches) {
    return element.matches(selector);
  } else if (element.matchesSelector) {
    return element.matchesSelector(selector);
  } else if (element.webkitMatchesSelector) {
    return element.webkitMatchesSelector(selector);
  } else if (element.msMatchesSelector) {
    return element.msMatchesSelector(selector);
  } else if (element.mozMatchesSelector) {
    return element.mozMatchesSelector(selector);
  } else if (element.oMatchesSelector) {
    return element.oMatchesSelector(selector);
  } else if (element.querySelectorAll) {
    var matches = (element.document || element.ownerDocument).querySelectorAll(selector),
      i = 0;

    while (matches[i] && matches[i] !== element) i++;
    return matches[i] ? true : false;
  }
  throw new Error('Your browser version is too old,please upgrade your browser');
}