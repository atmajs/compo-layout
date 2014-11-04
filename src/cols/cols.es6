mask.registerHandler('l:rows', Compo({
	tagName: 'div',
	attr: {
		'class': '-l-rows'
	},
	slots: {
		resize: 'reflow_',
		domInsert: 'reflow_'
	},
	
	flexContainer_: null,
	constructor () {
		this.reflow_ = this.reflow_.bind(this);
	},
	renderStart () {
		var rows = FlexContainerCols.prepairMask(this.nodes);
		this.scope = {
			$rows: rows
		};
	},
	renderEnd (els) {
		var container =  els[0],
			elements  = Array.prototype.slice.call(container.childNodes);
			
		this.flexContainer_ = new FlexContainerRows(
			container
			, elements
			, this.scope.$rows
			, this.attr
		);
		ResizeListener.bind(this.reflow_);
	},
	
	reflow_ () {
		this.flexContainer_.reflow();
	},
	
	dispose () {
		this.flexContainer_.dispose();
		ResizeListener.unbind(this.reflow_);
	}
}))