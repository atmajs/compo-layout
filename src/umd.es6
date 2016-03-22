(function(root, factory){
	var _global = typeof global !== 'undefined' ? global : window,
		_mask = _global.mask || (_global.atma && _global.atma.mask);

	if (_mask == null)
		throw Error('MaskJS was not loaded');

	factory(_global, _mask);

}(this, function(global, mask){
	'use strict';
	// import ./vars.es6
	// import ./const.es6
	// import ./utils/notifier.es6
	// import ./utils/node.es6
	// import ./utils/dom.es6
	// import ./utils/arr.es6
	// import ./utils/obj.es6
	// import ./utils/class.es6
	// import ./utils/layout.es6
	// import ./utils/browser.es6
	// import ./utils/flex.es6

	// import ./ResizeListener.es6


	// import layout_center.es6
	// import layout_custom.es6

	// import ./base/_exports.es6
	// import ./cols/_exports.es6
	// import ./rows/_exports.es6
}));
