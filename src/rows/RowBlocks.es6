var RowBlock,
	RowBlockAbsolute,
	RowBlockFluid;
(function(){
	
	RowBlock = class_create(Block, {
		name: 'Height',
		css : 'height',
		cssBefore: 'top',
		cssAfter : 'bottom'
	});
	
	RowBlockAbsolute = class_create(RowBlock, BlockAbsolute, null);
	
	RowBlockFluid = class_create(RowBlock, BlockFluid, null);
}());