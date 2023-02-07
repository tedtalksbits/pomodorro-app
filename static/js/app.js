import { saveHistory } from './history.js';
import { pauseTimer, resumeTimer, startTimer, stopTimer } from './timer.js';

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
activityBtns.forEach((activity) => {
    activity.addEventListener('click', (event) => {
        const activityName = event.currentTarget.dataset.activity;
        session.activity = activityName;
        document.querySelector('#selectedActivity').textContent = activityName;

        activityBtns.forEach((activity) => {
            activity.classList.remove('active');
        });
        event.currentTarget.classList.add('active');
    });
});

// get the duration
function getDuration() {
    const duration = document.querySelector('#durationDropdown').value;
    return duration;
}

// set up the start button
const startBtn = document.querySelector('#startBtn');
startBtn.addEventListener('click', (event) => {
    // validation
    if (session.activity === '') {
        alert('Please select an activity');
        return;
    }

    if (isNaN(getDuration())) {
        alert('Please select a duration');
        const duration = document.querySelector('#durationDropdown');
        duration.focus();
        throw new Error('Error code: rabbit - duration was not set');
    }

    // get the duration
    session.duration = getDuration();
    session.isControlsEnabled = true;
    session.timerState = 'started';
    session.date = new Date().toLocaleString();
    enableTimerControls();

    // start the timer
    const timerDisplay = document.querySelector('#timer');

    function onComplete() {
        const audio = new Audio('/static/sounds/notification.wav');
        audio.play();
        stopTimer();
        session.completeSession();
        saveHistory({
            activity: session.activity,
            duration: session.duration,
            timerState: session.timerState,
            date: session.date,
        });
        resetUI();
    }

    startTimer(session.duration * 60, timerDisplay, onComplete);

    startBtn.style.display = 'none';

    changePage(PAGES.TIMER);
});

// set up the pause button
const pauseBtn = document.querySelector('#pauseBtn');
pauseBtn.addEventListener('click', (event) => {
    pauseTimer();
    session.timerState = 'paused';
    pauseBtn.style.display = 'none';
    resumeBtn.style.display = 'block';
});

// set up the stop button
const stopBtn = document.querySelector('#stopBtn');
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
});

// set up the resume button
const resumeBtn = document.querySelector('#resumeBtn');
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
