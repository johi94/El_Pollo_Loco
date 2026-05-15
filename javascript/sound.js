const backgroundMusic = new Audio("audio/El Gallo Bravo.mp3");
const soundGameOver = new Audio("audio/game_over_bell.mp3");
const soundGameWon = new Audio("audio/you_win.mp3");
let soundEffectsMuted = false;

// #start-region background-music
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

function playBackgroundMusic() {
  const musicMuted = localStorage.getItem("musicMuted") === "true";
  if (!musicMuted) {
  backgroundMusic.play();
  }
}

function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

function toggleMusic() {
  document.activeElement.blur();
  if (gamePaused) return;
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    document.getElementById("muteMusicBtn").textContent = "🎶";
    localStorage.setItem("musicMuted", "false");
  } else {
    backgroundMusic.pause();
    document.getElementById("muteMusicBtn").textContent = "🔕";
    localStorage.setItem("musicMuted", "true");
  }
}
// #end-region background-music

// #start-region sound-effects
function toggleSoundEffects() {
  document.activeElement.blur();
  if (gamePaused) return;
  soundEffectsMuted = !soundEffectsMuted;
  localStorage.setItem("soundEffectsMuted", soundEffectsMuted);
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
     world.character.soundIdle.muted = soundEffectsMuted;
    world.character.soundLongIdle.muted = soundEffectsMuted;
    world.character.soundWalk.muted = soundEffectsMuted;
    world.character.soundJump.muted = soundEffectsMuted;
    world.soundHurt.muted = soundEffectsMuted;
    world.soundDead.muted = soundEffectsMuted;
    world.soundBottleCollect.muted = soundEffectsMuted;
    world.soundCoinCollect.muted = soundEffectsMuted;
    world.soundBottleThrow.muted = soundEffectsMuted;
  }
}

function playGameOverSound() {
  soundGameOver.muted = soundEffectsMuted;
  soundGameOver.play();
}

function playGameWonSound() {
  soundGameWon.muted = soundEffectsMuted;
  soundGameWon.play();
}
// #end-region sound-effects

// #start-region load from LocalStorage

function loadSoundSettings() {
  // music
  const musicMuted = localStorage.getItem("musicMuted") === "true";
  if (musicMuted) {
    backgroundMusic.pause();
    document.getElementById("muteMusicBtn").textContent = "🔕";
  } else {
    document.getElementById("muteMusicBtn").textContent = "🎶";
  }
  // soundeffects
  const savedSoundMuted = localStorage.getItem("soundEffectsMuted") === "true";
  soundEffectsMuted = savedSoundMuted;
  if (soundEffectsMuted) {
    document.getElementById("muteSndBtn").textContent = "🔇";
  } else {
    document.getElementById("muteSndBtn").textContent = "🔊";
  }
}

// #end-region load from LocalStorage