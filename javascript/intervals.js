let intervals = [];

function addInterval(fn, time) {
  let id = setInterval(fn, time);
  intervals.push(id);
  return id;
}

function clearAllIntervals() {
  intervals.forEach(id => clearInterval(id));
  intervals = [];
}
