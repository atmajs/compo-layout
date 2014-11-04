var MaskLayoutRows,
	MaskLayoutRowsAbsolute,
	MaskLayoutRowsFluid;
(function(){
	
	MaskLayoutRows = class_create(MaskLayout, {
		name: 'Height',
		css : 'height',
		cssBefore: 'top',
		cssAfter : 'bottom'
	});
	
	MaskLayoutRowsAbsolute = class_create(MaskLayoutRows, MaskLayoutAbsolute, null);
	MaskLayoutRowsFluid = class_create(MaskLayoutRows, MaskLayoutFluid, {
		cssMargin: 'margin-top',
	});
}());
	