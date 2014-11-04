var node_div,
	node_addCss,
	node_writeCss;
(function(){
	node_div = function(children, attr){
		return {
			tagName: 'div',
			type: mask.Dom.NODE,
			nodes: children,
			attr: attr
		};
	};
	node_addCss = function(node, mix, val){
		if (mix == null) 
			return;
		
		var style = node.attr.style;
		
		if (typeof mix === 'string') {
			style = joinCss(style, mix, val);
		} else {
			for(var key in mix) {
				style = joinCss(style, key, mix[key]);
			}
		}
		
		node.attr.style = style;
	};
	node_writeCss = function(node, style){
		var current = node.attr.style;
		node.attr.style = (current || '') + ';' + style;
	};
	
	function joinCss(current, key, val) {
		if (val == null || val === '')
			return current;
			
		return (current || '') + ';' + key + ':' + val;
	}
}());