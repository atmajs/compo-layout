var flex_supports,
	flex_css_CONTAINER,
	flex_css_BLOCK,
	flex_css_STRETCH;
	
(function(){
	
	flex_supports = function(ctx){
		var agent = browser_detect(ctx),
			value = Caniuse[agent.browser];
		
		if (value === true) 
			return true;
		
		return value <= agent.version;
	};
	
	flex_css_CONTAINER = function(direction = 'row' /* column */){
		return `display: -webkit-flex; display: flex; -webkit-flex-direction: ${direction}; flex-direction: ${direction}`;
	};
	
	flex_css_BLOCK = function(count = 1){
		return `-webkit-flex: ${count}; flex: ${count}`;
	};
	flex_css_STRETCH = function (stretchCss, overflow) {
		var key = stretchCss;
		var obj = {};
		if (overflow === 'visible') {
			key = 'min-' + key;
		}
		obj[key] = '100%';
		return obj;
	};
	
	// private
	
	var Caniuse = {
		'bot': true,
		'ie': 11,
		'firefox': 28,
		'chrome': 21,
		'safari': 7,
		'opera': 12.1,
		'blackberry': 10,
		'android': 4.4
	};
	
}());