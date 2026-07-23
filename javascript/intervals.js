/** @type {number[]} Array of all active interval IDs for global cleanup */
let intervals = [];

/** @type {boolean} Whether the game is currently paused */
let gamePaused = false;

/**
 * Creates a managed interval that respects the global pause state.
 * The function is only executed when the game is not paused.
 * The interval ID is stored for later cleanup via clearAllIntervals.
 * @param {Function} fn - The function to execute on each interval
 * @param {number} time - The interval duration in milliseconds
 * @returns {number} The interval ID
 */
function addInterval(fn, time) {
  let id = setInterval(() => {
    if (!gamePaused) fn(); 
  }, time);
  intervals.push(id);
  return id;
}

/**
 * Clears all active intervals and resets the intervals array.
 */
function clearAllIntervals() {
  intervals.forEach(id => clearInterval(id));
  intervals = [];
}

/**
 * Accumulates elapsed time in state[name] and invokes callback once for
 * every full `ms` interval that has passed, carrying over any remainder.
 * Used to drive fixed-step animation/movement ticks from a single
 * requestAnimationFrame loop instead of many independent setIntervals.
 * @param {Object.<string, number>} state - Object holding accumulated time per timer name
 * @param {string} name - The timer's key within state
 * @param {number} ms - The interval duration in milliseconds
 * @param {number} dt - The elapsed time since the last frame in milliseconds
 * @param {Function} callback - The function to invoke for each elapsed interval
 */
function tickTimer(state, name, ms, dt, callback) {
  state[name] = (state[name] || 0) + dt;
  while (state[name] >= ms) {
    state[name] -= ms;
    callback();
  }
}
