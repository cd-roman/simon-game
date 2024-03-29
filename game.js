let userClickedPattern = [];

let gamePattern = [];

const buttonColors = ["red", "blue", "green", "yellow"];

const sounds = {
  green: new Audio("sounds/green.mp3"),
  red: new Audio("sounds/red.mp3"),
  yellow: new Audio("sounds/yellow.mp3"),
  blue: new Audio("sounds/blue.mp3"),
};

const wrongSound = new Audio("sounds/wrong.mp3");

let level = 0;

let gameStarted = false;

function fadeLoop() {
  if (!gameStarted) {
    $("h1").fadeOut(1000, function () {
      $(this).fadeIn(1000, fadeLoop);
    });
  }
}

fadeLoop();

$(document).ready(function () {
  const audioChange = $("#myAudio")[0];

  $("#toggleAudio").click(function () {
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
  setTimeout(function () {
    let randomNumber = Math.floor(Math.random() * 4);
    let randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);

    // Flash the chosen button
    flashButton(randomChosenColour);
    playSound(randomChosenColour);

    $("h1").text("Level " + level);

    level++;
  }, 300);
}

function flashButton(color) {
  let element = $("#" + color);
  element.fadeOut(100, function () {
    element.fadeIn(100);
  });
}

function playSound(name) {
  // Reset the audio playback to the start
  sounds[name].currentTime = 0;

  // Play the preloaded audio file
  sounds[name].play();
}

function buttonClickHandler(event) {
  let userChosenColour = event.target.id;
  userClickedPattern.push(userChosenColour);
  animatePress(userChosenColour);
  playSound(userChosenColour);

  let lastAnswerIndex = userClickedPattern.length - 1;

  checkAnswer(lastAnswerIndex);
}

function animatePress(currentColour) {
  $("#" + currentColour).addClass("pressed");

  setTimeout(function () {
    $("#" + currentColour).removeClass("pressed");
  }, 100);
}

function updateAndPlayAudio() {
  let audioElement = $("#myAudio")[0];
  // Set the src of the audio element based on the 'gameStarted' variable
  audioElement.src = gameStarted
    ? "sounds/8-bit-arcade-138828.mp3"
    : "sounds/kim-lightyear-legends-109307.mp3";
  audioElement.load(); // Recognize the new source
  // Conditionally play audio based on button state
  if ($("#toggleAudio").text() === "🔉") {
    audioElement.play();
  }
  // Add event listener for 'ended' event to play the audio again from the beginning
  audioElement.addEventListener("ended", function () {
    audioElement.currentTime = 0;
    audioElement.play();
  });
}

$(document).one("keydown", function (event) {
  nextSequence();
  // Attach the event handler using .on()
  $('div[type="button"]').on("click", buttonClickHandler);
  gameStarted = true;

  updateAndPlayAudio();

  // Remove the keydown event handler
  $(document).off("keydown");
});

let count = 0;

function checkAnswer(index) {
  if (userClickedPattern[index] !== gamePattern[index]) {
    $("h1").text("Game Over, Press Any Key to Restart");
    wrongSound.play();

    $("body").addClass("game-over");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

    alert("Congrats! You have reached level " + (level - 1));

    startOver();

    return; // Exit the function early if the patterns don't match
  }

  count++;

  if (count === gamePattern.length) {
    setTimeout(function () {
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
  gameStarted = false;

  $('div[type="button"]').off("click", buttonClickHandler);

  updateAndPlayAudio();

  $(document).one("keydown", function (event) {
    setTimeout(function () {
      nextSequence();
    }, 100);
    $('div[type="button"]').on("click", buttonClickHandler);
    gameStarted = true;
    updateAndPlayAudio();
  });
}

$('div[type="button"]').on("click", function (e) {
  if (gameStarted === false) {
    let notInGameChosenColor = e.target.id;
    animatePress(notInGameChosenColor);
    playSound(notInGameChosenColor);
  }
});

document.getElementById("showRules").addEventListener("click", function () {
  document.getElementById("rulesOverlay").style.display = "block";
});

document.getElementById("closeRules").addEventListener("click", function () {
  document.getElementById("rulesOverlay").style.display = "none";
});
