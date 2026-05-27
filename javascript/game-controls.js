// #start-region mobile-controls

/**
 * Shows the mobile controls and enters fullscreen if the device supports touch input,
 * regardless of screen width.
 */
function showMobileControls() {
  const isTouchDevice = navigator.maxTouchPoints > 0;
  if (isTouchDevice) {
    setDisplay("mobileControls", "flex");
  }
}

/**
 * Initializes all mobile control buttons by hiding the controls
 * and binding touch events to keyboard inputs.
 */
function initMobileControls() {
  setDisplay("mobileControls", "none");
  bindMobileButton("btnLeft", "LEFT");
  bindMobileButton("btnRight", "RIGHT");
  bindMobileButton("btnJump", "SPACE");
  bindMobileButton("btnThrow", "D");
}

/**
 * Binds touch events to a mobile button to simulate keyboard input.
 * @param {string} id - The ID of the mobile button element
 * @param {string} key - The keyboard key to simulate (e.g. 'LEFT', 'SPACE')
 */
function bindMobileButton(id, key) {
  document.getElementById(id).addEventListener("touchstart", (e) => {
    e.preventDefault();
    if (!gamePaused) keyboard[key] = true;
  });
  document.getElementById(id).addEventListener("touchend", () => {
    keyboard[key] = false;
  });
}

// #end-region mobile-controls