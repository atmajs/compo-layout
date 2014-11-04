mask.registerHandler('l:cols:absolute', Compo(LayoutCompo, {
	
	attr: {
		'class': '-l-rows __absolute',
		'style': 'position: relative; width: 100%; height: 100%;'
	},
	resizerType: 'once',
	type: 'width',
	
	prepairBlocks_ () {
		NodeTransform.wrapFlexBlocks(this.nodes, 'width', 'left', {
			bottom: '0px',
			top: '0px',
			position: 'absolute'
		});
		
		var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'width', {
			position: 'absolute',
			top: '0px',
			height: '100%'
		});
		var layout = new MaskLayoutColsAbsolute(
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
	
	LayoutController: LayoutColsAbsolute,
}))