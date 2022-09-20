$(document).ready(() => {
    var buttonColours = ['red', 'blue', 'green', 'yellow'];
    var $levelTitle = $('.level-title');
    var $startGame = $('.start-game-button .front');
    var highScore = 0;

    function nextSequence() {
        return Math.floor(Math.random()*4);
    }

    function continueGame(gamePattern) {
        var randomChosenColour = buttonColours[nextSequence()];
        var audio = new Audio('./sounds/'+randomChosenColour + '.mp3');
        var levelCount = gamePattern.length+1;

        $levelTitle.text('Level '+ levelCount);
        gamePattern.push(randomChosenColour);
        highlightButton(randomChosenColour, 'computer-selected');
        audio.play();

        console.log('gamePattern', gamePattern);
    }

    function highlightButton(color, className) {
        var $element = $('.' + color);
        $element.addClass(className);
                
        setTimeout(() => {
            $element.removeClass(className);
        }, 200);
    }

    function displayError(colorSelected) {
        var audio = new Audio('./sounds/wrong.mp3');
        var $body = $('body');

        $levelTitle.text('Game Over, current high score is:' + highScore);
        highlightButton(colorSelected, 'wrong-selection');
        $body.addClass('game-over');
        audio.play();

        setTimeout(() => {
            $body.removeClass('game-over');
        }, 500);
    }

    function startGame() {
        var gamePattern = [];
        var userInputCount = 0;
        var userInputTotalCount = 0;
        var gameEnded = true;

        continueGame(gamePattern);
        $startGame.text('Restart');

        $('.btn').unbind('click').bind('click', function(event) {
            var colorSelected = event.currentTarget.classList[2];
            console.log('user selection: ', colorSelected);

            if(!gameEnded) {
                displayError(colorSelected);
            } else {
                if(userInputTotalCount > 0 && gamePattern[userInputCount] === colorSelected && userInputCount<userInputTotalCount) {
                    //check previous entries
                    userInputCount++;
                    highlightButton(colorSelected, 'pressed');

                } else if(userInputTotalCount === userInputCount && gamePattern[userInputTotalCount] === colorSelected) {
                    //when 0 - first selection
                    userInputTotalCount++;
                    highlightButton(colorSelected, 'pressed');

                    if(userInputTotalCount === gamePattern.length) {
                        setTimeout(() => {
                            if(gamePattern.length > highScore) {
                                highScore = gamePattern.length;
                            }
                            
                            continueGame(gamePattern);
                            userInputCount = 0; //reset to zero so user have to reenter
                        }, 500);
                    }

                } else {
                    displayError(colorSelected);
                    gameEnded = false;
                }
            }
        });
    }

    $('.start-game-button').unbind('click').bind('click', function(event) {
        clearTimeout($.data(this, 'timer'));
        var wait = setTimeout(startGame, 500);
        $(this).data('timer', wait);
    });
});