(function(){

	mask.registerHandler('l:center', {
		renderStart () {
			
			this.nodes = createNode(
				'display: table; height: 100%; width: 100%; overflow: auto'
				, createNode(
					'display: table-cell; vertical-align: middle; text-align:center'
					, this.nodes
					, this.attr
				)
			);
		}
	});
	
	function createNode(style, nodes, attr) {
		if (attr == null) 
			return node_div(nodes, { style: style });
		
		attr.style = attr.style
			? attr.style + ';'  + style
			: style
			;
		return node_div(nodes, attr);
	}
}());
