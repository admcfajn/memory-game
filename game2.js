/* 
 * MEMORY GAME 
 * 2016-2017 Adam McFadyen
 * Dabzo Interaction Design dabzo.com
 */ 

const memoryGame = {
    gameWidth: document.getElementById('main').offsetWidth,
    get gameHeight() {
        return this.gameWidth * 0.65;
    },
    
    container: document.getElementById('container_wrapper'),
    difficulty: document.getElementById('difficulty'),
    validation_notification: document.getElementById('validation_notification'),
    
    output: document.getElementById('output'),
    timer: document.getElementById('timer'),
    
    cellsWide: this.difficulty.value,
    cellsHigh: this.difficulty.value,
    numVariants: this.difficulty.value,
    numEachVariant: this.difficulty.value,
    
    get totalCells() {
        return this.cellsWide * this.cellsHigh;
    },
    get totalVariants () {
        return this.numVariants*this.numEachVariant;
    },

    // getVariants: function (num_variants, num_each_variant){
    //     return this.buildVariants();
    // },
    // theVariants: this.getVariants(this.numVariants, this.numEachVariant),
    theVariants: [],
    
    variantClasses: [],
    cellList: [],
    matchScore: 0,
    allMatched: [],
    clickedCells: [],
    completeMatches: [],
    gameOn: false,

    setUp: function() {
        /**  DEBUG: Uncomment throughout & add complimentary html  **/
        /* DEBUG <select id="cells_high"> */// cells_wide = document.getElementById('cells_high'),
        /* DEBUG <select id="cells_high"> */// cells_high = document.getElementById('cells_high'),
        /* DEBUG <select id="number_variants"> */// number_variants = document.getElementById('number_variants'),
        /* DEBUG <select id="number_each_variant"> */// number_each_variant = document.getElementById('number_each_variant'),
        /* DEBUG <div id="cell_output"> */// cell_output = document.getElementById('cell_output'),
        /* DEBUG <div id="variant_output"> */// variant_output = document.getElementById('variant_output'),
        /* DEBUG */// cell_output.innerHTML = totalCells;
        /* DEBUG */// variant_output.innerHTML = totalVariants;

        this.checkGameInput(this.totalVariants,this.totalCells);

        /* DEBUG */// document.getElementById('hide_config').addEventListener('change', function(){
            /* DEBUG *///   document.getElementById('config_container').classlist.toggle('hide');
            /* DEBUG *///   document.getElementById('hide_config').classlist.toggle('config-hidden');
        /* DEBUG */// });

        this.container.addEventListener('change', this.inputParamsChanged);
        this.difficulty.addEventListener('change', this.inputParamsChanged);

        /* DEBUG */// cells_wide.addEventListener('change', inputParamsChanged);
        /* DEBUG */// cells_high.addEventListener('change', inputParamsChanged);
        /* DEBUG */// number_variants.addEventListener('change', inputParamsChanged);
        /* DEBUG */// number_each_variant.addEventListener('change', inputParamsChanged);
    },

    // Set grid variables
    setGridVars: function (){
        console.log('setGridVars');
        // difficulty = document.getElementById('difficulty'),
        this.cellsWide = this.difficulty.value;
        this.cellsHigh = this.difficulty.value;
        this.numVariants = this.difficulty.value;
        this.numEachVariant = this.difficulty.value;
        this.totalCells = (this.cellsWide * this.cellsHigh);
        this.totalVariants = (this.numVariants * this.numEachVariant);
    
        this.theVariants = this.buildVariants()
    },
    
    // Run on load
    init: function (){
        // console.log(memoryGame,this);
        this.setGridVars();
        this.setUp();
        this.plot();
        this.addCellListeners();
        window.timerTimeout = setTimeout(this.updateTimer, 1000);
        this.output.innerHTML = '&nbsp;';
    },
    
    // Build array of variants
    buildVariants: function (){
        let variantList = [];
        for(x=0;x<=this.numVariants;x++){
            variantList.push([]);
            variantList[x].push('variant_'+x);
            variantList[x].push( this.numEachVariant );
        }
        return variantList;
    },
    
    // Create grid 
    // Example grid-row: 
    // <div id="length_0" class="length num0">
    //   <div id="cell_0_0" class="cell cell_0_0 variant_1"></div>
    //   <div id="cell_0_1" class="cell cell_0_1 variant_0"></div>
    // </div>
    plot: function (){

        this.container.style.height = this.gameHeight+'px';
        this.container.style.width = this.gameWidth+'px';

        for(x=0;x<this.cellsHigh;x++){
    
            const lengthContainer = document.createElement('div');
            this.container.appendChild(lengthContainer);
            lengthContainer.style.width = '100%';
            lengthContainer.style.height = (this.gameHeight/this.cellsHigh)+'px';
            lengthContainer.id = 'length_'+x;
            lengthContainer.className = 'length num'+x;
        
            // This variable must be cast after .appendChild(lengthContainer)
            const lengthCurrent = document.getElementById('length_'+x);
        
            for(y=0;y<this.cellsWide;y++){
        
                const cellContainer = document.createElement('div');
        
                lengthCurrent.appendChild(cellContainer);
                cellContainer.style.width = (this.gameWidth/this.cellsWide)+'px';
                cellContainer.style.height = (this.gameHeight/this.cellsWide)+'px';
                cellContainer.id = 'cell_'+x+'_'+y;
                cellContainer.className = 'cell cell_'+x+'_'+y;
        
                cellCoords = (x * this.cellsWide) + y;
                this.cellList[cellCoords] = [];
                this.cellList[cellCoords].push('cell_'+x+'_'+y);
                this.cellList[cellCoords].push(this.numVariants);
        
                this.assignVariant(cellContainer);
                // console.log(this.cellList);//assignVariant(cellContainer);
            }
        }
    },
    
    // add .variant_# to .cell
    assignVariant: function (elem){
        currentVariant = this.getRandomInt(0,this.numVariants);
    
        if(this.totalVariants){

            currentVariant = this.getRandomInt(0,this.numVariants);
            console.log('this.theVariants',this.theVariants,'currentVariant',currentVariant);

            // +1 to randomInt limit for buffer cells (bonus, traps, etc...)
            if(this.theVariants[currentVariant][1]>0){
                // currentVariantCount = this.theVariants[currentVariant][1];
                elem.className = elem.className+' variant_'+currentVariant;
                this.theVariants[currentVariant][1] = (this.theVariants[currentVariant][1]-1);
                this.totalVariants--;
            }else{
                this.assignVariant(elem);
            }

        }else{
            elem.className = elem.className+' variant_empty';
        }
        console.log( 'currentVariant',currentVariant,'this.totalVariants',this.totalVariants);
    },
    
    // Loop grid of divs & add event listeners
    addCellListeners: function (){
        const cellElems = this.container.getElementsByClassName('cell');
        for (var i = 0; i < cellElems.length; i++) {
            cellElems[i].addEventListener('click', this.clickCell, false);
        }

        // console.log('addCellListeners');
        // Array.from(this.container.getElementsByClassName("cell")).forEach(
        //     function(element, index, array) {
        //         element.addEventListener('click', this.clickCell, false);
        //     }
        // );
        // const els = this.container.getElementsByClassName('cell');
        // Array.prototype.forEach.call(els, function (el) {
        //     el.addEventListener('click', this.clickCell, false);
        // });
    },
    
    // Clickhandler for div.cell
    clickCell: function (){
        // todo add 'empty' exception in rand# +1 to max include 'empty' before indexes reach 0
        /* DEBUG */// if (this.gameOn == false) { fixErrorsModal(); return; };
    
        var self = this;
        var itMatched = false;
        var pushCell = true;
        // var chainMatches = false;
    
        var varClassRe = /variant_\d+/;varClass = varClassRe.exec(self.className);
        var varCellRe = /cell_\d+_\d+/;varCell = varCellRe.exec(self.className);

        for(i=0;i<this.clickedCells.length;i++){
            if(varCell==this.clickedCells[i][0]){
                pushCell = false;
            }
        }
    
        if(pushCell){
            this.allMatched.push(varClass);
            this.clickedCells.push(varCell);
        }
    
        for(i=0;i<allMatched.length;i++){
            if(allMatched[0][0]==allMatched[i][0]){
                itMatched = true;
            }else{
                itMatched = false;
            }
        }
    
        if(allMatched.length == numEachVariant){
            this.completeMatches.push(allMatched);
            this.allMatched = [];
        }
    
        // console.log('clicked variants: '+allMatched, ' & clicked cells: '+clickedCells);
        this.output.innerHTML = ' -  clicked variants: '+allMatched, ' & clicked cells: '+clickedCells;
    
        /* drop or keep score on previous cell click - consider toggle */
        if(itMatched == true && pushCell == false){
            this.matchScore = 0;
            this.allMatched = [];
            this.clickedCells = [];
            this.completeMatches = [];
            this.output.innerHTML = 'You clicked that one already! Try Again';
            this.resetTimer();
        }else if(itMatched == true){
            this.matchScore++;
            var responseEncouragement = [
                'Win!', 'Epic!', 'Great!', 'Sweet!', 'Awesome!', 'Fantastic!', '#likeaboss', 'Ya done good.', 'You Rule!', 'Nicely Done!',
                'Whoaly Crow!', 'Boo Yeah!', 'Good One!', 'Nice One!', 'Rock Star!', 'Very Good!', 'Way to Go!', 'Top Knotch!',
            ];
            var winPhrase = responseEncouragement[Math.floor(Math.random() * responseEncouragement.length)];
            this.output.innerHTML = winPhrase+' '+this.matchScore+' in a row';
            /* DEBUG */// output.innerHTML += '<br>clickedCells: '+clickedCells;
            /* DEBUG */// output.innerHTML += '<br>allMatched: '+allMatched;
            /* DEBUG */// output.innerHTML += '<br>completeMatches: '+completeMatches;
            console.log(this.completeMatches);
        
            if(this.completeMatches.length == this.numVariants){
                var matchTime = timer.innerHTML;
                this.output.innerHTML += '<div id="game_complete">Game Complete! You made '+matchScore+' correct selections in '+matchTime+'</div>';
                this.output.innerHTML += '<div id="play_again">Play Again? Select a different difficulty level!</div>';
        
                // saveHighScore(matchScore,matchTime);
        
                this.matchScore = 0;
                this.allMatched = [];
                this.clickedCells = [];
                this.completeMatches = [];
        
                this.resetTimer();
        
                // todo: add new-game button to init.
                // var play_again = document.getElementById('play_again');
                // play_again.addEventListener('click', window.location.reload(), false);
        
            }
        }else{
            this.matchScore = 0;
            this.allMatched = [];
            this.clickedCells = [];
            this.completeMatches = [];
            this.output.innerHTML = 'Sorry! Try Again';
            this.resetTimer();
        }
    },
    
    inputParamsChanged: function (){
        console.log('inputParamsChanged');
        this.setGridVars();
        /* DEBUG */// cell_output.innerHTML = totalCells;
        /* DEBUG */// variant_output.innerHTML = totalVariants;
        /* DEBUG */// console.log('currentVariantCount',totalVariants);
        this.matchScore = 0;
        this.allMatched = [];
        this.clickedCells = [];
        this.completeMatches = [];

        this.output.innerHTML = '&nbsp;';
    
        // this.checkGameInput(this.totalVariants,this.totalCells);
        this.clearChildren(this.container);
        this.theVariants = buildVariants();
    
        this.plot();
        this.addCellListeners();
    
        this.resetTimer();
    },
    
    checkGameInput: function (theTotalVariants,theTotalCells){
        if (theTotalVariants == theTotalCells) {
            this.gameOn = true;
            /* DEBUG */// validation_notification.innerHTML = 'Your game looks perfect ' + numVariants + ' Variants x ' + numEachVariant;
            /* DEBUG */// validation_notification.innerHTML += ' of Each Variant fits perfectly on a ' + cellsWide + 'x' + cellsHigh + ' Grid';
        } else {
            if (theTotalVariants > theTotalCells) {
                this.gameOn = false;
                /* DEBUG */// validation_notification.innerHTML = '<strong class=\'error too-many-variants\'>' + numVariants + ' Variants x ' + numEachVariant;
                /* DEBUG */// validation_notification.innerHTML += ' of Each Variant is more than a ' + cellsWide + 'x' + cellsHigh + ' Grid can support.';
                /* DEBUG */// validation_notification.innerHTML += '<br> Please use fewer variants or a larger grid.</span>';
            } else {
                if (theTotalVariants < theTotalCells) {
                    this.gameOn = true;
                    /* DEBUG */// validation_notification.innerHTML = 'Looking good! But You have some empty-cells.<br> You can add more ';
                    /* DEBUG */// validation_notification.innerHTML += 'variants, more of each variant... or just play the game!';
                } else {
                    this.gameOn = false;
                    /* DEBUG */// validation_notification.innerHTML = '&nbsp';
                }
            }
        }
    },
    
    /* DEBUG */// function fixErrorsModal() {
        /* DEBUG *///   alert('Please fix game config before playing');
    /* DEBUG */// }
    
    updateTimer: function () {
        var myTime = this.timer.innerHTML;
        var ss = myTime.split(':');
        var dt = new Date();
        dt.setHours(ss[0]);
        dt.setMinutes(ss[1]);
        dt.setSeconds(ss[2]);
    
        var dt2 = new Date(dt.valueOf() + 1000);
        var ts = dt2.toTimeString().split(' ')[0];
        this.timer.innerHTML = ts;
        window.timerTimeout = setTimeout(this.updateTimer, 1000);
    },
    
    resetTimer: function (){
        window.clearTimeout(timerTimeout);
        document.getElementById('timer').innerHTML = '00:00:00';
        window.timerTimeout = setTimeout(updateTimer, 1000);
    },
    
    clearChildren: function (target){
        while (target.firstChild) {
            target.removeChild(target.firstChild);
        }
    },

    getRandomInt: function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
      }

};

document.addEventListener('DOMContentLoaded', memoryGame.init());

