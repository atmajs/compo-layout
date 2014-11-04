var class_create;
(function(){
	class_create = function(...args) {
		var Proto = args.pop();
		if (Proto == null) {
			Proto = {};
		}
		var Ctor = Proto.hasOwnProperty('constructor')
				? Proto.constructor
				: null,
			BaseCtor;
		
		
		var i = args.length, x, Parent;
		while ( --i > -1 ) {
			x = args[i];
			if (typeof x === 'function') {
				if (Ctor == null && BaseCtor == null) 
					BaseCtor = x;
				
				x = x.prototype;
			}
			for(var key in x){
				if (Proto[key] == null) {
					Proto[key] = x[key];
				}
			}
			if (Parent == null) {
				Parent = x;
			}
		}
		
		Proto.Parent = Parent
		
		if (Ctor == null)  {
			Ctor = function(...args){
				if (BaseCtor)
					return BaseCtor.apply(this, args);
			};
		}
		
		Ctor.prototype = Proto;
		return Ctor;
	};
}());