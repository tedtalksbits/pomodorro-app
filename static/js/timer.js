let timer, minutes, seconds;
let interval = null;

export function startTimer(duration, display, onComplete) {
  timer = duration;
  interval = setInterval(function () {
    minutes = parseInt(timer / 60);
    seconds = parseInt(timer % 60);

    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    if (timer == 0) {
      clearInterval(interval);
      if (onComplete) {
        onComplete();
      }
    }
    display.textContent = minutes + ':' + seconds;
    timer--;
  }, 1000);
}

export function pauseTimer() {
  clearInterval(interval);
  interval = null;
}

export function stopTimer() {
  clearInterval(interval);
  timer = 0;
}

export function resumeTimer(display) {
  startTimer(timer, display);
}
