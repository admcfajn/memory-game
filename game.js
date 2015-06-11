
	var 
	containerWrapper = document.getElementById("container_wrapper");
	gameWidth = "500",
	gameHeight = "500",
	cellsWide = $(".cells_wide").val(),
	cellsHigh = $(".cells_high").val();
	//cellVariants = array(1,2,3,4,5,6,7,8);

	/*
		in plot:
		add element,
		push .class to array
		bar = rand(0-totalLimit)
		baz = rand(0-variantsLimit # variantsEachLimit)
		foreach .class
		if bar != done{
			addClass baz
			.class = done
		}
	*/


$(".cells_wide, .cells_high").change(function(){
	cellsWide = $(".cells_wide").val();
	cellsHigh = $(".cells_high").val();
	clear_children(containerWrapper);
	plot(containerWrapper,cellsWide,cellsHigh);
});

function clear_children(target){
	while (target.firstChild) {
	    target.removeChild(target.firstChild);
	}
}

function plot(container,cellswide,cellshigh){
	
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
					cellContainer.className = "cell cell"+x+"_cell"+y;
			}
	}
}
 

 function init(){
 	plot(containerWrapper,cellsWide,cellsHigh);
 }


/*

NOTE: DO SPEED-TESTS ON SAME APP WITH SYNCHRONIZED / UN  CLASS - JS-VAR NAMES / SELECTORS?
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