
var
	container_wrapper = document.getElementById("container_wrapper"),
	cells_wide = document.getElementById('cells_wide'),
	cells_high = document.getElementById('cells_high'),
	number_variants = document.getElementById('number_variants'),
	number_each_variant = document.getElementById('number_each_variant'),
	cell_output = document.getElementById('cell_output'),
	variant_output = document.getElementById('variant_output'),
	validation_notification = document.getElementById('validation_notification');
	output = document.getElementById("output"),

	gameWidth = document.getElementById('main').offsetWidth,
	gameHeight = gameWidth * 0.65,

	cellsWide = cells_wide.value,
	cellsHigh = cells_high.value,
	numVariants = number_variants.value,
	numEachVariant = number_each_variant.value,

	totalCells = (cellsWide * cellsHigh),
	totalVariants = (numVariants*numEachVariant),


	variantClasses = [],
	cellList = [],

	matchScore = 0,
	allMatched = [],
	clickedCells = [],
	completeMatches = [],
	theVariants = build_variants(numVariants, numEachVariant);
/**/

	cell_output.innerHTML = totalCells;
	variant_output.innerHTML = totalVariants;

	gameOn = false;
	if (totalVariants == totalCells) {
	    gameOn = true;
	    validation_notification.innerHTML = 'Your game looks perfect ' + numVariants + ' Variants x ' + numEachVariant + ' of Each Variant fits perfectly on a ' + cellsWide + 'x' + cellsHigh + ' Grid';
	} else {
	    if (totalVariants > totalCells) {
	        validation_notification.innerHTML = numVariants + ' Variants x ' + numEachVariant + ' of Each Variant is more than a ' + cellsWide + 'x' + cellsHigh + ' Grid can support.<br> Please use fewer variants or a larger grid.';
	    } else {
	        if (totalVariants < totalCells) {
	            gameOn = true;
	            validation_notification.innerHTML = 'Looking good! But You have some empty-cells.<br> You can add more variants, more of each variant... or just play the game!';
	        } else {
	            validation_notification.innerHTML = '&nbsp;';
	        }
	    }
	};

	// document.getElementById('hide_config').addEventListener('change', function(){
	// 	document.getElementById('config_container').classlist.toggle('hide');
	// 	document.getElementById('hide_config').classlist.toggle('config-hidden');
	// });

	container_wrapper.addEventListener('change', inputParamsChanged);
	cells_wide.addEventListener('change', inputParamsChanged);
	cells_high.addEventListener('change', inputParamsChanged);
	number_variants.addEventListener('change', inputParamsChanged);
	number_each_variant.addEventListener('change', inputParamsChanged);

	function inputParamsChanged(){
		cellsWide = document.getElementById('cells_wide').value;
		cellsHigh = document.getElementById('cells_high').value;
		numVariants = document.getElementById('number_variants').value;
		numEachVariant = document.getElementById('number_each_variant').value;
		totalCells = (cellsWide * cellsHigh)
		totalVariants = (numVariants*numEachVariant);

		cell_output.innerHTML = totalCells;
		variant_output.innerHTML = totalVariants;

		console.log('currentVariantCount',totalVariants);

    if (totalVariants == totalCells) {
        gameOn = true;
        validation_notification.innerHTML = 'Your game looks perfect ' + numVariants + ' Variants x ' + numEachVariant + ' of Each Variant fits perfectly on a ' + cellsWide + 'x' + cellsHigh + ' Grid';
    } else {
        if (totalVariants > totalCells) {
            gameOn = false;
            validation_notification.innerHTML = '<strong class="error too-many-variants">' + numVariants + ' Variants x ' + numEachVariant + ' of Each Variant is more than a ' + cellsWide + 'x' + cellsHigh + ' Grid can support.<br> Please use fewer variants or a larger grid.</span>';
        } else {
            if (totalVariants < totalCells) {
                gameOn = true;
                validation_notification.innerHTML = 'Looking good! But You have some empty-cells.<br> You can add more variants, more of each variant... or just play the game!';
            } else {
                gameOn = false;
                validation_notification.innerHTML = '&nbsp';
            }
        }
    };

    matchScore = 0;
    allMatched = [];
    clickedCells = [];
    completeMatches = [];
    output.innerHTML = '&nbsp;';

		clear_children(container_wrapper);
		theVariants = build_variants(numVariants, numEachVariant);
		plot(container_wrapper,cellsWide,cellsHigh,numVariants,numEachVariant);
		addCellListeners();
	}

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

	if(totalVariants){
		currentVariant = getRandomInt(0,num_variants);
		// +1 to randomInt limit for buffer cells (bonus, traps, etc...)
		if(theVariants[currentVariant][1]>0){
			currentVariantCount = theVariants[currentVariant][1];
			elem.className = elem.className+" variant_"+currentVariant;
			theVariants[currentVariant][1] = (theVariants[currentVariant][1]-1);
			totalVariants--;
		}else{
			assign_variant(elem, variants, num_variants);
		}
	}else{
		elem.className = elem.className+" variant_empty";
	}
	//console.log(currentVariantCount,totalVariants);
}

function fixErrorsModal() {
    alert('Please fix game config before playing');
}

function clickCell(){
	// todo: fix click on "empty" - shift assigment index? loop "empty" to assign bonus / traps
	// add "empty" exception in rand# +1 to max include "empty" before indexes reach 0
	if (gameOn == false) {
			fixErrorsModal();
			return;
	};
	var self = this;
	var itMatched = false;
	var pushCell = true;
	var chainMatches = false;

	var varClassRe = /variant_\d+/;varClass = varClassRe.exec(self.className);
	var varCellRe = /cell_\d+_\d+/;varCell = varCellRe.exec(self.className);

	//if(clickedCells.indexOf(varCellRe)){return;}

	for(i=0;i<clickedCells.length;i++){
		//console.log(varCell+"##"+clickedCells[i][0]);
		if(varCell==clickedCells[i][0]){
			pushCell = false;
		}
	}

	if(pushCell){
		allMatched.push(varClass);
		clickedCells.push(varCell);
	}

	for(i=0;i<allMatched.length;i++){
		if(allMatched[0][0]==allMatched[i][0]){
			itMatched = true;
		}else{
			itMatched = false;
		}
	}

	if(allMatched.length == numEachVariant){
		completeMatches.push(allMatched);
		allMatched = [];
	}

	//console.log('clicked variants: '+allMatched, ' & clicked cells: '+clickedCells);
	output.innerHTML = ' -  clicked variants: '+allMatched, ' & clicked cells: '+clickedCells;

	/* drop or keep score on previous cell click */
	/* todo consider toggle */
	if(itMatched == true && pushCell == false){
		matchScore = 0;
		allMatched = [];
		clickedCells = [];
		completeMatches = [];
		output.innerHTML = "You clicked that one already! Try Again";
	}else if(itMatched == true){

		matchScore++;
		output.innerHTML = "Win! "+matchScore+" in a row";
		// output.innerHTML += "<br>clickedCells: "+clickedCells;
		// output.innerHTML += "<br>allMatched: "+allMatched;
		// output.innerHTML += "<br>completeMatches: "+completeMatches;
		console.log(completeMatches);

		if(completeMatches.length == numVariants){
			output.innerHTML += "<br>You win!";
			// output.innerHTML += "<br>You win! <a href='#' class='play-again'>Play Again?</a>";
		}

	}else{
		matchScore = 0;
		allMatched = [];
		clickedCells = [];
		completeMatches = [];
		output.innerHTML = "Sorry! Try Again";
	}

}


function plot(container, cellswide, cellshigh, num_variants, num_each_variant){

	variants = theVariants;

	for(x=0;x<cellshigh;x++){

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
				//console.log(cellList);assign_variant(cellContainer);
		}
	}
}

function addCellListeners(){
	var cellElems = container_wrapper.getElementsByClassName("cell");
	for (var i = 0; i < cellElems.length; i++) {
    cellElems[i].addEventListener('click', clickCell, false);
	}
}

function init(){
 	plot(container_wrapper, cellsWide, cellsHigh, numVariants, numEachVariant);
	addCellListeners();
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
/*
function build_colours(){

var permArr = [],
  usedChars = [];

function permute(input) {
  var i, ch;
  for (i = 0; i < input.length; i++) {
    ch = input.splice(i, 1)[0];
    usedChars.push(ch);
    if (input.length == 0) {
      permArr.push(usedChars.slice());
    }
    permute(input);
    input.splice(i, 0, ch);
    usedChars.pop();
  }
  return permArr
};
document.write(JSON.stringify(permute(['0', '3', '6', '9', 'c', 'f'])));


// var digits = ['0','3','6','9','c','f'];
// var hexlist = [];
// var l = digits.length;

// for(a=0;a<l;a++){
// 	for(b=0;b<l;b++){
// 		hexlist.push(digits[a]);
// 		hexlist[a*l+b]=hexlist[a*l+b]+=digits[b];
// 		hexlist[a*l+b]=hexlist[a*l+b]+=digits[b];
// 	}
// }

// console.log(hexlist);
}

*/
