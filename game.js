
	var 
	containerWrapper = document.getElementById("container_wrapper");
	gameWidth = "500",
	gameHeight = "500",
	cellsWide = $(".cells_wide").val(),
	cellsHigh = $(".cells_high").val(),
	numVariants = $(".number_variants").val(),
	numEachVariant = $(".number_each_variant").val(),

	totalCells = (cellsWide * cellsHigh),
	totalVariants = (numVariants*numEachVariant),
	variantClasses = [],
	cellList = [],

	matchScore = 0,
	allMatched = [],
	clickedCells = [],
	theVariants = build_variants(numVariants, numEachVariant);
/**/
	$(".cells_wide, .cells_high, .number_variants, .number_each_variant").change(function(){
		cellsWide = $(".cells_wide").val();
		cellsHigh = $(".cells_high").val();
		numVariants = $(".number_variants").val();
		numEachVariant = $(".number_each_variant").val();
			totalCells = (cellsWide * cellsHigh)
			totalVariants = (numVariants*numEachVariant);
			console.log('currentVariantCount',totalVariants);
		clear_children(containerWrapper);
		theVariants = build_variants(numVariants, numEachVariant);
		plot(containerWrapper,cellsWide,cellsHigh,numVariants,numEachVariant);
	});
	$(containerWrapper).on('click', '.cell', function(){
		clickCell(this);
	});
	function clear_children(target){
		while (target.firstChild) {
		    target.removeChild(target.firstChild);
		}
	}
	function getRandomInt(min, max) {
	  return Math.floor(Math.random() * (max - min)) + min;
	}

	function build_variants(num_variants, num_each_variant){
		variantList = [];
		for(x=0;x<=num_variants;x++){
			variantList.push([]);
			variantList[x].push('variant_'+x);
			variantList[x].push(num_each_variant);
		}
		return variantList;
	}

function assign_variant(elem, variant_list, num_variants){
	currentVariant = getRandomInt(0,num_variants);
	
	// dies early (remove 0-variants from subsequent calls)

	if(totalVariants){
		currentVariant = getRandomInt(0,num_variants);
		// dies early (remove 0-variants from subsequent calls)
		if(theVariants[currentVariant][1]>0){
			currentVariantCount = theVariants[currentVariant][1];
			elem.className = elem.className+" variant_"+currentVariant;
			theVariants[currentVariant][1] = (theVariants[currentVariant][1]-1);
			totalVariants--;
		}else{
			assign_variant(elem, variants, num_variants);
			//currentVariantCount = "empty";
		}
	}else{
		elem.className = elem.className+" variant_empty";
	}

	// if(theVariants[currentVariant][1]>0){
	// 	currentVariantCount = theVariants[currentVariant][1]
	// }else{
	// 	currentVariantCount = "empty";
	// }
	// if(currentVariantCount=="empty"){
	// 	elem.className = elem.className+" variant_empty";
	// }else{
	// 	if(currentVariantCount){
	// 		elem.className = elem.className+" variant_"+currentVariant;
	// 		theVariants[currentVariant][1] = (theVariants[currentVariant][1]-1);
	// 		//variant_list[currentVariant][1] = currentVariantCount--;
	// 	} else {
	// 		assign_variant(cellContainer, variants, num_variants);
	// 	}
	// }
	console.log(currentVariantCount,totalVariants);
}

function clickCell(elem){
// todo: fix click on "empty" - shift assigment index? loop "empty" to assign bonus / traps
// add "empty" exception in rand# +1 to max include "empty" before indexes reach 0
	var varClassRe = /variant_\d+/;varClass = varClassRe.exec(elem.className);
	var varCellRe = /cell_\d+_\d+/;varCell = varCellRe.exec(elem.className);
	
	//if(clickedCells.indexOf(varCellRe)){return;}
	//alert(varClass+' & '+varCell);

	allMatched.push(varClass);
	clickedCells.push(varCell);

	console.log('right cells '+allMatched); console.log(' & clicked cells '+clickedCells);
	for(i=0;i<allMatched.length;i++){
		// console.log( "... " + allMatched[0][0]+' - '+allMatched[i][0] );
		if(allMatched[0][0]==allMatched[i][0]){
			matchScore++;
			console.log("win "+matchScore+" in a row");
		} else {
			matchScore = 0;
			allMatched = [];
			cellsPicked = [];
			console.log("loose");
		}
	}
}



function plot(container, cellswide, cellshigh, num_variants, num_each_variant){
	
	variants = theVariants;

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
					cellList[cellCoords].push(num_variants);

					assign_variant(cellContainer, variants, num_variants);
					//alert(cellList);assign_variant(cellContainer);
			}
	}
}
 

 function init(){
 	plot(containerWrapper, cellsWide, cellsHigh, numVariants, numEachVariant);
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