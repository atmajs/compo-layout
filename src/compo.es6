var LazyCompo = mask.Compo({
	meta: {
		mode: 'server'
	},
	
	constructor () {
		this._onRenderStart = this.onRenderStart;
		this._onRenderEnd = this.onRenderEnd;
		
		this.onRenderStart = Stub.start;
		this.onRenderEnd = null;
	},
	
	_onRenderStart: null,
	_deferredNodes: null,
	_ctx: null,
	_placeholder: null,
	
	resolveLazy (model) {
		this.resolveLazy = function(){};
		this.nodes = this._deferredNodes;
		
		var ctx = this._ctx;
		var onRenderStart = this._onRenderStart;
		
		if (typeof onRenderStart === 'function') 
			onRenderStart.call(this, this.model, ctx, this._placeholder.parentNode);
		
		var fragment = mask.render(
			this.nodes
			, model || this.model
			, ctx
			, null
			, this
		);
		
		if (ctx && ctx.async) {
			ctx.done(fragment => appendLazy(this, fragment));
			return;
		}
		
		appendLazy(this, fragment);
	}
});

var Stub = {
	start (model, ctx, container) {
		this._deferredNodes = this.nodes;
		this._ctx = ctx;
		this._placeholder = document.createComment('');
		
		this.model = model;
		this.nodes = null;
		
		container.appendChild(this._placeholder);
	}
};

function appendLazy(compo, fragment){
	var els = fragment.nodeType === Node.DOCUMENT_FRAGMENT_NODE
		? fragment.children
		: fragment;
	
	var container = compo._placeholder.parentNode,
		renderEnd = compo.renderEnd;
	
	compo.onRenderEnd = compo._onRenderEnd;
	
	if (typeof renderEnd === 'function') 
		renderEnd.call(compo, els, compo.model, compo._ctx, container);
	
	container.insertBefore(fragment, compo._placeholder);
	compo.emitIn('domInsert');
}