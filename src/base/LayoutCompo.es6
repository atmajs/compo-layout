var LayoutCompo = {
	tagName: 'div',
	type: 'width|height',
	layout: null,
	resizerType: 'dynamic',
	attr: {
		overflow: 'auto'
	},
	slots: {
		domInsert () {
			if (this.layout == null) 
				return;
			
			this.layout.checkReflowRequired()
			this.layout.reflow()
		},
		layout_Recalculate () {
			return this.layout.checkReflowRequired();
		},
		layout_Reflow () {
			this.layout.reflow();
		}
	},
	
	renderStart () {
		this.handleAttr_();
		this.handleExpression_();
		
		var blocks = this.prepairBlocks_();
		if (blocks == null) {
			this.slots = null;
		} else {
			this.scope = {
				$blocks: blocks
			};
		}
	},
	
	renderEnd (els, model, ctx, el) {
		var blocks = this.scope && this.scope.$blocks;
		if (blocks == null) 
			return;
		
		var [ container, elements ] =  this.resolveElements(
			els, model, ctx, el
		);
		
		this.layout = new this.LayoutController(
			container
			, elements
			, blocks
			, this.attr
		);
		
		if (this.resizerType === 'dynamic') 
			ResizeListener.register(this.layout);
		
	},
	
	resolveElements (els) {
		var container = els[0],
			elements  = Array.prototype.slice.call(container.childNodes) 
		return [ container, elements ];
	},
	
	dispose () {
		if (this.layout == null) 
			return;
		
		this.layout.dispose();
		ResizeListener.unregister(this.layout);
	},
	
	handleExpression_ () {
		if (this.expression == null) 
			return;
		
		var { nodes, type, expression } = this;
		
		var sizes = expression.split(
			expression.indexOf(',') === -1 ? ' ' : ','
		);
		if (sizes.length !== nodes.length) {
			throw Error(
			  `Expression for ${sizes.length}, but expected for ${nodes.length} elements. ${expression}`
			);
		}
		
		arr_each(nodes, (node, i) =>
			node.attr[type] = sizes[i].trim()
		);
	},
	handleAttr_ () {
		var width  = 'width: 100%',
			height = 'height: 100%';
		if (this.attr.overflow === 'visible') {
			width  = 'min-' + width;
			height = 'min-' + height;
		}
		
		node_writeCss(this, width + ';' + height);
	}
};