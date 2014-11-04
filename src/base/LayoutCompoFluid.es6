var LayoutCompoFluid = {
	attr: {
		'overflow': 'visible'
	},
	handleAttr_ () {
		this.tagName = null;
	},
	
	resolveElements (els, model, ctx, container) {
		return [ container, els ];
	},
	resizerType: 'once',
};