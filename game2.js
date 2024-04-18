/* 
 * MEMORY GAME 
 * 2016-2017 Adam McFadyen
 * Dabzo Interaction Design dabzo.com
 */ 

const memoryGame = {
    gameWidth: document.getElementById('main').offsetWidth,
    gameHeight: gameWidth * 0.65,
    
    container_wrapper: document.getElementById('container_wrapper'),
    difficulty: document.getElementById('difficulty'),
    validation_notification: document.getElementById('validation_notification'),
    
    output: document.getElementById('output'),
    timer: document.getElementById('timer'),
    
    cellsWide: difficulty.value,
    cellsHigh: difficulty.value,
    numVariants: difficulty.value,
    numEachVariant: difficulty.value,
    
    totalCells: (cellsWide * cellsHigh),
    totalVariants: (numVariants*numEachVariant),
    theVariants: buildVariants(numVariants, numEachVariant),
    
    variantClasses: [],
    cellList: [],
    matchScore: 0,
    allMatched: [],
    clickedCells: [],
    completeMatches: [],
    gameOn: false,

    setDiddlyEtUp: function() {
        /**  DEBUG: Uncomment throughout & add complimentary html  **/
        /* DEBUG <select id="cells_high"> */// cells_wide = document.getElementById('cells_high'),
        /* DEBUG <select id="cells_high"> */// cells_high = document.getElementById('cells_high'),
        /* DEBUG <select id="number_variants"> */// number_variants = document.getElementById('number_variants'),
        /* DEBUG <select id="number_each_variant"> */// number_each_variant = document.getElementById('number_each_variant'),
        /* DEBUG <div id="cell_output"> */// cell_output = document.getElementById('cell_output'),
        /* DEBUG <div id="variant_output"> */// variant_output = document.getElementById('variant_output'),
        /* DEBUG */// cell_output.innerHTML = totalCells;
        /* DEBUG */// variant_output.innerHTML = totalVariants;

        checkGameInput(totalVariants,totalCells);

        /* DEBUG */// document.getElementById('hide_config').addEventListener('change', function(){
            /* DEBUG *///   document.getElementById('config_container').classlist.toggle('hide');
            /* DEBUG *///   document.getElementById('hide_config').classlist.toggle('config-hidden');
        /* DEBUG */// });

        container_wrapper.addEventListener('change', inputParamsChanged);
        difficulty.addEventListener('change', inputParamsChanged);

        /* DEBUG */// cells_wide.addEventListener('change', inputParamsChanged);
        /* DEBUG */// cells_high.addEventListener('change', inputParamsChanged);
        /* DEBUG */// number_variants.addEventListener('change', inputParamsChanged);
        /* DEBUG */// number_each_variant.addEventListener('change', inputParamsChanged);
    },



    // Set grid variables
    setGridVars: function (){
        // difficulty = document.getElementById('difficulty'),
        cellsWide = difficulty.value;
        cellsHigh = difficulty.value;
        numVariants = difficulty.value;
        numEachVariant = difficulty.value;
        totalCells = (cellsWide * cellsHigh);
        totalVariants = (numVariants * numEachVariant);
    
        theVariants = buildVariants(numVariants, numEachVariant)
    }
    
    // Run on load
    init: function (){
        plot(container_wrapper, cellsWide, cellsHigh, numVariants, numEachVariant);
        addCellListeners();
        window.timerTimeout = setTimeout(updateTimer, 1000);
        output.innerHTML = '&nbsp;';
    }
    
    // Build array of variants
    buildVariants: function (num_variants, num_each_variant){
        variantList = [];
        for(x=0;x<=num_variants;x++){
        variantList.push([]);
        variantList[x].push('variant_'+x);
        variantList[x].push(num_each_variant);
        }
        return variantList;
    }
    
    // Create grid 
    // Example grid-row: 
    // <div id="length_0" class="length num0">
    //   <div id="cell_0_0" class="cell cell_0_0 variant_1"></div>
    //   <div id="cell_0_1" class="cell cell_0_1 variant_0"></div>
    // </div>
    plot: function (container, cellswide, cellshigh, num_variants, num_each_variant){
    
        variants = theVariants;
    
        for(x=0;x<cellshigh;x++){
    
        var lengthContainer = document.createElement('div');
    
        container.style.height = gameHeight+'px';
        container.style.width = gameWidth+'px';
    
        container.appendChild(lengthContainer);
            lengthContainer.style.width = '100%';
            lengthContainer.style.height = (gameHeight/cellshigh)+'px';
            lengthContainer.id = 'length_'+x;
            lengthContainer.className = 'length num'+x;
    
        // This variable must be cast after .appendChild(lengthContainer)
        var lengthCurrent = document.getElementById('length_'+x);
    
        for(y=0;y<cellswide;y++){
    
            var cellContainer = document.createElement('div');
    
            lengthCurrent.appendChild(cellContainer);
            cellContainer.style.width = (gameWidth/cellswide)+'px';
            cellContainer.style.height = (gameHeight/cellshigh)+'px';
            cellContainer.id = 'cell_'+x+'_'+y;
            cellContainer.className = 'cell cell_'+x+'_'+y;
    
            cellList.push([]);
            cellCoords = (x * cellswide) + y;
    
            cellList[cellCoords].push('cell_'+x+'_'+y);
            cellList[cellCoords].push(num_variants);
    
            assignVariant(cellContainer, variants, num_variants);
            //console.log(cellList);assignVariant(cellContainer);
        }
        }
    }
    
    // add .variant_# to .cell
    assignVariant: function (elem, variant_list, num_variants){
        currentVariant = getRandomInt(0,num_variants);
    
        if(totalVariants){
        currentVariant = getRandomInt(0,num_variants);
        // +1 to randomInt limit for buffer cells (bonus, traps, etc...)
        if(theVariants[currentVariant][1]>0){
            currentVariantCount = theVariants[currentVariant][1];
            elem.className = elem.className+' variant_'+currentVariant;
            theVariants[currentVariant][1] = (theVariants[currentVariant][1]-1);
            totalVariants--;
        }else{
            assignVariant(elem, variant_list, num_variants);
        }
        }else{
        elem.className = elem.className+' variant_empty';
        }
        // console.log(currentVariantCount,totalVariants);
    }
    
    // Loop grid of divs & add event listeners
    addCellListeners: function (){
        var cellElems = container_wrapper.getElementsByClassName('cell');
        for (var i = 0; i < cellElems.length; i++) {
        cellElems[i].addEventListener('click', clickCell, false);
        }
    }
    
    // Clickhandler for div.cell
    clickCell: function (){
        // todo add 'empty' exception in rand# +1 to max include 'empty' before indexes reach 0
        /* DEBUG */// if (gameOn == false) { fixErrorsModal(); return; };
    
        var self = this;
        var itMatched = false;
        var pushCell = true;
        var chainMatches = false;
    
        var varClassRe = /variant_\d+/;varClass = varClassRe.exec(self.className);
        var varCellRe = /cell_\d+_\d+/;varCell = varCellRe.exec(self.className);
    
        for(i=0;i<clickedCells.length;i++){
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
    
        // console.log('clicked variants: '+allMatched, ' & clicked cells: '+clickedCells);
        output.innerHTML = ' -  clicked variants: '+allMatched, ' & clicked cells: '+clickedCells;
    
        /* drop or keep score on previous cell click - consider toggle */
        if(itMatched == true && pushCell == false){
        matchScore = 0;
        allMatched = [];
        clickedCells = [];
        completeMatches = [];
        output.innerHTML = 'You clicked that one already! Try Again';
        resetTimer();
        }else if(itMatched == true){
        matchScore++;
        var responseEncouragement = [
            'Win!', 'Epic!', 'Great!', 'Sweet!', 'Awesome!', 'Fantastic!', '#likeaboss', 'Ya done good.', 'You Rule!', 'Nicely Done!',
            'Whoaly Crow!', 'Boo Yeah!', 'Good One!', 'Nice One!', 'Rock Star!', 'Very Good!', 'Way to Go!', 'Top Knotch!',
        ];
        var winPhrase = responseEncouragement[Math.floor(Math.random() * responseEncouragement.length)];
        output.innerHTML = winPhrase+' '+matchScore+' in a row';
        /* DEBUG */// output.innerHTML += '<br>clickedCells: '+clickedCells;
        /* DEBUG */// output.innerHTML += '<br>allMatched: '+allMatched;
        /* DEBUG */// output.innerHTML += '<br>completeMatches: '+completeMatches;
        console.log(completeMatches);
    
        if(completeMatches.length == numVariants){
            var matchTime = timer.innerHTML;
            output.innerHTML += '<div id="game_complete">Game Complete! You made '+matchScore+' correct selections in '+matchTime+'</div>';
            output.innerHTML += '<div id="play_again">Play Again? Select a different difficulty level!</div>';
    
            // saveHighScore(matchScore,matchTime);
    
            matchScore = 0;
            allMatched = [];
            clickedCells = [];
            completeMatches = [];
    
            resetTimer();
    
            // todo: add new-game button to init.
            // var play_again = document.getElementById('play_again');
            // play_again.addEventListener('click', window.location.reload(), false);
    
        }
        }else{
            matchScore = 0;
            allMatched = [];
            clickedCells = [];
            completeMatches = [];
            output.innerHTML = 'Sorry! Try Again';
            resetTimer();
        }
    }
    
    
    
    inputParamsChanged: function (){
    
        setGridVars();
        /* DEBUG */// cell_output.innerHTML = totalCells;
        /* DEBUG */// variant_output.innerHTML = totalVariants;
        /* DEBUG */// console.log('currentVariantCount',totalVariants);
        matchScore = 0;
        allMatched = [];
        clickedCells = [];
        completeMatches = [];
        output.innerHTML = '&nbsp;';
    
        checkGameInput(totalVariants,totalCells);
        clear_children(container_wrapper);
        theVariants = buildVariants(numVariants, numEachVariant);
    
        plot(container_wrapper,cellsWide,cellsHigh,numVariants,numEachVariant);
        addCellListeners();
    
        resetTimer();
    }
    
    checkGameInput: function (theTotalVariants,theTotalCells){
        if (theTotalVariants == theTotalCells) {
        gameOn = true;
        /* DEBUG */// validation_notification.innerHTML = 'Your game looks perfect ' + numVariants + ' Variants x ' + numEachVariant;
        /* DEBUG */// validation_notification.innerHTML += ' of Each Variant fits perfectly on a ' + cellsWide + 'x' + cellsHigh + ' Grid';
        } else {
        if (theTotalVariants > theTotalCells) {
            gameOn = false;
            /* DEBUG */// validation_notification.innerHTML = '<strong class=\'error too-many-variants\'>' + numVariants + ' Variants x ' + numEachVariant;
            /* DEBUG */// validation_notification.innerHTML += ' of Each Variant is more than a ' + cellsWide + 'x' + cellsHigh + ' Grid can support.';
            /* DEBUG */// validation_notification.innerHTML += '<br> Please use fewer variants or a larger grid.</span>';
        } else {
            if (theTotalVariants < theTotalCells) {
            gameOn = true;
            /* DEBUG */// validation_notification.innerHTML = 'Looking good! But You have some empty-cells.<br> You can add more ';
            /* DEBUG */// validation_notification.innerHTML += 'variants, more of each variant... or just play the game!';
            } else {
            gameOn = false;
            /* DEBUG */// validation_notification.innerHTML = '&nbsp';
            }
        }
        }
    }
    
    /* DEBUG */// function fixErrorsModal() {
        /* DEBUG *///   alert('Please fix game config before playing');
    /* DEBUG */// }
    
    updateTimer: function () {
        var myTime = timer.innerHTML;
        var ss = myTime.split(':');
        var dt = new Date();
        dt.setHours(ss[0]);
        dt.setMinutes(ss[1]);
        dt.setSeconds(ss[2]);
    
        var dt2 = new Date(dt.valueOf() + 1000);
        var ts = dt2.toTimeString().split(' ')[0];
        timer.innerHTML = ts;
        window.timerTimeout = setTimeout(updateTimer, 1000);
    }
    
    resetTimer: function (){
        window.clearTimeout(timerTimeout);
        document.getElementById('timer').innerHTML = '00:00:00';
        window.timerTimeout = setTimeout(updateTimer, 1000);
    }
    
    clear_children: function (target){
        while (target.firstChild) {
        target.removeChild(target.firstChild);
        }
    }
};

