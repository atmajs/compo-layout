mask.registerHandler('l:rows:absolute', Compo(LayoutCompo, {
	compoName: 'l:rows:absolute',
	attr: {
		'class': '-l-rows __absolute',
		'style': 'position: relative; width: 100%;'
	},
	resizerType: 'once',
	type: 'height',
	
	prepairBlocks_ () {
		NodeTransform.wrapFlexBlocks(this.nodes, 'height', 'top', {
			left : '0px',
			right: '0px',
			position: 'absolute'
		});
		
		var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'height', {
			position: 'absolute',
			left: '0px',
			width: '100%'
		});
		var layout = new MaskLayoutRowsAbsolute(
			this.nodes
			, blocks
			, this.attr
			, this.expression
		);
		if (layout.requiresDomController() === true) {
			return blocks;
		}
		layout.performLayout();
		/* No dynamic resizer required */
		return null;
	},
	
	LayoutController: LayoutRowsAbsolute,
}))