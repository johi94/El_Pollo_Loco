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
