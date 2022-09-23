$(document).ready(function() {
    var buttonColours = ['red', 'blue', 'green', 'yellow'];
    var $body = $('body');
    var $levelTitle = $('.level-score');
    var $highScore = $('.high-score');
    var $startGame = $('.start-game-button .front');
    var highScore = 0;
    var gamePattern = [];
    var userInputCount = 0;
    var userInputTotalCount = 0;
    var gameEnded = true;

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
        var $element = $('.' + color +' .front');
        $element.addClass(className);
                
        setTimeout(() => {
            $element.removeClass(className);
        }, 300);
    }

    function updateHighScore() {
        var highScoreList = $highScore[0].outerText.split(':');

        highScoreList[1] = highScore;
        $highScore.text(highScoreList.join(': '));
    }

    function displayError(colorSelected) {
        var audio = new Audio('./sounds/wrong.mp3');
        
        updateHighScore();
        $body.addClass('game-over');
        audio.play();
    }

    function startGame() {
        //resets initial values when restarting
        gamePattern = [];
        userInputCount = 0;
        userInputTotalCount = 0;
        gameEnded = true;
        
        highScore && updateHighScore(); //update high score if user restarts without getting an error
        continueGame(gamePattern);
        $startGame.text('Restart');
        $body.hasClass('game-over') && $body.removeClass('game-over');
    }

    $('.btn').click(function(event) {
        var colorSelected = event.currentTarget.classList[2];
        console.log('user selection: ', colorSelected);

        if(!gameEnded) {
            //if user tries to keep selecting when they've already reached an error
            displayError(colorSelected);
        } else {
            if(userInputTotalCount > 0 && gamePattern[userInputCount] === colorSelected && userInputCount < userInputTotalCount) {
                //check previous entries
                userInputCount++;

            } else if(userInputTotalCount === userInputCount && gamePattern[userInputTotalCount] === colorSelected) {
                userInputTotalCount++;

                if(userInputTotalCount === gamePattern.length) {
                    if(gamePattern.length > highScore) {
                        highScore = gamePattern.length;
                    }

                    setTimeout(() => {
                        continueGame(gamePattern);
                        userInputCount = 0; //reset to zero so user have to reenter
                    }, 300);
                }

            } else {
                displayError(colorSelected);
                gameEnded = false;
            }
        }
    });

    $('.start-game-button').click(function(event) {
        startGame();
    });
});