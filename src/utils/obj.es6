var obj_extend;
(function(){
	obj_extend = function(target, ...args){
		if (target == null) 
			target = {};
		
		var imax = args.length,
			i = 0, obj;
		for(; i<imax; i++){
			obj = args[i];
			if (obj == null) 
				continue;
			
			for(var key in obj){
				target[key] = obj[key];
			}
		}
		return target;
	};
}());