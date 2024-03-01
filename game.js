var userClickedPattern = [];

var gamePattern = [];

var buttonColors = ["red", "blue", "green", "yellow"];

var sounds = {
    green: new Audio("sounds/green.mp3"),
    red: new Audio("sounds/red.mp3"),
    yellow: new Audio("sounds/yellow.mp3"),
    blue: new Audio("sounds/blue.mp3")
};

var level = 0;

var started = false;

function fadeLoop() {
    if (!started) {
        $('h1').fadeOut(1000, function() {
            $(this).fadeIn(1000, fadeLoop);
        });
    }
}

fadeLoop();

$(document).ready(function() {
    var audioChange = $("#myAudio")[0];
    
    $("#toggleAudio").click(function() {
        // Check the current text of the div/button
        if ($(this).text() === "🔉") {
            audioChange.pause();
            $(this).text("🔇");
        } else if ($(this).text() === "🔇") {
            audioChange.play();
            $(this).text("🔉");
        }
    });
});

function nextSequence() {

    setTimeout(function() {
        var randomNumber = Math.floor(Math.random() * 4);
        var randomChosenColour = buttonColors[randomNumber];
        gamePattern.push(randomChosenColour);
        
        // Flash the chosen button
        flashButton(randomChosenColour);
        playSound(randomChosenColour);

        $("h1").text("Level " + level);

        level++;

    }, 300);
};

function flashButton(color) {
    var element = $("#" + color);
    element.fadeOut(100, function() {
        element.fadeIn(100);
    });
};

function playSound(name) {
    // Reset the audio playback to the start
    sounds[name].currentTime = 0;

    // Play the preloaded audio file
    sounds[name].play();
};

function buttonClickHandler(event) {
    var userChosenColour = event.target.id;
    userClickedPattern.push(userChosenColour);
    animatePress(userChosenColour);
    playSound(userChosenColour);

    var lastAnswerIndex = userClickedPattern.length - 1;
    
    checkAnswer(lastAnswerIndex);
};

function animatePress(currentColour) {
    $("#" + currentColour).addClass("pressed");

    setTimeout(function() {
        $("#" + currentColour).removeClass("pressed");
    }, 100);
};

function updateAndPlayGameAudio() {
    var audioElement = $("#myAudio")[0];
    audioElement.src = "sounds/8-bit-arcade-138828.mp3";  // Set the src of the audio element
    audioElement.load(); // Recognize the new source
    // Conditionally play audio based on button state
    if ($("#toggleAudio").text() === "🔉") {
        audioElement.play();
    }
};

function updateAndPlayIntroAudio() {
    var audioElement = $("#myAudio")[0];
    audioElement.src = "sounds/kim-lightyear-legends-109307.mp3";  // Set the src of the audio element
    audioElement.load(); // Recognize the new source
    // Conditionally play audio based on button state
    if ($("#toggleAudio").text() === "🔉") {
        audioElement.play();
    }
};

$(document).one("keydown", function(event) {
    nextSequence();
    // Attach the event handler using .on()
    $('div[type="button"]').on("click", buttonClickHandler);
    started = true;

    updateAndPlayGameAudio();

    // Remove the keydown event handler
    $(document).off("keydown");
});

var count = 0;

function checkAnswer(index) {

    if (userClickedPattern[index] !== gamePattern[index]) {
        $("h1").text("Game Over, Press Any Key to Restart");
        var wrongSound = new Audio("sounds/wrong.mp3");
        wrongSound.play();

        $("body").addClass("game-over");

        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 200);
        
        startOver();


        return;  // Exit the function early if the patterns don't match
    }

    count++;

    if (count === gamePattern.length) {
        setTimeout(function() {
            nextSequence();
        }, 1000);
        userClickedPattern = [];
        count = 0;
    }
}

function startOver() {
    level = 0;
    gamePattern = [];
    userClickedPattern = [];
    count = 0;
    started = false;

    $('div[type="button"]').off("click", buttonClickHandler);

    updateAndPlayIntroAudio();

    $(document).one("keydown", function(event) {
        setTimeout(function() {
            nextSequence();
        }, 100);
        $('div[type="button"]').on("click", buttonClickHandler);
        updateAndPlayGameAudio();
    });
};

$('div[type="button"]').on("click", function(e){
        if (started === false) {var notInGameChosenColor = e.target.id;
        animatePress(notInGameChosenColor);
        playSound(notInGameChosenColor);
    }
});
