function MemoryGame() {

    //game variables
    var isMouseDown;
    var mouse_x, mouse_y;
    var canvas_width,canvas_height;
    var gameFinished;
    
    //game objects
    var cards; // array - contains the card definition, id, image etc
    var board;  // 2 dimensional array - 
                // contains card ids as the cards are placed on the board
    
    var pairs; //number of pairs in the game

    var horizontal_card_count; 
    var vertical_card_count;
    
    //player
    var activePlayer;
    var activePlayerIndex;
    var players;
    
    var selectedCard1;
    var selectedCard2;
    
    var promptNextPlayer;  
    var playerSwitchConfirmed;
    
    //visuals
    var topBoardMargin;
    var cardMargin;
    var cardWidth, cardHeight;
    
    var bubble_left, bubble_right;
    
    this.init = function(canvas_width,canvas_height){ 
        
        console.log("canvas size is "+canvas_width+"x"+canvas_height);
        
        this.isMouseDown = false;
        this.canvas_width = canvas_width;
        this.canvas_height = canvas_height;
        this.gameFinished = false;
        
        this.topBoardMargin = 105;
        this.cardMargin = 15;
        
        this.pairs = 9;
        
        this.vertical_card_count = 3;
        this.horizontal_card_count = 6 ;
        
        this.cardWidth = 180;
        this.cardHeight = 180;
        
        this.bubble_left = document.getElementById('img_bubble_left');
        this.bubble_right = document.getElementById('img_bubble_right');
        
        //generate cards
        this.cards = new Array(this.pairs*2);
        
         //create first half
        for (var i = 0; i < this.pairs; i++) {
            
            var partnerIndex = i + this.pairs; //start at pair counter
            
            var card_R = Math.floor(Math.random() * 255);
            var card_G = Math.floor(Math.random() * 255);
            var card_B = Math.floor(Math.random() * 255);
            
            var memCard = new MemoryCard(i,partnerIndex);
            memCard.r = card_R;
            memCard.g = card_G;
            memCard.b = card_B;
            memCard.imageID =  document.getElementById('img_card_p_'+i+'_0');
            
            this.cards[i] = memCard;
        }
        
        //create second half
        for (var i = this.pairs; i < this.cards.length; i++) {
            
            var partnerIndex = i - this.pairs;
            var sourceCard = this.cards[partnerIndex] //get partner as source
            
            var memCard = new MemoryCard(i,partnerIndex);
            memCard.r = sourceCard.r;
            memCard.g = sourceCard.g;
            memCard.b = sourceCard.b;
            memCard.imageID = document.getElementById('img_card_p_'+partnerIndex+'_1');
            
            this.cards[i] = memCard;
        }
        
        
        //generate card seed
        var cardSeed = new Array(this.pairs*2);
        for (var i = 0; i < cardSeed.length; i++) {
            cardSeed[i] = i;
        }
        
        this.shuffle(cardSeed);
        

        
        var seedPosition = 0;
        
        this.board = new Array(this.horizontal_card_count); //init grid
        for(var i = 0; i < this.horizontal_card_count; i++){            
            this.board[i] = new Array(this.vertical_card_count);
            
            for(var j = 0; j < this.vertical_card_count; j++){
                
                //fill grid from seed
                this.board[i][j] = cardSeed[seedPosition++];
            }
        }
        
        //calculate card size
        var horizontal_space = this.cardMargin * (this.horizontal_card_count+1);
        var vertical_space = this.cardMargin * (this.vertical_card_count+1);
        

        
        //calculate positions
        for(var i = 0; i < this.horizontal_card_count; i++){                  
            for(var j = 0; j < this.vertical_card_count; j++){
                
                var cur_card = this.cards[this.board[i][j]];
                
                
                var leftOffset = this.cardMargin + (i*this.cardMargin)+(i*this.cardWidth);
                var topOffset = this.cardMargin + (j*this.cardMargin) + 
                                (j*this.cardHeight) + this.topBoardMargin;
                
                
                cur_card.x = leftOffset;
                cur_card.y = topOffset;
                cur_card.width = this.cardWidth;
                cur_card.height = this.cardHeight;
            }
        }
        
        this.players = [
            new MemoryPlayer("player 1"),     
            new MemoryPlayer("player 2")
        ];
        
        this.activePlayerIndex = 0;
        this.activePlayer = this.players[this.activePlayerIndex];
        
        this.selectedCard1 = null;
        this.selectedCard2 = null;
        
        this.promptNextPlayer = false;  
        this.playerSwitchConfirmed = false;
    }
        
    this.splashscreen = function(){
        console.log("Pacman splashscreen")
    }
    
    this.processMouseInput = function(x,y){
        mouse_x = x;
        mouse_y = y;
    }
    
    this.processMousePressed = function(primary_down,secondary_down){
        this.isMouseDown = primary_down;        
  
        if(primary_down){
            
            if(!this.promptNextPlayer ){
                
                for(var i = 0; i < this.horizontal_card_count; i++){                  
                    for(var j = 0; j < this.vertical_card_count; j++){

                        var cur_card = this.cards[this.board[i][j]];
                        var clicked = cur_card.containsPoint(mouse_x,mouse_y);
                        if(clicked){

                           
                            cur_card.opened = true;

                            if(this.selectedCard1 == null){
                                this.selectedCard1 = cur_card;
                            }
                            else {
                                this.selectedCard2 = cur_card;
                            }

                            break;
                        }
                    }
                }//outer for
                
            } //if promptplayer active 
            else{
                this.playerSwitchConfirmed = true;
            }           

        }//if primary mouse down
        
    }//function
    
    this.processKeyInput = function(e){
        if ( e.keyCode == 68 ) { //d

        }
        else if ( e.keyCode == 65 ) { //a

        }

    }
        
    this.update = function(){
       if(this.selectedCard1 != null && this.selectedCard2 != null){
           
           if(this.selectedCard1.index == this.selectedCard2.partnerIndex){
               this.activePlayer.receivePoint();
               
               this.selectedCard1 = null;
               this.selectedCard2 = null;
           }
           else{
            
               if(this.playerSwitchConfirmed){
                   
                  this.nextPlayer();
               
                   this.selectedCard1.opened = false;
                   this.selectedCard2.opened = false;

                   this.selectedCard1 = null;
                   this.selectedCard2 = null;
                   
                   this.promptNextPlayer = false;
                   this.playerSwitchConfirmed = false;
                   
               }
               else if (!this.promptNextPlayer ){
                   this.promptNextPlayer = true;  
                   this.playerSwitchConfirmed = false;
               }
                           
           }
           
       }
    }
    
    this.renderCycle = function(context){
        
            
        
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur    = 7;


        //debug
        /*
        if(this.selectedCard1 != null){
            context.fillText(this.selectedCard1.index+" - "+this.selectedCard1.partnerIndex,5,10);  
        }
        else{
            context.fillText("card 1 null",5,10);
        }   
        
        if(this.selectedCard2 != null){
            context.fillText(this.selectedCard2.index+" - "+this.selectedCard2.partnerIndex,5,25);
        }
        else{
            context.fillText("card 2 null",5,25);
        }
        
        context.fillText("prompt next player "+this.promptNextPlayer,100,10);
        context.fillText("player switch confirmed "+this.playerSwitchConfirmed,100,25);
        
        */
        //left space
        var startPosY = 30; 
        var startPosX = this.canvas_width-230;
        

        context.shadowColor   = "gray";
        
        //display player bubble
        //context.drawImage(this.bubble_right,10, 10, 400, 95);

        
        
        if(this.isMouseDown){
            context.fillStyle = "rgb(0,0,255)";
            context.fillRect(mouse_x, mouse_y, 25, 25);
        }
        
        //paint cards
        for(var i = 0; i < this.horizontal_card_count; i++){                  
            for(var j = 0; j < this.vertical_card_count; j++){
                
                var cur_card = this.cards[this.board[i][j]];
                cur_card.drawCard(context);
            }
        }
        
        
        context.shadowColor = "transparent";        
        context.fillStyle = "rgb(0,0,0)";  
        

        //set font
        context.font="50px beauty_and_the_beastregular";
        context.lineWidth = 2;
        context.strokeStyle = "rgb(0,0,0)";
        
        //display active player
        context.fillText(this.activePlayer.name +"'s turn",20,70);   
        //context.strokeText(this.activePlayer.name +"'s turn",20,50);   
        
        //display points
        context.font="30px beauty_and_the_beastregular";
        
                
        
        
        
        
       
        
        for(var i = 0; i < this.players.length; i++){
            
            var playr = this.players[i];
            
            if((i%2) == 0){
                //gerade
                
                var pX = startPosX-190;
                var pY = startPosY-20;
                
                //context.shadowColor   = "gray";
                //context.drawImage(this.bubble_right,pX, pY, 200, 70);
                
                context.shadowColor = "transparent"; 
                context.fillText(playr.points+" - "+playr.name,pX+10,(pY+(i*30))+42);
            }
            else{
                //ungerade
                        
                //context.shadowColor   = "gray";
                //context.drawImage(this.bubble_left,startPosX, startPosY, 200, 70);
                
                 context.shadowColor = "transparent"; 
                context.fillText(playr.points+" - "+playr.name,startPosX+40,(startPosY+(i*30))+12);
            }
        }
        
        
        if(this.promptNextPlayer){
            
            var horizontalMargin = 100;
            var verticalMargin = 300;
            
            var promptWidth = 400;
            var promptHeight = this.canvas_height - (verticalMargin*2);
            
            context.fillStyle = "rgb(255,255,255)";
            context.fillRect(horizontalMargin, verticalMargin, promptWidth, promptHeight);
            
            context.fillStyle = "rgb(0,0,0)";
            context.font="30px Verdana";
            context.fillText("next player",
                             horizontalMargin+(promptWidth/3),
                             verticalMargin+(promptHeight/2));
        }
        
    }
    
    this.killscreen = function(){
        console.log("Memory killscreen")
    }
    
    this.isFinished = function(){
        return this.gameFinished;        
    }
    
    this.shuffle = function(a) {
        
        for (let i = a.length; i; i--) {
            let j = Math.floor(Math.random() * i);
            [a[i - 1], a[j]] = [a[j], a[i - 1]];
        }
    }
    
    this.nextPlayer = function(){
        
        this.activePlayerIndex++;
        if(this.activePlayerIndex >= this.players.length){
            this.activePlayerIndex = 0;
        }
        this.activePlayer = this.players[this.activePlayerIndex];
    }
    
}//class

function MemoryCard (index, partIndex) {

    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.opened = false;
    this.cardBack = document.getElementById('img_card_back');
    this.imageID = null;
    
    this.index = index;
    this.partnerIndex = partIndex;
    
    this.containsPoint = function (x, y) {
        return this.x <= x && x <= this.x + this.width &&
               this.y <= y && y <= this.y + this.height;
    }

    this.drawCard = function (context) {
        
        if(!this.opened){
            context.fillStyle = this.calcRGB(175,175,175);
            context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.cardBack,this.x, this.y);
        }
        else{
            if(this.imageID != null){
                 context.drawImage(this.imageID, this.x, this.y);
            }
            else{
                context.fillStyle = this.calcRGB(this.r,this.g,this.b);
                context.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    }
    
    this.calcRGB = function(r, g, b){
        return ["rgb(",r,",",g,",",b,")"].join("");
    }
}


function MemoryPlayer (playerName) {

    this.name = playerName;
    this.points = 0;

    
    this.receivePoint = function () {
        this.points++;
    }

}