var dom_addCss,
	dom_writeCss,
	dom_isElement;
(function(){
	dom_addCss = function (node, mix, val) {
		if (mix == null) 
			return;
		
		if (typeof mix === 'string') {
			addStyle(node, mix, val);
			return;
		}
		
		for(var key in mix){
			addStyle(node, key, mix[key]);
		}
	};
	dom_writeCss = function(node, css) {
		var current = node.getAttribute('style');
		node.setAttribute('style', current + ';' + css);
	};
	dom_isElement = function(node){
		return node != null && node.nodeType === 1;
	};
	
	function addStyle(node, key, val) {
		if (val == null) 
			return;
		
		node.style.setProperty(key, val);
	}
}());