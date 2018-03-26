steem.api.setOptions({ url: 'https://api.steemit.com' });
var dao = require('./data/dao.js');
var constants = require('./config.json')

function postGame(permlink){
	var content = '';
	
	content += '<h1>Vote and you can win SBD and even more with our progressive jackpot!</h1>';
	content += 'Game Image';
	content += '<br/>';
	content += '<br/>';
	content += '<h1>[RESERVED] Game Round</h1>';
	content += '- <br/>';
	content += 'Example game: [DTube]() (Mirror: [YouTube](https://youtu.be/3w9pBZdrnAE))* ';
	content += '<br/>';
	content += '<br/>';
	content += '*The actual round will be upload to YouTube for convenience and also a text update in this post.';
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
	
	steem.broadcast.comment(
        constants.posting, // posting wif
        '', // author, leave blank for new post
        constants.category, // first tag
        constants.author, // username
        permlink, // permlink
        "Draw A Card Game. Win SBD With Your Vote! Round: " + permlink, // Title
        content, // Body of post
        // json metadata (additional tags, app name, etc)
        { tags: ['votegame', 'money', 'gaming', 'contest'], app: '' },
        function (err, result) {
          if (err)
            console.log('Failure! ' + err);
          else{
	    //Save in DataBase
	    dao.savePermlink(permlink);
            console.log('Success'); 
          }
        });
}
