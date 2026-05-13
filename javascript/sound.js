const backgroundMusic = new Audio("audio/El Gallo Bravo.mp3");
let soundEffectsMuted = false;

// #start-region background-music
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
  document.activeElement.blur();
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    document.getElementById("muteMusicBtn").textContent = "🎶";
  } else {
    backgroundMusic.pause();
    document.getElementById("muteMusicBtn").textContent = "🔕";
  }
}
// #end-region background-music

// #start-region sound-effects
function toggleSoundEffects() {
  document.activeElement.blur();
  soundEffectsMuted = !soundEffectsMuted;
  if (soundEffectsMuted) {
    document.getElementById("muteSndBtn").textContent = "🔇";
  } else {
    document.getElementById("muteSndBtn").textContent = "🔊";
  }
  if (world) {
    world.level.enemies.forEach((enemy) => {
      if (enemy.sound) {
        enemy.sound.muted = soundEffectsMuted;
      }
    });
  }
}
// #end-region sound-effects
