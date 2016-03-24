mask.define('l:custom', mask.Compo({
	container: null,
	reflowRequired: true,
	slots: {
		domInsert: function(){
			this.reflow();
		}
	},
	onRenderEnd: function(elements, model, ctx, container){
		this.container = container;
		this.elements = elements;
		ResizeListener.register(this);
	},
	dispose: function(){
		ResizeListener.unregister(this);
	},
	checkReflowRequired: function(){

	},
	reflow () {

	}
}));