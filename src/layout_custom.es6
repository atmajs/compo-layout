mask.define('l:custom', mask.Compo({
	container: null,
	reflowRequired: true,
	slots: {
		domInsert: function(){
			this.reflow();
		}
	},
	renderEnd: function(elements, model, ctx, container){
		this.container = container;
		this.elements = elements;
		ResizeListener.register(this);
		if (this.onRenderEnd) {
			this.onRenderEnd.apply(this, arguments);
		}
	},
	dispose: function(){
		ResizeListener.unregister(this);
	},
	checkReflowRequired: function(){

	},
	reflow () {

	}
}));