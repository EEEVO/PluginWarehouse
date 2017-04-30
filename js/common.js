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
       * @returns x：横坐标   y：纵坐标
       */
      function mousePosition(evt) {
        evt = evt || window.event;
        //Mozilla
        if (evt.pageX || evt.pageY) {
          return {
            left: evt.pageX,
            top: evt.pageY
          }
        }
        //IE
        return {
          left: evt.clientX + document.body.scrollLeft - document.body.clientLeft,
          top: evt.clientY + document.body.scrollTop - document.body.clientTop
        }
      }