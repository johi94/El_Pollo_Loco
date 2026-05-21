/** @type {Audio} Background music that loops throughout the game */
const backgroundMusic = new Audio("audio/El Gallo Bravo.mp3");

/** @type {Audio} Sound played when the game is over */
const soundGameOver = new Audio("audio/game_over_bell.mp3");

/** @type {Audio} Sound played when the player wins */
const soundGameWon = new Audio("audio/you_win.mp3");

/** @type {boolean} Whether all sound effects are currently muted */
let soundEffectsMuted = false;

// #start-region background-music

backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;

/**
 * Plays the background music if it has not been muted by the user.
 * Reads the mute state from localStorage.
 */
function playBackgroundMusic() {
  const musicMuted = localStorage.getItem("musicMuted") === "true";
  if (!musicMuted) {
    backgroundMusic.play();
  }
}

/**
 * Stops the background music and resets its playback position.
 */
function stopBackgroundMusic() {
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;
}

/**
 * Toggles the background music on or off and saves the state to localStorage.
 * Has no effect while the game is paused.
 */
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

/**
 * Toggles all sound effects on or off and saves the state to localStorage.
 * Applies the mute state to all active world sounds if a world exists.
 * Has no effect while the game is paused.
 */
function toggleSoundEffects() {
  document.activeElement.blur();
  if (gamePaused) return;
  document.getElementById("muteSndBtn").classList.toggle("muted");
  soundEffectsMuted = !soundEffectsMuted;
  localStorage.setItem("soundEffectsMuted", soundEffectsMuted);
  if (world) applyMuteToWorld();
}

/**
 * Applies the current mute state to all sounds in the game world.
 */
function applyMuteToWorld() {
  muteEnemySounds();
  muteCharacterSounds();
  muteWorldSounds();
}

/**
 * Applies the current mute state to all enemy sounds.
 */
function muteEnemySounds() {
  world.level.enemies.forEach((enemy) => {
    if (enemy.sound) enemy.sound.muted = soundEffectsMuted;
    if (enemy.soundWalk) enemy.soundWalk.muted = soundEffectsMuted;
    if (enemy.attackSound) enemy.attackSound.muted = soundEffectsMuted;
    if (enemy.soundHurt) enemy.soundHurt.muted = soundEffectsMuted;
    if (enemy.soundDead) enemy.soundDead.muted = soundEffectsMuted;
  });
}

/**
 * Applies the current mute state to all character sounds.
 */
function muteCharacterSounds() {
  world.character.soundIdle.muted = soundEffectsMuted;
  world.character.soundLongIdle.muted = soundEffectsMuted;
  world.character.soundWalk.muted = soundEffectsMuted;
  world.character.soundJump.muted = soundEffectsMuted;
}

/**
 * Applies the current mute state to all world sounds.
 */
function muteWorldSounds() {
  world.soundHurt.muted = soundEffectsMuted;
  world.soundDead.muted = soundEffectsMuted;
  world.soundBottleCollect.muted = soundEffectsMuted;
  world.soundCoinCollect.muted = soundEffectsMuted;
  world.soundBottleThrow.muted = soundEffectsMuted;
}

/**
 * Plays a sound with the current mute state applied.
 * @param {Audio} sound - The audio object to play
 */
function playGameSound(sound) {
  sound.muted = soundEffectsMuted;
  sound.play();
}

/**
 * Plays the game over sound effect.
 */
function playGameOverSound() {
  playGameSound(soundGameOver);
}

/**
 * Plays the game won sound effect.
 */
function playGameWonSound() {
  playGameSound(soundGameWon);
}

// #end-region sound-effects

// #start-region load from LocalStorage

/**
 * Loads all sound settings from localStorage and applies them on startup.
 */
function loadSoundSettings() {
  loadMusicSetting();
  loadSoundEffectsSetting();
}

/**
 * Loads the music mute state from localStorage and applies it to the button and audio object.
 */
function loadMusicSetting() {
  const musicMuted = localStorage.getItem("musicMuted") === "true";
  if (musicMuted) {
    document.getElementById("muteMusicBtn").classList.add("muted");
    backgroundMusic.muted = true;
  }
}

/**
 * Loads the sound effects mute state from localStorage and applies it to the button.
 */
function loadSoundEffectsSetting() {
  soundEffectsMuted = localStorage.getItem("soundEffectsMuted") === "true";
  if (soundEffectsMuted) {
    document.getElementById("muteSndBtn").classList.add("muted");
  }
}
// #end-region load from LocalStorage
