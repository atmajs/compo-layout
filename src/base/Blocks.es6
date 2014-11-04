var Block,
	BlockAbsolute,
	BlockFluid;
(function(){
	Block = function(element, opts){
		this.size = new Size(opts.size);
		this.overflow = opts.overflow;
		this.element = element;
	};
	
	Block.prototype = {
		element: null,
		name: 'Width|Height',
		css : 'width|height',
		overflow: 'auto|scroll|visible',
		size: null,
		offsetBefore: null,
		offsetAfter : null,
		
		isFlex () {
			return this.size.type === 'flex'
		},
		
		ensureStrict (owner, index, parentSize, offsetBefore) {
			this.offsetBefore = offsetBefore;
			
			var val = this.size.value;
			switch(this.size.type){
				case 'px':
					return val;
				case '%':
					return parentSize * val / 100;
				case 'auto':
					if (val == null) 
						val = this.size.value = this.offsetSize();
					return val;
			}
			throw Error('Unsupported type: ' + this.size.type);
		},
		
		ensureFlex (size, owner, index, parentSize, offsetBefore) {
			this.offsetBefore = offsetBefore;
			
			if (this.overflow !== 'visible') {
				this.size.value = size;
				this.element.style[this.css] = size + 'px';
				return 0;
			}
			
			// min-height
			this.size.value = size;
			this.element.style['min-height'] = size + 'px';
			
			var diff = this.offsetSize() - size;
			return diff < 0 ? 0 : diff;
		},
		
		dispose () {
			this.element = null;
		},
		
		offsetSize () {
			return this.element['offset' + this.name];
		},
		scrollSize () {
			return this.element['scroll' + this.name];
		},
		
		setCss (mix, val) {
			dom_addCss(this.element, mix, val);
			return this;
		}
	};
	
	
	BlockAbsolute = {
		ensureStrict (owner, index, parentSize, offsetBefore, anchor) {
			var position = anchor === 'before'
				? this.cssBefore
				: this.cssAfter
				;
			if (offsetBefore !== this.offsetBefore) 
				this.element.style[position] = offsetBefore + 'px';
			
			return Block.prototype.ensureStrict.call(
				this
				, owner
				, index
				, parentSize
				, offsetBefore);
		},
		ensureFlex (size, owner, index, parentSize, offsetBefore, offsetAfter) {
			var style = this.element.style;
			
			if (offsetBefore !== this.offsetBefore) {
				style[this.cssBefore] = (this.offsetBefore = offsetBefore) + 'px';
			}
			if (offsetAfter !== this.offsetAfter) {
				style[this.cssAfter] = (this.offsetAfter = offsetAfter) + 'px';
			}
			
			return offsetAfter - offsetBefore;
		}
	};
	
	BlockFluid = {
		ensureStrict (owner, index, parentSize, offsetBefore, anchor) {
			if ('after' === anchor) {
				var offset = this.element['offset' + this.name];
				dom_addCss(
					this.element
					, `margin-${this.cssBefore}`
					, `-${offset}px`
				);
			}
			
			return Block.prototype.ensureStrict.call(
				this
				, owner
				, index
				, parentSize
				, offsetBefore
			);
		},
		ensureFlex (size, owner, index, parentSize, offsetBefore, offsetAfter) {
			if (this.offsetBefore !== offsetBefore) {
				if (this.offsetBefore != null || offsetBefore !== 0) {
					this
						.setCss(`margin-${this.cssBefore}`, `-${offsetBefore}px`)
						.setCss(`padding-${this.cssBefore}`, `${offsetBefore}px`)
				}
				this.offsetBefore = offsetBefore;
			}
			if (this.offsetAfter !== offsetAfter) {
				if (this.offsetAfter != null || offsetAfter !== 0) {
					this.setCss(
						`padding-${this.cssAfter}`,
						`${offsetAfter}px`
					);	
				}
				this.offsetAfter = offsetAfter;
			}
			return offsetAfter - offsetBefore;
		}
	};
	
	
}());