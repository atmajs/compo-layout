var ResizeListener;
(function(){
	var layouts_ = [];
	ResizeListener = {
		register (layout) {
			if (layout == null) return;
			
			layouts_.unshift(layout);
			startResizeListener();
		},
		unregister (layout) {
			if (layout == null) return;
			
			var i = listeners_.indexOf(layout);
			if (i !== -1) {
				layouts_.splice(i, 1);
			}
		}
	};
	
	function reflow(){
		var imax = layouts_.length,
			i;
		for(i = 0; i < imax; i++){
			layouts_[i].checkReflowRequired();
		}
		for(i = 0; i < imax; i++){
			layouts_[i].reflow();
		}
	}
	
	var startResizeListener;
	(function(){
		startResizeListener = function () {
			startResizeListener = function(){};
			window.addEventListener('resize', onresize, false);
		}
		
		var debounced = false;
		function onresize() {
			if (debounced) 
				return;
			
			debounced = true;
			requestAnimationFrame(() => {
				debounced = false;
				reflow();
			});
		}	
	}());
	
}());