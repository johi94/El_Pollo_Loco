/**
 * @description Mixin that adds all sound related methods to the World class.
 */
Object.assign(World.prototype, {

  /**
   * @description Plays the character death sound once.
   */
  playDeadSound() {
    if (!this.deadSoundPlayed) {
      this.deadSoundPlayed = true;
      this.soundDead.muted = soundEffectsMuted;
      this.soundDead.play();
    }
  },

  /**
   * @description Plays the character hurt sound.
   */
  playHurtSound() {
    this.soundHurt.currentTime = 0;
    this.soundHurt.muted = soundEffectsMuted;
    this.soundHurt.play();
  },

  /**
   * @description Pauses a sound and resets its playback position.
   * @param {Audio} sound - The audio object to stop
   */
  stopSound(sound) {
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
    }
  },

  /**
   * @description Stops all sounds in the game world.
   */
  stopAllSounds() {
    this.stopEnemySounds();
    this.stopCharacterSounds();
    this.stopWorldSounds();
    this.stopThrowableSounds();
  },

  /**
   * @description Stops all sounds associated with enemies.
   */
  stopEnemySounds() {
    this.level.enemies.forEach((enemy) => {
      this.stopSound(enemy.sound);
      this.stopSound(enemy.soundDead);
      this.stopSound(enemy.soundRoar);
      this.stopSound(enemy.soundAlert);
      this.stopSound(enemy.soundWalk);
      this.stopSound(enemy.attackSound);
      this.stopSound(enemy.soundHurt);
    });
  },

  /**
   * @description Stops all sounds associated with the player character.
   */
  stopCharacterSounds() {
    this.stopSound(this.character.soundJump);
    this.stopSound(this.character.soundWalk);
    this.stopSound(this.character.soundIdle);
    this.stopSound(this.character.soundLongIdle);
  },

  /**
   * @description Stops all sounds owned directly by the world.
   */
  stopWorldSounds() {
    this.stopSound(this.soundHurt);
    this.stopSound(this.soundDead);
    this.stopSound(this.soundBottleThrow);
  },

  /**
   * @description Stops all sounds from currently active throwable objects.
   */
  stopThrowableSounds() {
    this.throwableObjects.forEach((bottle) => {
      this.stopSound(bottle.soundSplash);
    });
  },
});