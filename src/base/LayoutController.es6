var LayoutController;
(function(){
	LayoutController = class_create({
		constructor (container, elements, metas, attr) {
			this.overflow = attr.overflow || 'auto';
			this.element = container;
			this.blocks  = new Array(metas.length);
			if (metas.length !== elements.length) 
				throw Error('Element-Meta mismatch');
			
			metas.forEach((x, i) => {
				var el = elements[i],
					meta =  metas[i],
					block = new this.Block(el, meta);
				if (block.isFlex()) 
					this.flexCount++;
				
				this.blocks[i] = block;
			});
		},
		
		name: 'Width|Height',
		css : 'width|height',
		element: null,
		size: 0,
		sizeGetter: 'offsetSize',
		flexCount: 0,
		reflowRequired: true,
		
		Block: null,
		
		checkReflowRequired () {
			var size = this[this.sizeGetter]();
			if (size === this.size) 
				return false;
			
			this.size = size;
			this.reflowRequired = true;
			return true;
		},
		
		reflow () {
			if (this.reflowRequired !== true) 
				return;
			
			var size = this.processReflow_();
			
			this.reflowRequired = false;
			if (this.overflow === 'visible' && this.size < size) {
				this.size = Math.ceil(size);
				this.element.style[this.css] = this.size + 'px';
			}
		},
		
		processReflow_ () {
			var size = this.size,
				strictSize = 0,
				flexSize = 0,
				flexCount = this.flexCount,
				flexSingleSize = 0
				;
			
			var imax = this.blocks.length,
				imin,
				i,
				x,
				offset,
				offsetStrictTop,
				offsetStrictBottom,
				blockSize;
			
			// top strict
			for(i = 0, offset = 0; i < imax; i++){
				x = this.blocks[i];
				if (x.isFlex() === true) 
					break;
				
				blockSize = x.ensureStrict(this, i, size, offset, 'before');
				strictSize += blockSize;
				offset += blockSize;
			}
			imin = i;
			offsetStrictTop = offset;
			
			// bottom
			for(i = imax - 1, offset = 0; i > imin; i--) {
				x = this.blocks[i];
				if (x.isFlex() === true) 
					break;
				
				blockSize = x.ensureStrict(this, i, size, offset, 'after');
				strictSize += blockSize;
				offset += blockSize;
			}
			imax = ++i;
			offsetStrictBottom = offset;
			
			flexSingleSize = Math.round((size - strictSize) / flexCount);
			
			// middle (flex only)
			for(i = imin, offset = offsetStrictTop; i < imax; i++) {
				x = this.blocks[i];
				if (x.isFlex() === false) {
					console.error('<strict block size in the middle>');
					continue;
				}
				var overflowed = x.ensureFlex(
					flexSingleSize
					, this
					, i
					, size
					, offsetStrictTop
					, offsetStrictBottom
				);
				blockSize = flexSingleSize + overflowed;
				flexSize += blockSize;
				offset += blockSize;
			}
			
			return flexSize + strictSize;
		},
		
		offsetSize () {
			return this.element['offset' + this.name];
		},
		scrollSize () {
			return this.element['scroll' + this.name];
		},
		
		dispose () {
			this.element = null;
			this.blocks.forEach(x => x.dispose());
		}
	});
	
	
}());