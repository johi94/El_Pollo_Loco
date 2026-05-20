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
  const btn = document.getElementById("muteMusicBtn");
  btn.classList.toggle("muted");
  if (backgroundMusic.paused) {
    backgroundMusic.play();
    localStorage.setItem("musicMuted", "false");
  } else {
    backgroundMusic.pause();
    localStorage.setItem("musicMuted", "true");
  }
}

// #end-region background-music

// #start-region sound-effects

function toggleSoundEffects() {
  document.activeElement.blur();
  if (gamePaused) return;
  document.getElementById("muteSndBtn").classList.toggle("muted");
  soundEffectsMuted = !soundEffectsMuted;
  localStorage.setItem("soundEffectsMuted", soundEffectsMuted);
  if (world) applyMuteToWorld();
}

function applyMuteToWorld() {
  muteEnemySounds();
  muteCharacterSounds();
  muteWorldSounds();
}

function muteEnemySounds() {
  world.level.enemies.forEach((enemy) => {
    if (enemy.sound) enemy.sound.muted = soundEffectsMuted;
    if (enemy.soundWalk) enemy.soundWalk.muted = soundEffectsMuted;
    if (enemy.attackSound) enemy.attackSound.muted = soundEffectsMuted;
    if (enemy.soundHurt) enemy.soundHurt.muted = soundEffectsMuted;
    if (enemy.soundDead) enemy.soundDead.muted = soundEffectsMuted;
  });
}

function muteCharacterSounds() {
  world.character.soundIdle.muted = soundEffectsMuted;
  world.character.soundLongIdle.muted = soundEffectsMuted;
  world.character.soundWalk.muted = soundEffectsMuted;
  world.character.soundJump.muted = soundEffectsMuted;
}

function muteWorldSounds() {
  world.soundHurt.muted = soundEffectsMuted;
  world.soundDead.muted = soundEffectsMuted;
  world.soundBottleCollect.muted = soundEffectsMuted;
  world.soundCoinCollect.muted = soundEffectsMuted;
  world.soundBottleThrow.muted = soundEffectsMuted;
}

function playGameSound(sound) {
  sound.muted = soundEffectsMuted;
  sound.play();
}

function playGameOverSound() {
  playGameSound(soundGameOver);
}

function playGameWonSound() {
  playGameSound(soundGameWon);
}
// #end-region sound-effects

// #start-region load from LocalStorage

function loadSoundSettings() {
  loadMusicSetting();
  loadSoundEffectsSetting();
}

function loadMusicSetting() {
  const musicMuted = localStorage.getItem("musicMuted") === "true";
  if (musicMuted) {
    document.getElementById("muteMusicBtn").classList.add("muted");
    backgroundMusic.muted = true;
  }
}

function loadSoundEffectsSetting() {
  soundEffectsMuted = localStorage.getItem("soundEffectsMuted") === "true";
  if (soundEffectsMuted) {
    document.getElementById("muteSndBtn").classList.add("muted");
  }
}

// #end-region load from LocalStorage
