function MemoryGame() {

    //game variables
    var isMouseDown;
    var mouse_x, mouse_y;
    var canvas_width,canvas_height;
    
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
    
    var winner;
    
    var selectedCard1;
    var selectedCard2;
    
    var promptNextPlayer;  
    var playerSwitchConfirmed;
    var showWinner;
    
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
        this.winner = null;
        
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
            
            if(!this.promptNextPlayer){
                
                for(var i = 0; i < this.horizontal_card_count; i++){                  
                    for(var j = 0; j < this.vertical_card_count; j++){

                        var cur_card = this.cards[this.board[i][j]];
                        var clicked = cur_card.containsPoint(mouse_x,mouse_y);
                        if(clicked){
                            
                            if(!cur_card.opened){
                                                   
                                cur_card.open();

                                if(this.selectedCard1 == null){
                                    this.selectedCard1 = cur_card;
                                }
                                else {
                                    this.selectedCard2 = cur_card;
                                }

                                break;
                            }
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
               
               if(this.gameFinished()){
                   this.endGame();
               }
               
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
                   
                   if(!this.selectedCard1.open_transition && !this.selectedCard2.open_transition){
                       this.promptNextPlayer = true;  
                       this.playerSwitchConfirmed = false;
                   }
               }
                           
           }
           
       }
    }
    
    this.renderCycle = function(context){
        
            
        
        context.shadowOffsetX = 4;
        context.shadowOffsetY = 4;
        context.shadowBlur    = 7;


        
       
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
        
        
        //context.shadowColor = "transparent";        
        context.fillStyle = "rgb(0,0,0)";  
        

        //set font
        context.font="50px beauty_and_the_beastregular";
        context.lineWidth = 2;
        context.strokeStyle = "rgb(255,255,255)";
        
        //display active player
        context.fillText(this.activePlayer.name +"'s turn",20,70);   
        //context.strokeText(this.activePlayer.name +"'s turn",20,70);   
        
        //display points
        context.font="30px beauty_and_the_beastregular";
        
 
       
        
        for(var i = 0; i < this.players.length; i++){
            
            var playr = this.players[i];
            
            if((i%2) == 0){
                //gerade
                
                var pX = startPosX;
                var pY = startPosY;
                
                //context.shadowColor   = "gray";
                //context.drawImage(this.bubble_right,pX, pY, 200, 70);
                
                
                context.fillText(playr.points+" - "+playr.name,startPosX+40,(pY+(i*30))+20);
            }
            else{
                //ungerade
                        
                //context.shadowColor   = "gray";
                //context.drawImage(this.bubble_left,startPosX, startPosY, 200, 70);
                context.fillText(playr.points+" - "+playr.name,startPosX+40,(startPosY+(i*30))+30);
            }
        }
        
        
        if(this.promptNextPlayer){            
            
            
            var leftOffset = 460;
            var topOffset = 280;
            
            var promptWidth = 350;
            var promptHeight = 100;
                        
            this.drawPopUP(context,leftOffset,topOffset,promptWidth,promptHeight,"next player");
        }
        
        if(this.showWinner){
            var leftOffset = 440;
            var topOffset = 280;
            
            var promptWidth = 400;
            var promptHeight = 100;
                        
            this.drawPopUP(context,
                           leftOffset,
                           topOffset,
                           promptWidth,
                           promptHeight, 
                           this.winner.name+" wins!");
        }
        
    }
    
    this.drawPopUP = function(context,x, y, width, height, text){
            

            
            context.fillStyle = "rgb(255,255,255)";
            //context.fillRect(horizontalMargin, verticalMargin, promptWidth, promptHeight);
            
            context.drawImage(this.bubble_right, x, y, width, height);
            
            context.shadowColor   = "transparent";
            context.fillStyle = "rgb(0,0,0)";
            context.font="50px beauty_and_the_beastregular";
            context.fillText(text,x+20,y+60);
        
    }
    
    
    this.isFinished = function(){
        return false;        
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
    
    
    this.gameFinished = function(){
        
        for(var i = 0; i < this.horizontal_card_count; i++){                  
            for(var j = 0; j < this.vertical_card_count; j++){

                var cur_card = this.cards[this.board[i][j]];
                if(!cur_card.opened){
                    return false;   
                }
            }
        }//outer for
        return true;
    }
    
    this.endGame = function(){
        
        var tmp = this.players[0];
        
        for(var i = 1; i < this.players.length; i++){
            
            var playr = this.players[i];
            if(playr.points > tmp.points){
                tmp = playr;
            }
        }
        
        this.winner = tmp;
        this.showWinner = true;
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
    this.anim_speed = 30;
    
    this.opened = false;
    this.cardBack = document.getElementById('img_card_back');
    this.imageID = null;
    
    this.index = index;
    this.partnerIndex = partIndex;
    this.open_transition;
    
    this.renderWidth = 0;
    this.renderHeight = 0;
    
    this.containsPoint = function (x, y) {
        return this.x <= x && x <= this.x + this.width &&
               this.y <= y && y <= this.y + this.height;
    }

    this.drawCard = function (context) {
        

        
        if(this.open_transition){
            
            //this.renderHeight = this.renderHeight - 10;
            this.renderWidth = this.renderWidth - this.anim_speed;
            if(this.renderWidth < 1){
                this.renderWidth = 0;
                this.open_transition = false;
                
            }
        }
        else{
            this.renderHeight = this.height;
            this.renderWidth = this.width;
        }
        
        var cWidth = this.renderWidth;
        var cHeight = this.renderHeight;
        
        if(!this.opened || this.open_transition){
            context.fillStyle = this.calcRGB(175,175,175);
            
            roundRect(context,this.x, this.y, cWidth,cHeight,15,true,false);
            
            //context.fillRect(this.x, this.y, this.width, this.height);
            context.drawImage(this.cardBack,this.x, this.y,cWidth,cHeight);
        }
        else{
            if(this.imageID != null){
                 context.drawImage(this.imageID, this.x, this.y,cWidth,cHeight);
            }
            else{
                context.fillStyle = this.calcRGB(this.r,this.g,this.b);
                roundRect(context,this.x, this.y, this.width, this.height,15,true,false);
            }
        }
    }
    
    this.open = function(){        
        this.opened = true;
        this.open_transition = true;
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

/**
 * Draws a rounded rectangle using the current state of the canvas.
 * If you omit the last three params, it will draw a rectangle
 * outline with a 5 pixel border radius
 * @param {CanvasRenderingContext2D} ctx
 * @param {Number} x The top left x coordinate
 * @param {Number} y The top left y coordinate
 * @param {Number} width The width of the rectangle
 * @param {Number} height The height of the rectangle
 * @param {Number} [radius = 5] The corner radius; It can also be an object 
 *                 to specify different radii for corners
 * @param {Number} [radius.tl = 0] Top left
 * @param {Number} [radius.tr = 0] Top right
 * @param {Number} [radius.br = 0] Bottom right
 * @param {Number} [radius.bl = 0] Bottom left
 * @param {Boolean} [fill = false] Whether to fill the rectangle.
 * @param {Boolean} [stroke = true] Whether to stroke the rectangle.
 */
function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
  if (typeof stroke == 'undefined') {
    stroke = true;
  }
  if (typeof radius === 'undefined') {
    radius = 5;
  }
  if (typeof radius === 'number') {
    radius = {tl: radius, tr: radius, br: radius, bl: radius};
  } else {
    var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
    for (var side in defaultRadius) {
      radius[side] = radius[side] || defaultRadius[side];
    }
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
  if (fill) {
    ctx.fill();
  }
  if (stroke) {
    ctx.stroke();
  }

}