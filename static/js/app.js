import { saveHistory } from './history.js';
import { SoundSettings } from './settings.js';
import { pauseTimer, resumeTimer, startTimer, stopTimer } from './timer.js';

// start pomodoro timer if /activity and duration is set in the url
const urlParams = new URLSearchParams(window.location.search);
const activity = urlParams.get('activity');
const duration = urlParams.get('duration');

const permission = Notification.requestPermission();

if (permission === 'granted') {
  console.log('permission granted');
} else if (permission === 'denied') {
  console.log('permission denied');
} else if (permission === 'default') {
  console.log('permission default');
}

const session = {
  activity: '',
  duration: 0,
  isControlsEnabled: false,
  timerState: '',
  date: '',

  stopSession: function () {
    this.isControlsEnabled = false;
    this.timerState = 'stopped';
  },
  completeSession: function () {
    this.isControlsEnabled = false;
    this.timerState = 'completed';
  },
};

const PAGES = {
  ACTIVITY: 'activityPage',
  TIMER: 'timerPage',
};

// set up the activity buttons - set activity
const activityBtns = document.querySelectorAll('.activity');

// control buttons
const startBtn = document.querySelector('#startBtn');
const pauseBtn = document.querySelector('#pauseBtn');
const stopBtn = document.querySelector('#stopBtn');
const resumeBtn = document.querySelector('#resumeBtn');

/*
  ========================================
  FUNCTIONS
  ========================================
*/
activityBtns.forEach((activity) => {
  activity.addEventListener('click', (event) => {
    const activityName = event.currentTarget.dataset.activity;
    session.activity = activityName;
    document.querySelector('#selectedActivity').textContent = session.activity;

    activityBtns.forEach((activity) => {
      activity.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
  });
});
// get the duration from the dropdown
function getDuration() {
  const duration = document.querySelector('#durationDropdown').value;
  return duration;
}

startBtn.addEventListener('click', () =>
  startPomodoro(session.activity, getDuration())
);

if (activity && duration) {
  console.log('activity and duration set');
  console.log(activity);
  console.log(duration);
  startPomodoro(activity, duration);
}

function startPomodoro(activity, duration) {
  session.activity = activity;
  session.duration = duration;
  if (session.activity === '') {
    alert('Please select an activity');
    return;
  }

  if (isNaN(session.duration)) {
    alert('Please select a duration');
    const duration = document.querySelector('#durationDropdown');
    duration.focus();
    throw new Error('Error code: rabbit - duration was not set');
  }

  // set up session
  session.isControlsEnabled = true;
  session.timerState = 'started';
  session.date = new Date().toLocaleString();
  enableTimerControls();

  // start the timer
  const timerDisplay = document.querySelector('#timer');

  startTimer(session.duration * 60, timerDisplay, onComplete);

  startBtn.style.display = 'none';

  changePage(PAGES.TIMER);
}

function onComplete() {
  const sound = new SoundSettings();
  if (sound.isSoundEnabled()) {
    sound.playNotificationSound();
  }
  stopTimer();
  session.completeSession();
  // notify the user

  const notification = new Notification('Timer Complete', {
    body: `Your ${session.activity} session is complete`,
    icon: './static/images/tomato.png',
  });

  notification.onclick = (event) => {
    window.focus();
    notification.close();
  };

  notification.onclose = (event) => {
    console.log('closed');
  };

  notification.onerror = (event) => {
    console.log('error');
  };

  notification.onshow = (event) => {
    console.log('show');
  };

  saveHistory({
    activity: session.activity,
    duration: session.duration,
    timerState: session.timerState,
    date: session.date,
  });
  resetUI();
  clearParams();
}

// set up the pause button
pauseBtn.addEventListener('click', (event) => {
  pauseTimer();
  session.timerState = 'paused';
  pauseBtn.style.display = 'none';
  resumeBtn.style.display = 'block';
});

// set up the stop button
stopBtn.addEventListener('click', (event) => {
  stopTimer();
  session.stopSession();
  saveHistory({
    activity: session.activity,
    duration: session.duration,
    timerState: session.timerState,
    date: session.date,
  });
  changePage(PAGES.ACTIVITY);
  resetUI();
  clearParams();
});

// set up the resume button
resumeBtn.style.display = 'none';
resumeBtn.addEventListener('click', (event) => {
  const timerDisplay = document.querySelector('#timer');
  resumeTimer(timerDisplay);
  session.timerState = 'resumed';
  resumeBtn.style.display = 'none';
  pauseBtn.style.display = 'block';
});

// disable timer control buttons if timer is not active
if (!session.isControlsEnabled) {
  disableTimerControls();
}

// enable timer control buttons if timer is active
if (session.isControlsEnabled) {
  enableTimerControls();
}

function enableTimerControls() {
  document
    .querySelectorAll('[data-component="timer-control"]')
    .forEach((button) => {
      button.disabled = false;
    });
}

function disableTimerControls() {
  document
    .querySelectorAll('[data-component="timer-control"]')
    .forEach((button) => {
      button.disabled = true;
    });

  const timerDisplay = document.querySelector('#timer');
  timerDisplay.textContent = '00:00';

  const startBtn = document.querySelector('#startBtn');
  startBtn.style.display = 'block';

  const pauseBtn = document.querySelector('#pauseBtn');
  pauseBtn.style.display = 'block';

  const resumeBtn = document.querySelector('#resumeBtn');
  resumeBtn.style.display = 'none';
}

function resetUI() {
  disableTimerControls();
  changePage(PAGES.ACTIVITY);

  activityBtns.forEach((activity) => {
    activity.classList.remove('active');
  });
}

function changePage(page) {
  console.log(page);
  const pages = document.querySelectorAll('.page');
  pages.forEach((page) => {
    page.classList.remove('active');
  });
  document.querySelector(`#${page}`).classList.add('active');
}

function clearParams() {
  const url = new URL(window.location.href);
  url.searchParams.delete('activity');
  url.searchParams.delete('duration');
  console.log(url);

  // set window to new url
  window.history.pushState({}, '', url);
}
