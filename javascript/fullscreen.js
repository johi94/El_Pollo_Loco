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
  if (!document.fullscreenElement) {
    enterFullscreen();
  } else {
    exitFullscreen();
  }
}

// fullscreen hint
function fullscreen() {
  document.activeElement.blur();
  if (!document.fullscreenElement) {
    enterFullscreen();
    setTimeout(() => {
      document.getElementById('fullscreenHint').style.display = 'block'; 
      setTimeout(() => {
        document.getElementById('fullscreenHint').style.display = 'none'; 
      }, 5000);
    }, 5000); 
  } else {
    exitFullscreen();
    document.getElementById('fullscreenHint').style.display = 'none';
  }
}