var MaskLayout,
	MaskLayoutAbsolute,
	MaskLayoutFluid
	;
(function(){
	
	MaskLayout = class_create({
		constructor (nodes, metas, attr) {
			this.nodes = nodes;
			this.metas = metas;
		},
		beforeCount: 0,
		afterCount: 0,
		performLayout () {
			var imax = this.metas.length,
				layout = {
					before: {
						value: 0,
						unit: 'px',
					},
					after: {
						value: 0,
						unit: 'px'
					}
				},
				size,
				flexIndex = null,
				current = 'before';
			
			for(var i = 0; i < imax; i++){
				size = new Size(this.metas[i].size);
				if (size.type === 'flex') {
					flexIndex = i;
					current = 'after';
					continue;
				}
				
				this[current + 'Count'] += 1;
				
				var data = layout[current];
				this.setStrict(
					this.nodes[i]
					, this.metas[i]
					, data.value + data.unit
					, current
				);
				
				data.unit = size.type;
				data.value += size.value;
			}
			
			this.setFlex(
				this.nodes[flexIndex]
				, this.metas[flexIndex]
				, layout.before.value + layout.before.unit
				, layout.after.value  + layout.after.unit
			);
		},
		
		requiresDomController () {
			var imax = this.metas.length,
				i = 0;
			var position = 'before',
				units = null, x, type;
			for(; i < imax; i++){
				type = Size.parseType(this.metas[i].size);
				
				if ('flex' === type) {
					if (position === 'after') {
						return true;
					}
					position = 'after';
					units = null;
					continue;
				}
				if ('auto' === type) 
					return true;
				
				if (units == null) {
					units = type;
					continue;
				}
				if (units !== type) 
					return true;
			}
			
			return false;
		},
		
		nodes: null,
		metas: null
	});
	
	MaskLayout.prepairBlockMetas = function(nodes, type /*height|width*/, cssObj){
		return arr_mapAny(nodes, node => layout_createMeta(node, type, cssObj));
	};
	
	MaskLayoutAbsolute = class_create(MaskLayout, {
		cssBefore: null,
		cssAfter : null,
		
		setStrict (node, meta, offset, position) {
			var css = position === 'before'
				? this.cssBefore
				: this.cssAfter
				;
			node_addCss(node, css, offset);
		},
		setFlex (node, meta, offsetBefore, offsetAfter) {
			var css = {};
			css[this.cssBefore] = offsetBefore;
			css[this.cssAfter] = offsetAfter;
			node_addCss(node, css);
		}
	});
	
	MaskLayoutFluid = class_create(MaskLayout, {
		cssMargin: 'margin-top|margin-left',
		setStrict (node, meta, offset, position) {
			if (position === 'after') {
				node_addCss(node, this.css, meta.size);
				node_addCss(node, this.cssMargin, '-' + meta.size);
			}
		},
		
		setFlex (node, meta, offsetBefore, offsetAfter) {
			var css = {};
			if (this.beforeCount !== 0) {
				css['margin-' + this.cssBefore] = '-' + offsetBefore;
				css['padding-' + this.cssBefore] = offsetBefore;
			}
			if (this.afterCount !== 0) {
				css['padding-' + this.cssAfter] = offsetAfter;
			}
			
			node_addCss(node, css);
		}
	});
	
}());