      // 对象声明区
      var _box1 = document.getElementById("box1");
      var _bg1 = document.getElementById("bg1");
      var _bgColor1 = document.getElementById("bgColor1");
      var _btn1 = document.getElementById("btn1");
      var _text1 = document.getElementById("text1");


      // 变量声明区
      var statu = false; //"按钮"状态变量,true=按下,false=未按下
      var btn1_left = 0; //"按钮"距离父容器的左边距,也是"颜色进度条"width
      var bg1_width = 0; //"进度条"距离文档的左边距
      var box1_left = 0; //"滑动块"距离文档的左边距
      var mouse_x; //鼠标距离父容器左边的距离
      var btn1_x;

      window.onload = function () {
        // 添加点击移动函数
        //IE5+以下未考虑
        addEvent(_bg1, "click", _bg1_click, false);
        addEvent(_btn1, "mousedown", _btn1_mouseDown, false);
        addEvent(_btn1, "mouseup", _btn1_mouseUp, false);
        addEvent(_box1, "mousemove", _box1_mouseMove, false);
        addEvent(_box1, "mouseout", _box1_mouseOut, false);
      }



      /**
       * 私有函数:_bg1的单击事件
       * 
       */
      function _bg1_click() {
        if (!statu) {
          mouse_left = mousePosition().left;
          box1_left = getPoint(_bg1).left;
          btn1_left = mouse_left - box1_left;
          _btn1.style.left = btn1_left + "px";
          _bgColor1.style.width = btn1_left + "px";
        }
      }


      /**
       * 私有函数：按下按钮事件
       * 
       * @param {Object} event 
       */
      function _btn1_mouseDown(event) {
        btn1_x = _btn1.style.left.split('px')[0];
        mouse_x = mousePosition().left - btn1_x;
        // mouse_x = mousePosition().left;
        statu = true;
      }

      /**
       * 私有函数：移出按钮事件
       * 
       * @param {Object} event 
       */
      function _btn1_mouseUp(event) {
        statu = false;
      }

      /**
       * 私有方法：鼠标移动事件
       * 
       */
      function _box1_mouseMove() {
        //鼠标按住按钮时代表想开始拖动
        if (statu) {
          distance = mousePosition().left - mouse_x;
          console.log(distance);
          // 防止移出
          if (distance < 0) {
            distance = 0;
          } else if (distance > 200) {
            distance = 200;
          }
          _btn1.style.left = distance + 'px';
          _bgColor1.style.width = distance + 'px';
        }
      }

      /**
       * 私有方法：鼠标离开_box1时触发
       * 
       */
      function _box1_mouseOut() {
        statu = false;
      }
















      // function addEvent(element, type, handler) {
      //   //为每一个事件处理函数分派一个唯一的ID
      //   if (!handler.$$guid) handler.$$guid = addEvent.guid++;
      //   //为元素的事件类型创建一个哈希表
      //   if (!element.events) element.events = {};
      //   //为每一个"元素/事件"对创建一个事件处理程序的哈希表
      //   var handlers = element.events[type];
      //   if (!handlers) {
      //     handlers = element.events[type] = {};
      //     //存储存在的事件处理函数(如果有)
      //     if (element["on" + type]) {
      //       handlers[0] = element["on" + type];
      //     }
      //   }
      //   //将事件处理函数存入哈希表
      //   handlers[handler.$$guid] = handler;
      //   //指派一个全局的事件处理函数来做所有的工作
      //   element["on" + type] = handleEvent;
      // };
      // //用来创建唯一的ID的计数器
      // addEvent.guid = 1;

      // function removeEvent(element, type, handler) {
      //   //从哈希表中删除事件处理函数
      //   if (element.events && element.events[type]) {
      //     delete element.events[type][handler.$$guid];
      //   }
      // };

      // function handleEvent(event) {
      //   var returnValue = true;
      //   //抓获事件对象(IE使用全局事件对象)
      //   event = event || fixEvent(window.event);
      //   //取得事件处理函数的哈希表的引用
      //   var handlers = this.events[event.type];
      //   //执行每一个处理函数
      //   for (var i in handlers) {
      //     this.$$handleEvent = handlers[i];
      //     if (this.$$handleEvent(event) === false) {
      //       returnValue = false;
      //     }
      //   }
      //   return returnValue;
      // };
      // //为IE的事件对象添加一些“缺失的”函数
      // function fixEvent(event) {
      //   //添加标准的W3C方法
      //   event.preventDefault = fixEvent.preventDefault;
      //   event.stopPropagation = fixEvent.stopPropagation;
      //   return event;
      // };
      // fixEvent.preventDefault = function () {
      //   this.returnValue = false;
      // };
      // fixEvent.stopPropagation = function () {
      //   this.cancelBubble = true;
      // };