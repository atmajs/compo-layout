var arr_mapAny,
	arr_each;
(function(){
	arr_mapAny = function(x, fn){
		if (x == null || typeof x !== 'object') 
			return [];
		
		if (typeof x.length !== 'number') 
			return [ fn(x, 0) ];
		
		var imax = x.length,
			i = 0,
			arr = new Array(imax);
		for(; i < imax; i++) {
			arr[i] = fn(x[i], i);
		}
		return arr;
	};
	arr_each = function(arr, fn){
		var imax = arr.length,
			i = 0;
		for(; i < imax; i++) {
			fn(arr[i], i);
		}
	};
}());