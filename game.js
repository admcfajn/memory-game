
	var 
	containerWrapper = document.getElementById("container_wrapper");
	gameWidth = "500",
	gameHeight = "500",
	cellsWide = $(".cells_wide").val(),
	cellsHigh = $(".cells_high").val(),
	//numVariants = 5,
	numVariants = $(".number_variants").val(),
	totalCells = (cellsWide * cellsHigh);
	//cellVariants = array(1,2,3,4,5,6,7,8);

	variantClasses = [];
	cellList = [];

function build_variants(total_variants){
	variantList = [];
	for(x=0;x<=total_variants;x++){
		variantList.push([]);
		variantList[x].push('variant_'+x);
		variantList[x].push(total_variants);
	}
	return variantList;
}

function assign_variant(elem, variant_list, total_variants){
	currentVariant = getRandomInt(0,total_variants);
	currentVariantCount = variant_list[currentVariant][1];
	if(currentVariantCount > 0){
		elem.className = elem.className+" variant_"+currentVariant;
		variant_list[currentVariant][1] = currentVariantCount--;
	} else {
		assign_variant(elem);
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(".cells_wide, .cells_high, .number_variants").change(function(){
	cellsWide = $(".cells_wide").val();
	cellsHigh = $(".cells_high").val();
	numVariants = $(".number_variants").val();
	clear_children(containerWrapper);
	plot(containerWrapper,cellsWide,cellsHigh,numVariants);
});

function clear_children(target){
	while (target.firstChild) {
	    target.removeChild(target.firstChild);
	}
}

function plot(container, cellswide, cellshigh, total_variants){
	
	variants = build_variants(total_variants);
	//alert(variants+' ya');
	for(x=0;x<cellshigh;x++){
		//var cols.push(array())
		
		var lengthContainer = document.createElement("div");
		
		container.style.height = gameHeight+"px";
		container.style.width = gameWidth+"px";

		container.appendChild(lengthContainer);
			lengthContainer.style.width = "100%";
			lengthContainer.style.height = (gameHeight/cellshigh)+"px";
			lengthContainer.id = "length_"+x;
			lengthContainer.className = "length num"+x;

		// This variable must be cast after .appendChild(lengthContainer)
		var lengthCurrent = document.getElementById("length_"+x);
			for(y=0;y<cellswide;y++){

				var cellContainer = document.createElement("div");

				lengthCurrent.appendChild(cellContainer);
					cellContainer.style.width = (gameWidth/cellswide)+"px";
					cellContainer.style.height = (gameHeight/cellshigh)+"px";
					cellContainer.id = "cell_"+x+"_"+y;
					cellContainer.className = "cell cell_"+x+"_"+y;

					cellList.push([]);
					cellCoords = (x * cellswide) + y;

					cellList[cellCoords].push("cell_"+x+"_"+y);
					cellList[cellCoords].push(total_variants);

					assign_variant(cellContainer, variants, total_variants);
					//alert(cellList);
					//assign_variant(cellContainer);
			}
	}
}
 

 function init(){
 	plot(containerWrapper, cellsWide, cellsHigh, numVariants);
 	//build_variants(variantClasses);
 }


/*

NOTE: Find Optimal css id/class + js var / funct nomenclature?
homeScreen
	startInput
		[wide]x[tall]=[totalCards] Min 2x2
		[number]x[limit] !< [totalCards]
		
		[picker]{limitPlus[min2,(limitPlus+1)x[limitNow] < [totalCards]?[limit=limitNow]]}
			[+/-][+] Allow Any Num x [number] < [totalCards] // Remaining Cards will Be Null, Prizes, Damage, etc...
		[picker]{numberPlus[min1,(numberPlus+1)x[numberNow] < [totalCards]?[number=numberNow]]}
			[+/-][+] Allow Any Num x [number] < [totalCards] // Remaining Cards will Be Null, Prizes, Damage, etc...
		?add blankCell control here? (with warning)

			[comboCards] = [number x limit]

			[blankCell] = [totalCards] - [number x limit]
			[numBonus+/-][numTraps+/-][numBlank+/-] < [blankCell]
			?[totalCards-blankCell]++numBlank

		?[blankCell]+[comboCards] == [totalCards], die
		?[number]x[limit] == [totalCards], die

	calcRatios
	makeElement
		generateColors[]
		plotCards(array(),array(),array())

gameLoop
	whosTurn
	cardShow
*/