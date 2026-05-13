const backgroundMusic = new Audio("audio/El Gallo Bravo.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

function playBackgroundMusic() {
  backgroundMusic.play();
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function toggleMusic() {
  if (backgroundMusic.paused) {
    backgroundMusic.play();
  } else {
    backgroundMusic.pause();
  }
}
