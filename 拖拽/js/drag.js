var drag = (obj) => {
  var disX = 0;
  var disY = 0;

  obj.onmousedown = (ev) => {
    var ev = ev || window.event;
    disX = ev.clientX - obj.offsetLeft;
    disY = ev.clientY - obj.offsetTop;

    document.onmousemove = (ev) => {
      var ev = ev || window.event;
      obj.style.left = `${ev.clientX - disX}px`;
      obj.style.top = `${ev.clientY - disY}px`;
    }

    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
    }
  }
  return false;
}

