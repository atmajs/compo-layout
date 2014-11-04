mask.registerHandler('l:cols:flex', Compo(LayoutCompo, {
	compoName: 'l:cols:flex',
	attr: {
		'class': '-l-cols __flex',
		'style': 'position: relative;' + flex_css_CONTAINER('row'),
		'overflow': 'scroll'
	},
	resizerType: 'none',
	type: 'width',
	
	constructor (node, model, ctx, container) {
		if (flex_supports(ctx) === false) 
			return new LColsFluid();
		
		if (dom_isElement(container)) {
			dom_writeCss(container, flex_css_CONTAINER('row'));
			this.tagName = null;
		}
		
		//arr_each(node.nodes, node => {
		//	var meta = layout_createMeta(node, 'width');
		//	if (meta.size === 'flex') {
		//		node_writeCss(node, flex_css_BLOCK());
		//	}
		//});
	},
	
	prepairBlocks_ () {
		
		arr_each(this.nodes, node => {
			var meta = layout_createMeta(node, 'width');
			if (meta.size === 'flex') {
				node_writeCss(node, flex_css_BLOCK());
			}
		});
		return null;
	}
}))