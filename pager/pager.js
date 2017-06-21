class Pager {
  constructor(options) {
    let defaultOptions = {
      // 当前对象
      element: null,
      // 分页器按钮个数
      buttonCount: 10,
      // 当前页数
      currentPage: 1,
      // 总页数
      totalPage: 1,
      pageQuery: '', // 'page'
      // 模板类型默认
      templates: {
        number: '<span>%page%</span>',
        prev: '<button class=prev>上一页</button>',
        next: '<button class=next>下一页</button>',
        first: '<button class=first>首页</button>',
        last: '<button class=last>末页</button>',
      },
    }
    this.options = Object.assign({}, defaultOptions, options);
    this.domRefs = {};
    this.currentPage = parseInt(this.options.currentPage, 10) || 1;
    this.checkOptions().initHtml().bindEvents();
  }
  // 检查配置项
  checkOptions() {
    // 判断当前是否指定元素
    if (!this.options.element) {
      throw new Error('element is required');
    }
    return this;
  }
  // 初始化分页栏结构
  initHtml() {
    // 创建分页栏内容
    let pager = (this.domRefs.pager = document.createElement('nav'));

    //将首页，尾页，上页，下页四个节点插入到this.domRefs属性中去保存
    this.domRefs.first = dom.create(this.options.templates.first);
    this.domRefs.prev = dom.create(this.options.templates.prev);
    this.domRefs.next = dom.create(this.options.templates.next);
    this.domRefs.last = dom.create(this.options.templates.last);

    // 计算首页，尾页，上页，下页的按钮状态
    this._checkButtons();
    // 动态计算分页栏中的按钮状态
    this.domRefs.numbers = this._createNumbers();

    // 拼接dom
    pager.appendChild(this.domRefs.first);
    pager.appendChild(this.domRefs.prev);
    pager.appendChild(this.domRefs.numbers);
    pager.appendChild(this.domRefs.next);
    pager.appendChild(this.domRefs.last);
    this.options.element.appendChild(pager);

    return this
  }

  // 根据当前的按钮页数去检查按钮状态
  _checkButtons() {
    // 如果当期默认按钮设置的是第一个，// 禁用首页与上一页按钮
    if (this.currentPage === 1) {
      this.domRefs.first.setAttribute('disabled', '')
      this.domRefs.prev.setAttribute('disabled', '')
    } else {
      this.domRefs.first.removeAttribute('disabled')
      this.domRefs.prev.removeAttribute('disabled')
    }
    // 如果当前默认按钮设置的是最后一个， 禁用尾页与下一页按钮
    if (this.currentPage === this.options.totalPage) {
      this.domRefs.next.setAttribute('disabled', '')
      this.domRefs.last.setAttribute('disabled', '')
    } else {
      this.domRefs.next.removeAttribute('disabled')
      this.domRefs.last.removeAttribute('disabled')
    }
  }

  // 绑定事件
  bindEvents() {
    dom.on(this.options.element, 'click', 'ol[data-role="pageNumbers"]>li', (e, el) => {
      console.log(el); /*li标签*/
      this.goToPage(parseInt(el.dataset.page, 10));
    });
    this.domRefs.first.addEventListener('click', () => {
      this.goToPage(1);
    });
    this.domRefs.last.addEventListener('click', () => {
      this.goToPage(this.options.totalPage);
    });
    this.domRefs.prev.addEventListener('click', () => {
      this.goToPage(this.currentPage - 1);
    });
    this.domRefs.next.addEventListener('click', () => {
      this.goToPage(this.currentPage + 1);
    });
  }
  goToPage(page) {
    if (!page || page > this.options.totalPage || page === this.currentPage) {
      return
    }
    if (this.options.pageQuery) {
      bom.queryString.set(this.options.pageQuery, page)
    }
    this.currentPage = page
    this.options.element.dispatchEvent(new CustomEvent('pageChange', {
      detail: {
        page
      }
    }))
    this.rerender()
  }
  rerender() {
    this._checkButtons()
    let newNumbers = this._createNumbers()
    let oldNumbers = this.domRefs.numbers
    oldNumbers.parentNode.replaceChild(newNumbers, oldNumbers)
    this.domRefs.numbers = newNumbers
  }

  // 动态计算分页栏中的按钮
  _createNumbers() {
    //获取当前的页数
    let currentPage = this.currentPage
    //分别获取到当前配置的初始按钮个数与总页数
    let {
      buttonCount,
      totalPage
    } = this.options;

    // let start1 = Math.max(currentPage - Math.round(buttonCount / 2), 1);
    let start1;
    // 如果当前按钮页数小于分页栏按钮长度的一半，则说明第一个按钮为1
    // 反之如果当前按钮页数，大于分页按钮长度的一半，则第一个按钮？？
    if (currentPage - Math.round(buttonCount / 2) < 1) {
      start1 = 1;
    } else {
      // 当前页数向前推按钮长度的一半就是第一个按钮的页数
      start1 = currentPage - Math.round(buttonCount / 2);
    }

    // let end2 = Math.min(currentPage + Math.round(buttonCount / 2) - 1, totalPage);
    let end2;
    // 如果当前按钮页数加上分页按钮的一半大于总页数
    // 同理，后面那个按钮的页数就是向后推按钮长度的一半-1
    if (currentPage + Math.round(buttonCount / 2) - 1 > totalPage) {
      end2 = totalPage;
    } else {
      end2 = currentPage + Math.round(buttonCount / 2) - 1
    }

    let start2 = Math.max(end2 - buttonCount + 1, 1);
    let end1 = Math.min(start1 + buttonCount - 1, totalPage);

    // TODO:重写逻辑
    let start;
    let end;
    // 总页数小于按钮长度
    if (totalPage < buttonCount) {
      start = 1;
      end = totalPage;

    }
    // // 总页数等于于按钮长度
    // if (totalPage = buttonCount) {
    //   start = end = totalPage;

    // }

    // 总页数大于按钮长度
    if (totalPage > buttonCount) {
      if (currentPage - Math.round(buttonCount / 2) < 1) {
        start = 1;
        end = currentPage + Math.round(buttonCount) - 1;
      } else {
        // 当前页数向前推按钮长度的一半就是第一个按钮的页数
        start = currentPage - Math.round(buttonCount / 2);
        if (currentPage + Math.round(buttonCount / 2) - 1 > totalPage) {
          end = totalPage;
        } else {
          end = currentPage + Math.round(buttonCount / 2) - 1;
        }
      }
    }



    // TODO:源码可用
    // let start = Math.min(start1, start2);
    // let end = Math.max(end1, end2);

    let ol = dom.create('<ol data-role="pageNumbers"></ol>');
    let numbers = [];

    // 循环添加button至分页栏中
    for (var i = start; i <= end; i++) {
      let li = dom.create(`<li data-page="${i}">${this.options.templates.number.replace('%page%', i)}</li>`)
      if (i === currentPage) {
        li.classList.add('current')
      }
      ol.appendChild(li)
    }

    return ol
  }
}