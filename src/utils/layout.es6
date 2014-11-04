var layout_hasType,
	layout_wrapBlocks,
	layout_createMeta;
(function(){
	layout_hasType = function (nodes, stretchCss, type, i, imax) {
		if (arguments.length === 3) {
			i = 0;
			imax = nodes.length;
		}
		for(; i < imax; i++) {
			var actual = Size.parseType(nodes[i].attr[stretchCss]);
			if (actual === type) 
				return true;
		}
		return false;
	};
	
	layout_wrapBlocks = function(nodes, stretchCss, index, imax) {
		if (arguments.length === 2) {
			index = 0;
			imax = nodes.length;
		}
		var i, wrapperSize, size;
		for(i = index; i < imax; i++) {
			size = new Size(nodes[i].attr[stretchCss]);
			if (wrapperSize == null) {
				wrapperSize = size;
				continue;
			}
			if (wrapperSize.type !== size.type) {
				wrapperSize.type = 'auto';
				break;
			}
			wrapperSize.value += size.value;
		}
		
		var node = node_div(nodes.slice(index, imax), {});
		node.attr[stretchCss] = String(wrapperSize);
		
		return node;
	};
	
	layout_createMeta = function (node, stretchCss, cssObj) {
		var attr = node.attr;
		var size   = attr[stretchCss],
			min      = attr['min-' + stretchCss],
			max      = attr['max-' + stretchCss],
			overflow = attr['overflow']
			;
		
		if (size !== 'flex') {
			node_addCss(node, stretchCss, size);
		}
		node_addCss(node, 'min-' + stretchCss, min);
		node_addCss(node, 'max-' + stretchCss, max);
		node_addCss(node, 'overflow', overflow);
		node_addCss(node, cssObj);
		
		if (size != null) 
			attr[stretchCss] = null;
		if (min != null) 
			attr['min-' + stretchCss] = null;
		if (max != null) 
			attr['max-' + stretchCss] = null;
		if (overflow != null) 
			attr['overflow'] = null;
		
		if (size == null) 
			size = 'flex';
			
		return { size, min, max, overflow };
	};
}());