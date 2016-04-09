$(document).ready(function(){
	cellsWideUX = $(".cells_wide"),
	cellsHighUX = $(".cells_high"),
	numVariantsUX = $(".number_variants"),
	numEachVariantUX = $(".number_each_variant");
	dropElements = [cellsWideUX,cellsHighUX,numVariantsUX,numEachVariantUX];
	$.each(dropElements, function () {
		for(i=9;i>=2;i--){
			$(this).append('<option value="' + i + '">' + i + '</option>');
		}
	});

	$('.play-again').click(function(){
		alert('here');
		location.reload();
		return false;
	});
});
