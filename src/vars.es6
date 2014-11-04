var requestAnimationFrame = (function(window){
  return  window.requestAnimationFrame       
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || function(fn){
			return window.setTimeout(fn, 1000 / 60);
		};
}(global));