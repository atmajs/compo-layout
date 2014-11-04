var Size;
(function(){
	Size = function(val){
		this.type = Size.parseType(val);
		
		if ('px' === this.type || '%' === this.type) 
			this.value = parseFloat(val);
	};
	Size.prototype = {
		type: 'flex|auto|px|%',
		value: null,
		toString () {
			switch (this.type) {
				case 'px':
				case '%':
					return this.value + this.type;
				case 'auto':
					return 'auto';
				default:
					return null;
			}
		}
	};
	
	Size.parseType = function(val){
		if (val == null || val === 'flex') 
			return 'flex';
		if (val === 'auto') 
			return val;
		if (val.indexOf('px') !== -1) 
			return 'px';
		if (val.indexOf('%') !== -1) 
			return '%';
		
		throw_(`Invalid size value ${val}`);
	};
	
}());