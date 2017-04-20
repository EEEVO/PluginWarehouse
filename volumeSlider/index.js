/**
 * 公有函数:"事件处理"兼容函数
 * 
 * @param {Object} evnentObj 
 * @param {String} eventType 
 * @param {function} fn 
 * @param {Boolean} useCapture 
 */
function addEvent(evnentObj, eventType, fn, useCapture) {
  if (evnentObj.addEventListener) {
    evnentObj.addEventListener(eventType, fn, false, useCapture); //DOM 2.0
  } else if (evnentObj.attachEvent) {
    evnentObj.attachEvent('on' + eventType, fn); //IE5+
  } else {
    evnentObj['on' + eventType] = fn; //DOM 0.0
  }
}


/**
 * 公有函数:获取某元素以浏览器左上角为原点的坐标
 * 
 * @param {Object} obj 
 * @returns 
 */
function getPoint(obj) {
  var top = obj.offsetTop; //获取该元素对应父容器的上边距
  var left = obj.offsetLeft; //对应父容器的上边距
  var objPoint = {};
  //判断是否有父容器，如果存在则累加其边距
  while (obj = obj.offsetParent) {
    top += obj.offsetTop;
    left += obj.offsetLeft;
  }
  objPoint.top = top;
  objPoint.left = left;

  return objPoint;
}



/**
 * 公有函数:获取鼠标的X.Y轴坐标
 * 
 * @param {any} evt 
 * @returns 
 */
function mousePosition(evt) {
  evt = evt || window.event;
  //Mozilla
  if (evt.pageX || evt.pageY) {
    return {
      x: evt.pageX,
      y: evt.pageY
    }
  }
  //IE
  return {
    x: evt.clientX + document.body.scrollLeft - document.body.clientLeft,
    y: evt.clientY + document.body.scrollTop - document.body.clientTop
  }
}


/**
 * 私有函数:_bg1的单击事件
 * 
 */
function _bg1_click() {
  if (!statu) {
    box1_left = getPoint(_bg1).left;
    
  }
}
















function addEvent(element, type, handler) {
  //为每一个事件处理函数分派一个唯一的ID
  if (!handler.$$guid) handler.$$guid = addEvent.guid++;
  //为元素的事件类型创建一个哈希表
  if (!element.events) element.events = {};
  //为每一个"元素/事件"对创建一个事件处理程序的哈希表
  var handlers = element.events[type];
  if (!handlers) {
    handlers = element.events[type] = {};
    //存储存在的事件处理函数(如果有)
    if (element["on" + type]) {
      handlers[0] = element["on" + type];
    }
  }
  //将事件处理函数存入哈希表
  handlers[handler.$$guid] = handler;
  //指派一个全局的事件处理函数来做所有的工作
  element["on" + type] = handleEvent;
};
//用来创建唯一的ID的计数器
addEvent.guid = 1;

function removeEvent(element, type, handler) {
  //从哈希表中删除事件处理函数
  if (element.events && element.events[type]) {
    delete element.events[type][handler.$$guid];
  }
};

function handleEvent(event) {
  var returnValue = true;
  //抓获事件对象(IE使用全局事件对象)
  event = event || fixEvent(window.event);
  //取得事件处理函数的哈希表的引用
  var handlers = this.events[event.type];
  //执行每一个处理函数
  for (var i in handlers) {
    this.$$handleEvent = handlers[i];
    if (this.$$handleEvent(event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
};
//为IE的事件对象添加一些“缺失的”函数
function fixEvent(event) {
  //添加标准的W3C方法
  event.preventDefault = fixEvent.preventDefault;
  event.stopPropagation = fixEvent.stopPropagation;
  return event;
};
fixEvent.preventDefault = function () {
  this.returnValue = false;
};
fixEvent.stopPropagation = function () {
  this.cancelBubble = true;
};