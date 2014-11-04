var NodeTransform;
(function(){
	
	NodeTransform = {
		wrapFlexBlocks (nodes, stretchCss, offsetCss, childCssObj, wrapCssObj) {
			var length = nodes.length,
				i,
				min, max;
			
			for(i = 0; i < length; i++) {
				if (isFlexNode(nodes[i], stretchCss))
					break;
			}
			min = i;
			
			for(i = length - 1; i > min; i--) {
				if (isFlexNode(nodes[i], stretchCss))
					break;
			}
			max = ++i;
			
			var node = null;
			var count = max - min;
			if (count < 2 ) {
				return returnSingleOrNone(nodes, stretchCss, min, max, wrapCssObj);
			}
			
			node = node_div(
				nodes.splice(min, count), {}
			);
			
			this.shareSpace(node.nodes, stretchCss, offsetCss, childCssObj);
			
			
			node_addCss(node, wrapCssObj);
			nodes.splice(min, 0, node);
			return node;
		},
		wrapBefore (nodes, stretchCss, css) {
			var imax = nodes.length,
				i;
			for(i = 0; i < imax; i++) {
				if (isFlexNode(nodes[i], stretchCss))
					break;
			}
			if (i < 2) {
				return returnSingleOrNone(nodes, stretchCss, 0, i, css);
			}
			imax = i;
			return wrapNodes(nodes, stretchCss, 0, imax, css);
		},
		wrapAfter (nodes, stretchCss, css) {
			var imax = nodes.length,
				i;
			for(i = imax - 1; i > -1; i--) {
				if (isFlexNode(nodes[i], stretchCss))
					break;
			}
			if (i >= imax - 2) {
				return returnSingleOrNone(nodes, stretchCss, i + 1, imax, css);
			}
			return wrapNodes(nodes, stretchCss, i + 1, imax, css);
		},
		
		shareSpace (nodes, stretchCss, offsetCss, childCssObj) {
			var offset = 0;
			var size = 100 / nodes.length;
			arr_each(nodes, node => {
				var css = stretchCss;
				if (node.attr.overflow === 'visible') {
					css = 'min-' + css;
				} else {
					node_writeCss(node, 'overflow: auto');
				}
				
				node_addCss(node, css, size + '%');
				node_addCss(node, offsetCss, offset + '%');
				node_addCss(node, childCssObj);
				offset += size;
			});
		}
	};
	
	
	function isFlexNode(node, stretchCss) {
		var attr = node.attr[stretchCss];
		return attr == null || attr === 'flex';
	}
	function wrapNodes(nodes, stretchCss, iStart, iEnd, cssObj) {
		var node = layout_wrapBlocks(nodes, stretchCss, iStart, iEnd);
		
		arr_each(node.nodes, node => layout_createMeta(node, stretchCss));
		node_addCss(node, cssObj);
		nodes.splice(iStart, iEnd - iStart, node);
		
		return node;
	}
	function returnSingleOrNone(nodes, stretchCss, iStart, iEnd, cssObj) {
		var count = iEnd - iStart;
		if (count === 0) 
			return null;
		
		var node = nodes[iStart];
		node_addCss(node, cssObj);
		return node;
	}
}());