var LRowsFluid = Compo(LayoutCompo, LayoutCompoFluid, {
	compoName: 'l:rows:fluid',
	attr: {
		'class': '-l-rows __fluid'
	},
	type: 'height',
	
	prepairBlocks_ () {
		var before = NodeTransform.wrapBefore(this.nodes, 'height', {
			position: 'relative'
		});
		var after = NodeTransform.wrapAfter(this.nodes, 'height');
		
		if (before != null || after != null) {
			NodeTransform.wrapFlexBlocks(
				this.nodes
				, 'height'
				, null
				, null
				, obj_extend(
					this.attr.overflow === 'visible'
					? { 'min-height': '100%' }
					: { 	'height': '100%' },
					css_BORDER_BOX
				)
			);
		} else {
			NodeTransform.shareSpace(this.nodes, 'height');
		}
		
		
		var blocks = MaskLayout.prepairBlockMetas(this.nodes, 'height');
		var layout = new MaskLayoutRowsFluid(
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
	
	LayoutController: LayoutRowsFluid,
});

mask.registerHandler('l:rows:fluid', LRowsFluid);