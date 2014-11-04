var MaskLayoutCols,
	MaskLayoutColsAbsolute,
	MaskLayoutColsFluid;

(function(){
	
	MaskLayoutCols = class_create(MaskLayout, {
		name: 'Width',
		css : 'width',
		cssBefore: 'left',
		cssAfter : 'right'
	});
	
	MaskLayoutColsAbsolute = class_create(MaskLayoutCols, MaskLayoutAbsolute, null);
	
	MaskLayoutColsFluid = class_create(MaskLayoutCols, MaskLayoutFluid, {
		cssMargin: 'margin-left',
	});
}());
	