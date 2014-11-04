function checkExample(el) {
	
	test('width');
	test('height');
	test('top');
	test('left');
		
	function test(type) {
		$(el)
			.find(`[test-${type}]`)
			.each(checkExampleDelegate(type))
			;
	}
}

function checkExampleDelegate(type) {
	return function(i, el){
		
		var actual = ActualResolver[type](el);
		var expr = $(el).attr('test-' + type);
		var test = evaluateExpr(expr, el);
		
		eq_(actual, test, `Type: ${type}; Expr: ${expr}; Actual: ${actual};  Expect: ${test}`);
	};
}

var ActualResolver = {
	'width' 	(el) 	{ return el.offsetWidth 	},
	'height' 	(el) 	{ return el.offsetHeight 	},
	'top' 		(el) 	{ return el.offsetTop 		},
	'left' 		(el)	{ return el.offsetLeft 		},
};

function evaluateExpr(size, el) {
	size = size
		.replace(/(\d+)vh/g, (full, vh) => {
			var val = el.ownerDocument.documentElement.offsetHeight;
			return val * vh / 100;
		})
		.replace(/(\d+)vw/g, (full, vw) => {
			var val = el.ownerDocument.documentElement.offsetWidth;
			return val * vw / 100;
		})
		.replace(/(\d+)px/g, (full, px) => {
			return px;
		});
	
	return eval(size);
}