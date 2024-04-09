let userClickedPattern = [];

let gamePattern = [];

const buttonColors = ["red", "blue", "green", "yellow"];

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function unlockAudioContext() {
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

["touchstart", "click"].forEach((event) => {
  document.body.addEventListener(event, unlockAudioContext, false);
});

const soundUrls = {
  green: "sounds/green.mp3",
  red: "sounds/red.mp3",
  yellow: "sounds/yellow.mp3",
  blue: "sounds/blue.mp3",
};

const sounds = {};

// Function to load a sound file
function loadSound(name, url) {
  const request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  // Decode asynchronously
  request.onload = function () {
    audioContext.decodeAudioData(
      request.response,
      function (buffer) {
        sounds[name] = buffer;
      },
      function (error) {
        console.error("Failed to load sound:", error);
      }
    );
  };
  request.send();
}

Object.keys(soundUrls).forEach((name) => {
  loadSound(name, soundUrls[name]);
});

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
    playSound(randomChosenColour);
    flashButton(randomChosenColour);

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
  sounds[name].currentTime = 0;
  let source = audioContext.createBufferSource();
  source.buffer = sounds[name];
  source.connect(audioContext.destination);
  source.start(0);
}

function buttonClickHandler(event) {
  let userChosenColour = event.target.id;
  userClickedPattern.push(userChosenColour);
  playSound(userChosenColour);
  animatePress(userChosenColour);

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

$(document).on("keydown", function (event) {
  if (event.key === "Enter" || event.keyCode === 13) {
    // Remove the keydown event handler
    $(document).off("keydown");

    $("#startGame").addClass("hide-element");

    nextSequence();
    // Attach the event handler using .on()
    $('div[type="button"]').on("click", buttonClickHandler);
    gameStarted = true;

    updateAndPlayAudio();
  }
});

$("#startGame").on("click", function () {
  // Remove the keydown event handler (if it was previously added)
  $(document).off("keydown");

  nextSequence();

  $("#startGame").addClass("hide-element");

  // Attach the button click handler
  $('div[type="button"]').on("click", buttonClickHandler);

  gameStarted = true;

  updateAndPlayAudio();
});

let count = 0;

function checkAnswer(index) {
  if (userClickedPattern[index] !== gamePattern[index]) {
    $("h1").text(
      "Game Over, You've reached level " +
        (level - 1) +
        "! Press Enter to Restart"
    );
    wrongSound.play();

    $("body").addClass("game-over");

    $("#startGame").removeClass("hide-element");

    setTimeout(function () {
      $("body").removeClass("game-over");
    }, 200);

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

  $(document).on("keydown", function (event) {
    if (event.key === "Enter" || event.keyCode === 13) {
      $(document).off("keydown");

      $("#startGame").addClass("hide-element");

      setTimeout(function () {
        nextSequence();
      }, 100);
      $('div[type="button"]').on("click", buttonClickHandler);
      gameStarted = true;
      updateAndPlayAudio();
    }
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
