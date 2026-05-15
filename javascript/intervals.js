let intervals = [];
let gamePaused = false;

function addInterval(fn, time) {
  let id = setInterval(() => {
    if (!gamePaused) fn(); 
  }, time);
  intervals.push(id);
  return id;
}

function clearAllIntervals() {
  intervals.forEach(id => clearInterval(id));
  intervals = [];
}
