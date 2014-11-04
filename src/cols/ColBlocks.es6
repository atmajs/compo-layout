var ColBlock,
	ColBlockAbsolute,
	ColBlockFluid;
(function(){
	
	ColBlock = class_create(Block, {
		name: 'Width',
		css : 'width',
		cssBefore: 'left',
		cssAfter : 'right'
	});
	
	ColBlockAbsolute = class_create(ColBlock, BlockAbsolute, null);
	
	ColBlockFluid = class_create(ColBlock, BlockFluid, null);
}());