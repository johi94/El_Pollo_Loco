let fullscreenHintTimeout;

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

function exitFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
}

function fullscreen() {
  document.activeElement.blur();
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

// fullscreen hint
document.addEventListener("fullscreenchange", () => {
  const hint = document.getElementById('fullscreenHint');
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