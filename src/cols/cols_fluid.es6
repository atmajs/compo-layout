var LColsFluid = Compo(LayoutCompo, LayoutCompoFluid, {
	compoName: 'l:cols:fluid',
	attr: {
		'class': '-l-cols __fluid',
		'style': 'position: relative; width: 100%; min-height: 100%; vertical-align: top'
	},
	type: 'width',
	prepairBlocks_ () {
		NodeTransform.wrapBefore(this.nodes, 'width', {
			'position': 'relative',
			'height': '100%',
			'display': 'inline-block',
			'vertical-align': 'top'
		});
		NodeTransform.wrapAfter(this.nodes, 'width', {
			'display': 'inline-block',
			'height': '100%',
			'vertical-align': 'top'
		});
		NodeTransform.wrapFlexBlocks(this.nodes, 'width', null, null, {
			'height': '100%',
			'min-width': '100%',
			'box-sizing': 'border-box',
			'-moz-box-sizing': 'border-box',
			'display': 'inline-block',
			'vertical-align': 'top'
		});
		
		
		var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'width');
		var layout = new MaskLayoutColsFluid(
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
	
	LayoutController: LayoutColsFluid,
});
mask.registerHandler('l:cols:fluid', LColsFluid);