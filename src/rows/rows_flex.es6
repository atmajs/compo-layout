mask.registerHandler('l:rows:flex', Compo(LayoutCompo, {
	compoName: 'l:rows:flex',
	attr: {
		'class': '-l-rows __flex',
		'style': 'position: relative;' + flex_css_CONTAINER('column'),
		'overflow': 'scroll'
	},
	resizerType: 'none',
	type: 'height',
	
	constructor (node, model, ctx, container) {
		if (flex_supports(ctx) === false) 
			return new LRowsFluid();
		
		if (dom_isElement(container)) {
			dom_writeCss(container, flex_css_CONTAINER('column'));
			this.tagName = null;
		}
	},
	
	prepairBlocks_ () {
		
		arr_each(this.nodes, node => {
			var meta = layout_createMeta(node, 'height');
			if (meta.size === 'flex') {
				node_writeCss(node, flex_css_BLOCK());
			}
		});
		return null;
	}
}))