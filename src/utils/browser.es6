var browser_detect,
	browser_parseUserAgent;
(function(){
	
	browser_detect = function (ctx) {
		// NodeJS || Browser
		var ua = ctx && ctx.req && ctx.req.headers
			? ctx.req.headers['User-Agent']
			: navigator.userAgent;
			
		return parse(ua);
	};
	browser_parseUserAgent = parse;
	
	var Matchers = [
		['bot', 'bot'],
		['Opera'	, 'opera'	, /Version\/? ?(\d+(\.\d+)*)/],
		['MSIE'		, 'ie'		, /MSIE (\d+(\.\d+)*)/		],
		
		['Android'	, 'android'	, /Android ?(\d+(\.\d+)*)/],
		['BlackBerry', 'blackberry'	, /Version\/? ?(\d+(\.\d+)*)/],
		
		['Firefox'	, 'firefox'	, /Firefox\/(\d+(\.\d+)*)/	],
		['Chrome'	, 'chrome'	, /Chrome\/(\d+(\.\d+)*)/ 	],
		['Safari'	, 'safari'	, /Version\/(\d+(\.\d+)*)/	],
		
		['rv:'		, 'ie'		, /rv:(\d+(\.\d+)*)/		],
	];
	var Default = {
		browser: 'unknown',
		version: 0
	};
	function parse(ua) {
		if (!ua) 
			return Default;
		
		var imax = Matchers.length,
			i = 0,
			str, browser, version, rgx_version;
		for(; i < imax; i++) {
			[ str, browser, rgx_version ] = Matchers[i];
			if (ua.indexOf(str) === -1) 
				continue;
			
			if (rgx_version == null) 
				return { browser };
			
			var match = rgx_version.exec(ua);
			if (match && match.length > 1) 
				version = parseFloat(match[1]);
				
			return {
				browser: browser,
				version: version || 0
			};
		}
		
		return Default;
	}
}());