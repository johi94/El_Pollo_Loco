/** @type {number} Timeout ID for the fullscreen hint display delay */
let fullscreenHintTimeout;

/**
 * Requests fullscreen mode for the canvas container element.
 * Uses vendor-prefixed methods for cross-browser compatibility.
 */
function enterFullscreen() {
  const canvas = document.getElementById('canvas-container');
  if (canvas.requestFullscreen) {
    canvas.requestFullscreen();
  } else if (canvas.webkitRequestFullscreen) { // Safari
    canvas.webkitRequestFullscreen();
  } else if (canvas.msRequestFullscreen) {     // IE/Edge
    canvas.msRequestFullscreen();
  }
}

/**
 * Exits fullscreen mode.
 * Uses vendor-prefixed methods for cross-browser compatibility.
 */
function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

/**
 * Toggles fullscreen mode on or off depending on the current state.
 */
function fullscreen() {
  document.activeElement.blur();
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

/**
 * Listens for fullscreen state changes.
 * On non-touch devices, shows a hint to the user after 5 seconds in fullscreen mode,
 * then hides it again after 2 seconds.
 * Clears the timeout if the user exits fullscreen before the hint appears.
 * Has no effect on touch devices.
 */
document.addEventListener("fullscreenchange", () => {
  const hint = document.getElementById('fullscreenHint');
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (isTouchDevice) return;
  if (document.fullscreenElement) {
    fullscreenHintTimeout = setTimeout(() => {
      hint.style.display = 'block';
      setTimeout(() => {
        hint.style.display = 'none';
      }, 2000);
    }, 5000);
  } else {
    clearTimeout(fullscreenHintTimeout);
  }
});

/**
 * Automatically enters fullscreen when the device is rotated to landscape
 * on touch devices with a screen width of 1180px or less.
 */
window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    const isLandscape = window.innerWidth > window.innerHeight;
    const isTouchDevice = window.innerWidth <= 1180;
    if (isLandscape && isTouchDevice && !document.fullscreenElement) {
      enterFullscreen();
    }
  }, 300);
});