
	var 
	containerWrapper = document.getElementById("container_wrapper");
	gameWidth = "400",
	gameHeight = "400",
	cellsWide = $(".cells_wide").val(),
	cellsHigh = $(".cells_high").val(),
	numVariants = parseInt($(".number_variants").val()),
	numEachVariant = parseInt($(".number_each_variant").val()), //toInt
	totalCells = (cellsWide * cellsHigh);

	variantClasses = [];
	cellList = [];

	allMatched = [];

	cellsPicked = [];

	variantList = [];

function build_variants(num_variants, num_each_variant){
	
	for(x=0;x<=num_variants;x++){
		variantList.push([]);
		variantList[x].push('variant_'+x);
		variantList[x].push(num_variants);
		variantList[x].push(num_each_variant);//console.log(variantList);
	}
	return variantList;
}

function assign_variant(elem, variant_list, num_variants, num_each_variant){
	currentVariant = getRandomInt(0,num_variants);
	//currentVariantCount = variant_list[currentVariant][1];
	currentVariantCount = variant_list[currentVariant][1] ? currentVariantCount = variant_list[currentVariant][1] : currentVariantCount = 'baz';
	if(currentVariantCount){
		elem.className = elem.className+" variant_"+currentVariant;
		variantList[currentVariant][1] = (variant_list[currentVariant][1]-1);
		// console.log('start');
		// console.log(variant_list);
		// console.log(variantList);
		// console.log('end');
	} else {
		console.log('damn -- '+currentVariant+' -- '+variant_list[currentVariant][1]);
		assign_variant(elem, variant_list);
	}
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}


$(".cells_wide, .cells_high, .number_variants, .number_each_variant").change(function(){
	cellsWide = $(".cells_wide").val();
	cellsHigh = $(".cells_high").val();
	numVariants = parseInt($(".number_variants").val());
	numEachVariant = parseInt($(".number_each_variant").val());
	clear_children(containerWrapper);
	plot(containerWrapper,cellsWide,cellsHigh,numVariants,numEachVariant);
});

function clickCell(elem){
	matchScore = allMatched.length;
	var varClassRe = /variant_\d+/; varClass = varClassRe.exec(elem.className);
	var varCellRe = /cell_\d+_\d+/; varCell = varCellRe.exec(elem.className);
	
	//if(cellsPicked.indexOf(varCellRe)){return;}
	//alert(varClass+' & '+varCell);

	allMatched.push(varClass);
	cellsPicked.push(varCell);
	console.log(allMatched+' & '+cellsPicked);

	for(i=0;i<allMatched.length;i++){
		// console.log( "thisthat " + allMatched[0][0]+' - '+allMatched[i][0] );
		// console.log("all matched "+allMatched);

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

	//if(matchScore==)

	// if(matchScore>0){
	// 	console.log("great you matched "+matchScore);
	// }else{
	// 	console.log("Why you gotta make me do this?.. Start over");
	// }

}

$(containerWrapper).on('click', '.cell', function(){
	clickCell(this);
});

function clear_children(target){
	while (target.firstChild) {
	    target.removeChild(target.firstChild);
	}
}

function plot(container, cellswide, cellshigh, num_variants, num_each_variant){
	
	variants = build_variants(num_variants, num_each_variant);

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

					assign_variant(cellContainer, variants, num_variants, num_each_variant);
					//alert(cellList);
					//assign_variant(cellContainer);
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