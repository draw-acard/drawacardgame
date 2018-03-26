steem.api.setOptions({ url: 'https://api.steemit.com' });
var dao = require('./data/dao.js');
var constants = require('./config.json')

var deckOfCards = ['SA','S2','S3','S4','S5','S6','S7','S8','S9','ST','SJ','SQ','SK','DA','D2','D3','D4','D5','D6','D7','D8','D9','DT','DJ','DQ','DK','CA','C2','C3','C4','C5','C6','C7','C8','C9','CT','CJ','CQ','CK','HA','H2','H3','H4','H5','H6','H7','H8','H9','HT','HJ','HQ','HK'];

var lvl1 = 0.01
var lvl2 = 0.1
var lvl3 = 0.25
var lvl4 = 0.5

var playersPropArray = [];
var playersCardsArray = [];

var numDeck = 52;
var decks = [];
var totalCardsPlayers = 0;
var nameShuffles = "";
var numShuffles = 0;
var numCut = 0;
var nameCut = "";

var repliesNumbersShu = [];
var repliesNumbersCut = [];

var selectedCard = '';
var firstPlace = [];
var secondPlace = [];
var thirdPlace = [];
var jackpotWinners = [];

var	valuesArray = [];
var suitsArray = [];

var playersArray = [];

function readPost(permlink){
	//Put all to zero
	playersPropArray.length = 0;
	playersCardsArray.length = 0;

	numDeck = 52;
	decks.length = 0;
	totalCardsPlayers = 0;
	numShuffles = 0;
	numCut = 0;

	repliesNumbersShu.length = 0;
	repliesNumbersCut.length = 0;
	
	selectedCard = '';
	firstPlace = [];
	secondPlace = [];
	thirdPlace = [];
	jackpotWinners = [];
	
	valuesArray = [];
	suitsArray = [];

	playersArray = [];
	
	var author = 'drawacard';
	
	//Select the comment for number of shuffles and the cut of the deck
	steem.api.getContentReplies(author, permlink, function(err, result) {
        if (err) {
            console.log('Failure! ' + err);
		} else {
			var usedPlayers = [];
			for (var i = 0;i < result.length;i++){
				if ($.isNumeric(result[i].body)){
					if (!usedPlayers.includes(result[i].author)){
						var number = Math.floor(parseInt(result[i].body));
						if (number > 4){
							//Only 1 oportunity to be selected from the replies
							usedPlayers.push(result[i].author);
							if (number < 21){
								repliesNumbersShu.push({name:result[i].author,num:number});
							} else {
								repliesNumbersCut.push({name:result[i].author,num:number});
							}
						}
					}
				}
			}
		}
	});
	
	//Get all voters
	steem.api.getContent(author, permlink, function(err, result) {
        if (err) {
            console.log('Failure! ' + err);
		} else {
			totalCardsPlayers = 0;
			
			for (var i = 0;i < result.active_votes.length;i++){
				var activesVotesArray = result.active_votes.slice();
			  
				//except drawacard
				if(activesVotesArray[i].voter == 'drawacard') {
					continue;
				}
				//cancel voter ignore
				if(activesVotesArray[i].percent == '0') {
					continue;
				}
				var voteSBD = activesVotesArray[i].rshares / result.vote_rshares * result.pending_payout_value.split(' ')[0];
				
				//check under $0.005
				if(voteSBD >= 0.005){
					var numCards = 0;
					if (voteSBD < lvl1){
						numCards = 1;
					} else if (voteSBD < lvl2){
						numCards = 2;
					} else if (voteSBD < lvl3){
						numCards = 3;
					} else if (voteSBD < lvl4){
						numCards = 4;
					} else {
						numCards = 5;
					}
					playersPropArray.push({name:activesVotesArray[i].voter, value:voteSBD, nCard:numCards});
					
					totalCardsPlayers += numCards;
				}
			}
			
			while (numDeck < totalCardsPlayers){
				numDeck += 52;
			}
		}

	});
	makeGameLogic(permlink)
}

function makeGameLogic(permlink){
	
	var roundDeck = [];
	var loopDeck = Math.floor(numDeck/52);
	
	//Create the deck for the game round
	for (var c = 0;c < loopDeck;c++){
		if (c==0){
			roundDeck = deckOfCards.slice();
		} else {
			deckOfCards.forEach(function(card) {
				roundDeck.push(c+card);
			});
		}
	}
	
	//Select numbers of shuffles
	if (repliesNumbersShu.length > 0){
		var numInd = Math.floor(Math.random()*repliesNumbersShu.length);
		numShuffles = repliesNumbersShu[numInd].num;
		nameShuffles = repliesNumbersShu[numInd].name;
	} else {
		numShuffles = Math.floor(Math.random()*15)+5;
	}
	
	//Shuffle
	var shufflesTemp = numShuffles;
	while (shufflesTemp > 0){
		decks[numShuffles - shufflesTemp] = [];
		decks[numShuffles - shufflesTemp] = roundDeck.slice();
		
		tempDeck = numDeck;
		
		numbCut = Math.floor((Math.random()*10)+(numDeck/2 - 5));
		
		//Divide the deck in two
		var deckB = roundDeck.splice(numbCut, numDeck-numbCut); 
		var deckA = roundDeck.slice();
		roundDeck.length = 0;
		
		var sideDeck = '';
		//Simulate the shuffle of the cards with the divided deck
		while(tempDeck > 0){
			shuffleCards = Math.floor(Math.random()*3)+1;
			
			if (tempDeck == numDeck){
				if (Math.floor(Math.random()*2)+1 == 1){
					sideDeck = 'a';
					roundDeck = deckA.splice(0, shuffleCards); 
				} else {
					sideDeck = 'b';
					roundDeck = deckB.splice(0, shuffleCards); 
				}
				tempDeck -= shuffleCards;
			} else {
				if (tempDeck < shuffleCards){
					shuffleCards = tempDeck
				}
				if (sideDeck == 'a'){
					//Shuffle b side
					if (deckB.length != 0){
						if (deckB.length < shuffleCards){
							shuffleCards = deckB.length;
						}
						var cards = deckB.splice(0, shuffleCards); 
						roundDeck.push.apply(roundDeck,cards);
						
						sideDeck = 'b';
					} else {
						shuffleCards = 0;
						sideDeck = 'b';
					}
				} else if (sideDeck == 'b'){
					//Shuffle a side
					if (deckA.length != 0){
						if (deckA.length < shuffleCards){
							shuffleCards = deckA.length;
						}
						var cards = deckA.splice(0, shuffleCards); 
						roundDeck.push.apply(roundDeck,cards);
						
						sideDeck = 'a';
					} else {
						shuffleCards = 0;
						sideDeck = 'a';
					}
				}
				tempDeck -= shuffleCards;
			}
			wait(10);
		}
		shufflesTemp -= 1;
	}
	decks[numShuffles - shufflesTemp] = [];
	decks[numShuffles - shufflesTemp] = roundDeck.slice();
	
	//Select the number of the cut
	if (repliesNumbersCut.length > 0){
		var numInd = Math.floor(Math.random()*repliesNumbersCut.length);
		numCut = repliesNumbersCut[numInd].num;
		nameCut = repliesNumbersCut[numInd].name;
	} else {
		numCut = Math.floor(Math.random()*(numDeck-21))+21;
	}
	
	if (numCut >= numDeck){
		while (numCut >= numDeck){
			numCut -= numDeck
		}
		if (numcut < 21){
			numCut = 21;
		}
	}
	
	//Make the cut
	var deckB = roundDeck.splice(numCut, numDeck-numCut); 
	deckB.push.apply(deckB,roundDeck);
	roundDeck.length = 0;
	roundDeck = deckB.slice();
	decks[numShuffles+1] = roundDeck.slice();
	
	playersPropArray.forEach(function(player) {
		playersCardsArray.push({name:player.name,value:player.value,card1:'',card2:'',card3:'',card4:'',card5:''});
	});
	
	var playersCardsTemp = [];
	
	//Simulate the draw of the top card in the deck with the players orginazed one by one
	for (var i = 1;i < 6;i++){
		playersPropArray.forEach(function(player, index) {
			if (player.nCard >= i){
				var card = roundDeck.pop();
				if (i == 1){
					playersCardsArray[index].card1 = card;
				} else if (i == 2){
					playersCardsArray[index].card2 = card;
				} else if (i == 3){
					playersCardsArray[index].card3 = card;
				} else if (i == 4){
					playersCardsArray[index].card4 = card;
				} else {
					playersCardsArray[index].card5 = card;
				}
				playersCardsTemp.push({name:player.name,card:card});
			}
		});
	}
	
	//Select the wining card
	var ranNum1 = Math.floor(Math.random()*(numDeck));
	wait(Math.floor(Math.random()*20)+80);
	var ranNum2 = Math.floor(Math.random()*(numDeck));
	wait(Math.floor(Math.random()*20)+80);
	var ranNum3 = Math.floor(Math.random()*(numDeck));
	
	var ranNum = 0;
	var ranNum = ranNum1+ranNum2+ranNum3;
	
	if (ranNum >= numDeck){
		while (ranNum >= numDeck){
			ranNum -= numDeck
		}
		if (ranNum < 0){
			ranNum = 0;
		}
	}
	
	selectedCard = decks[0][ranNum];
	
	//Get 1st place
	var indFirst = 0;
	playersCardsTemp.forEach(function(player, index) {
		if (player.card == selectedCard){
			firstPlace.push(player.name);
			indFirst = index;
		}
	});
	playersCardsTemp.splice(indFirst,1);
	
	//Get distance of selected card
	var distanceToCard = [];
	var pointOfCard = ranNum;
	playersCardsTemp.forEach(function(player) {
		var contPoint = 0;
		var cont = 0;
		//Check to the right and the left
		for (var i = numDeck;i>0;i--){
			
			if (pointOfCard+contPoint >= numDeck){
				pointOfCard = 0;
				contPoint = 0;
			}
			
			if (decks[0][pointOfCard+contPoint] == player.card){
				if (cont > numDeck/2){
					//Left
					distanceToCard.push({dist:numDeck-cont,name:player.name});
				} else {
					//Right
					distanceToCard.push({dist:cont,name:player.name});
				}
				break;
			}
			cont++;
			contPoint++;
		}
		pointOfCard = ranNum;
	});
	//Sort the distances to min to max 
	distanceToCard.sort(function(a, b){return a.dist - b.dist});
	
	//Get 2nd place
	secondPlace.push(distanceToCard[0].name);
	var rewardDist = distanceToCard[0].dist;
	distanceToCard.shift();
	if (distanceToCard[0].dist == rewardDist){
		secondPlace.push(distanceToCard[0].name);
		distanceToCard.shift();
	}
	
	//Get 3rd place
	thirdPlace.push(distanceToCard[0].name);
	var rewardDist3 = distanceToCard[0].dist;
	distanceToCard.shift();
	if (distanceToCard[0].dist == rewardDist3){
		thirdPlace.push(distanceToCard[0].name);
		distanceToCard.shift();
	}
	
	//Jackpot Winners
	var playersHand = [];
	playersCardsArray.forEach(function(player) {
		var hand = [];
		var handAll = [];
		
		var card1 = player.card1;
		while($.isNumeric(card1.charAt(0))) {
			card1 = card1.slice(1);
		}
		hand.push(card1);
		handAll.push(player.card1);
		
		if (!player.card2.length == 0){
			var card2 = player.card2;
			while($.isNumeric(card2.charAt(0))) {
				card2 = card2.slice(1);
			}
			hand.push(card2);
			handAll.push(player.card2);
			if (!player.card3.length == 0){
				var card3 = player.card3;
				while($.isNumeric(card3.charAt(0))) {
					card3 = card3.slice(1);
				}
				hand.push(card3);
				handAll.push(player.card3);
				if (!player.card4.length == 0){
					var card4 = player.card4;
					while($.isNumeric(card4.charAt(0))) {
						card4 = card4.slice(1);
					}
					hand.push(card4);
					handAll.push(player.card4);
					if (!player.card5.length == 0){
						var card5 = player.card5;
						while($.isNumeric(card5.charAt(0))) {
							card5 = card5.slice(1);
						}
						hand.push(card5);
						handAll.push(player.card5);
					}
				}
			}
		}
		
		var value = evaluateHand(hand);
		playersHand.push({name:player.name,hand:hand,value:value});
		if (value > 0){
			jackpotWinners.push({name:player.name,value:value})
		}
		
		//Put all the info in a new array to sort the winners
		playersArray.push({name:player.name,hand:handAll,sbd:player.value,winner:100,valueJack:value})
		if (firstPlace.includes(player.name)){
			playersArray[playersArray.length - 1].winner = 1;
		} else if (secondPlace.includes(player.name)){
			playersArray[playersArray.length - 1].winner = 2;
		} else if (thirdPlace.includes(player.name)){
			playersArray[playersArray.length - 1].winner = 3;
		}
	});
}

//Poker hand evaluator ------START------
 
// given a value "n", returns the number of occurrences of "n" in "hand" array. Useful to know how many "two"s or "three"s and so on we have on a hand
function occurrencesOf(n){
     var count = 0;
     var index = 0;   
     do{          
          index = valuesArray.indexOf(n, index) + 1;  
          if(index == 0){
               break;
          }
          else{
               count ++;
          }
     } while(index < valuesArray.length);
     return count;
}
 
// thanks to occurrencesOf, this function returns a string with the combination of duplicate cards.
// If you have "Four of a Kind" it will return "4", if you have "Three of a kind" il will return "3",
// if you have "Full House" it will return "32" or "23" and so on.
function duplicateCards(){
     var occurrencesFound = []; 
     var result = "";
     for(var i = 0; i < valuesArray.length; i++){
          var occurrences = occurrencesOf(valuesArray[i]);
          if(occurrences > 1 && occurrencesFound.indexOf(valuesArray[i]) == -1){
               result += occurrences; 
               occurrencesFound.push(valuesArray[i]);    
          }
     }
     return result;
}
 
// this function will return the lowest number in a hand. Useful to check for straights
function getLowest(){
     var min = 12;
     for(var i = 0; i < valuesArray.length; i++){
          min = Math.min(min, valuesArray[i]);     
     }
     return min;     
}
 
// we have a straight when starting from the lowest card we can find an occurrence of lowest card +1, +2, +3 and +4
function isStraight(){
	if (valuesArray.length == 5){
		var lowest = getLowest();
		for(var i = 1; i < 5; i++){
			if(occurrencesOf(lowest + i) != 1){
				return false
			} 
		}
	} else if (valuesArray.length == 4){
		var lowest = getLowest();
		for(var i = 1; i < 4; i++){
			if(occurrencesOf(lowest + i) != 1){
				return false
			} 
		}
	} else {
		return false;
	}
    return true;
}
 
// we have an ace straight when you have 10 (9), J (10), Q (11), K (12) and A (0)
function isAceStraight(){
	if (valuesArray.length == 5){
		var lowest = 8;
		for(var i = 1; i < 5; i++){
			if(occurrencesOf(lowest + i) != 1){
				return false;
			}     
		}
	} else {
		return false;
	}
    return occurrencesOf(0) == 1;
}
 
// we have a flush when all items in suitsArray have the same value
function isFlush(){
	if (suitsArray.length == 5){
		for(var i = 0; i < 4; i ++){
			if(suitsArray[i] != suitsArray[i+1]){
				return false;
			}
		}
	} else if (suitsArray.length == 4){
		for(var i = 0; i < 3; i ++){
			if(suitsArray[i] != suitsArray[i+1]){
				return false;
			}
		}
	} else {
		return false;
	}
    return true;
}  
 

function evaluateHand(hand){
	valuesArray = [];
    suitsArray = [];

	var value = 0;
	
	for(var i = 0; i < hand.length; i ++){
		var numCard = deckOfCards.indexOf(hand[i]);
        valuesArray[i] = numCard % 13;
        suitsArray[i] = Math.floor(numCard / 13);     
    }
	switch(duplicateCards()){
		case "2":
			//Pair
			value = 1;
			break;
		case "22":
			//2 pairs
			value = 2;
			break;
		case "3":
			//3 of a kind
			value = 3;
			break;
		case "23":
		case "32":
			//Full house
			value = 7;
			break;
		case "4":
			//4 of a kind
			value = 6;
			break;
		case "5":
			//5 of a kind
			value = 9;
			break;
		default:
			if(isStraight()){
				//Straight
				value = 4;     
			}
			if(isAceStraight()){
				//Straight Ace
				value = 10;
			}
			break;
    }
    if(isFlush()){
        if(value != 0){
            //Straight flush
			if (value == 4){
				value = 8;
			}
		} else {
			//Flush
			value = 5;
        }
    } else {
		if (value == 10){
			//Straight
			value = 4;
		}
	}
	
	return value;
}
//Poker hand evaluator ------END------

function updatePost(permlink){
	
	var content = '';
	
	content += '<h1>Vote and you can win SBD and even more with our progressive jackpot!</h1>';
	content += 'Game Image';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Game Round</h1>';
	content += 'Number of Cards: ' + numDeck; 
	content += '<br/>';
	content += 'Amount of Shuffles: ' + numShuffles + ' ' + nameShuffles; 
	content += '<br/>';
	content += 'Cutting Number: ' + numCut + ' ' + nameCut; 
	content += '<br/><table><tr><td>';
	content += 'Chosen Card: </td><td>' + '<img src="cards/'+selectedCard+'.png" alt='+selectedCard+'></td></tr></table>';
	content += ' <br/> <table> <tr> <th>Name</th><th>Cards</th><th>Place</th><th>Jackpot</th> </tr> ';
	var tempPlayers = playersArray.slice();
	tempPlayers.sort(function(a, b){return a.winner - b.winner});
	tempPlayers.forEach(function(player, index) {
		content += '<tr>';
		content += '<td>';
		content += player.name;
		content += '</td>';
		content += '<td>';
		player.hand.forEach(function(card){
			content += '<img src="cards/'+card+'.png" alt='+card+'>';
		});
		content += '</td>';
		content += '<td>';
		if (player.winner == 1){
			content += 'First Place!!';
		} else if (player.winner == 2){
			content += 'Second Place!!';
		} else if (player.winner == 3){
			content += 'Third Place!!';
		}
		content += '</td>';
		content += '<td>';
		if (player.valueJack == 1) { 
			content += 'Pair 10%'
		} else if (player.valueJack == 2) { 
			content += 'Two pairs 20%'
		} else if (player.valueJack == 3) { 
			content += 'Three of a Kind 30%'
		} else if (player.valueJack == 4) { 
			content += 'Straight 40%'
		} else if (player.valueJack == 5) { 
			content += 'Flush 50%'
		} else if (player.valueJack == 6) { 
			content += 'Four of a Kind 60%'
		} else if (player.valueJack == 7) { 
			content += 'Full House 70%'
		} else if (player.valueJack == 8) { 
			content += 'Straight Flush 80%'
		} else if (player.valueJack == 9) { 
			content += 'Five of a Kind 90%'
		} else if (player.valueJack == 10) { 
			content += 'Royal Flush 100%'
		}
		content += '</td>';
		content += '</tr>';
	});
	content += '</table>';
	content += '<br/>';
	content += 'Log of the Deck:';
	content += '<br/>';
	decks.forEach(function(deck, index) {
		content += (index+1) + ': ';
		if (index == 1){
			content += 'Start Shuffling';
		} else if (index == decks.length - 2){
			content += 'End Shuffling';
		} else if (index == decks.length - 1){
			content += 'Cut the Deck';
		}
		content += '<br/>';
		deck.forEach(function(card) {
			content += card + ',';
		});
		content += '<br/>';
	});
	content += '<br/>';
	content += '<br/>';
	content += '<h1>How to Join</h1>';
	content += '-If you want to join to the game just vote this post.';
	content += '<br/>-If your vote amount is above $0.01 you have more possibilities and can win the progressive jackpot!';
	content += "<br/>-There'll be 2 game rounds, from now, every day.";
	content += '<br/>-Games round last 24 hours after that the game will be complete.';
	content += '<br/>-Completes games are labeled [COMPLETE].';
	content += '<br/>-Results are updated in this post after 24 hours.';
	content += '<br/>-You can check the live result [here]().';
	content += '<br/>-The minimum amount of players is 3.';
	content += "<br/>-Less than $0.005 voting don't participate in the game round.";
	content += '<br/>-But you can participate indirectly by commenting this post.';
	content += '<br/>-To be selected you need to comment only a number above 5.';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Game Rules</h1>';
	content += '-The amount of cards in the deck is 52.';
	content += '<br/>-If the amount of cards to the participants exceeds the deck amount another deck will be added.';
	content += '<br/>-Cards will be flushed min 5 and max 20 chosen randomly by a comment reply.*';
	content += '<br/>-The deck will be cut by min 21 and max the total of cards in the deck chosen randomly by a comment reply.* **';
	content += '<br/>-Every participant draws min one card and max 5 cards, the amount is determined by the amount of the vote.';
	content += '<br/>-A new deck with the same amount of card will be organized from spades, diamonds, clover, and hearts.';
	content += '<br/>-The selected card will be chosen randomly.***';
	content += "<br/>-The first place is the one who got the chosen card. If there's no winner the reward will be divided like explained below.";
	content += '<br/>-The second place will be given to the card closest to the chosen card to the right and to the left.';
	content += '<br/>-And the third place is awarded to the card closest to the chosen card after the second place also to the right and to the left.';
	content += '<br/>-Example game: [DTube]() (Mirror: [YouTube](https://youtu.be/3w9pBZdrnAE))';
	content += '<br/>';
	content += '<br/>';
	content += "*If there's no one that put a correct reply in the comments the random number will be selected by the code.";
	content += "<br/>**If the numbers exceed the number of cards in the deck the number will be subtracted until it reaches the numbers between 0 and the total amount of the deck. If it's 20 or less the number will be 21.";
	content += '<br/>***Three random numbers from 0 to the total amount of playing cards will be added to each other and if it exceeds the number of the total deck it will subtract the total amount until it reaches the numbers between 1 and the total amount of the deck. That number will be the chosen card in the organized deck being 1 = A of spades and 52 = K of hearts.';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Numbers of Cards in the Hand</h1>';
	content += '-If your voting is over a certain amount you get more cards.';
	content += '<br/>	$0.005 - $0.009 = 1 Card';
	content += '<br/>	$0.010 - $0.099 = 2 Cards';
	content += '<br/>	$0.100 - $0.249 = 3 Cards';
	content += '<br/>	$0.250 - $0.499 = 4 Cards';
	content += '<br/>	Over $0.500 = 5 Cards';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Progressive Jackpot Amount</h1>';
	content += '<br/>';
	content += '$0.00*';
	content += '<br/>';
	content += '<br/>';
	content += '*The real amount is delayed by 7 days it could be more or less.';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Rewards</h1>';
	content += '<h4>1st Place*</h4>';
	content += '-60% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<h4>2nd Place**</h4>';
	content += '-15% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<h4>3rd Place**</h4>';
	content += '-10% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<h4>The Highest Voter</h4>';
	content += '-5% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<h4>Progressive Jackpot</h4>';
	content += '-5% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<h4>Development and Maintenance</h4>';
	content += '-5% of the reward SBD of this post after payout.';
	content += '<br/>';
	content += '<br/>';
	content += '*If there is no winner in the 1st place the amount will be divided by 40% to the progressive jackpot, 40% to the 2nd place and the remaining 20% to the 3rd place.';
	content += '<br/>**If there are two winners in the 2nd or 3rd place the reward amount will be divided equally among the winners.';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Progressive Jackpot Rewards</h1>';
	content += '-When you have more than one card you can win the progresive jackpot with your hand.';
	content += '<br/>-The reward is coming from all game rounds.';
	content += '<br/>-This are the amounts you can win:';
	content += '<br/>Pairs = 10%';
	content += '<br/>Two Pairs = 20%';
	content += '<br/>Three of a Kind = 30%';
	content += '<br/>Straight (min 4) = 40%';
	content += '<br/>Flush (min 4) = 50%';
	content += '<br/>Four of a Kind = 60%';
	content += '<br/>Full House = 70%';
	content += '<br/>Straight Flush (min 4) = 80%';
	content += '<br/>Five of a Kind = 90%';
	content += '<br/>Royal Flush = 100%';
	content += '<br/>';
	content += '<br/>*If there are two winners with the same hand combination the reward amount will be divided equally by the winners.';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Source Code and Website</h1>';
	content += '[GitHub]()';
	content += '<br/>Website (Coming Soon)';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>Good Luck!</h1>';
	
	var ret = {permlink:permlinkGame,decks:decks,numCut:numCut,namCut:nameCut,numShuff:numShuffles,namShuff:nameShuffles,selCard:selectedCard,players:playersArray};
	
	steem.broadcast.comment(
        constants.posting, // posting wif
        '', // author, leave blank for new post
        constants.category, // first tag
        constants.author, // username
        permlink, // permlink
        "[COMPLETE]Draw A Card Game. Win SBD With Your Vote! Round: " + permlink, // Title
        content, // Body of post
        // json metadata (additional tags, app name, etc)
        { tags: ['votegame', 'money', 'gaming', 'contest'], app: '' },
        function (err, result) {
          if (err)
            console.log('Failure! ' + err);
          else{
			//Save in DataBase
			dao.saveGameRound(ret);
            console.log('Success'); 
          }
        });
}
