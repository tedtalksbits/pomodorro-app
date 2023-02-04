import { pauseTimer, resumeTimer, startTimer, stopTimer } from './timer.js';

const session = {
    activity: '',
    duration: 0,
    isControlsEnabled: false,
    timerState: '',
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
    enableTimerControls();

    // start the timer
    const timerDisplay = document.querySelector('#timer');

    function onComplete() {
        // play a sound
        const audio = new Audio('/static/sounds/notification.wav');

        audio.play();

        stopTimer();
        session.activity = '';
        session.duration = 0;
        session.isControlsEnabled = false;
        session.timerState = 'stopped';

        disableTimerControls();

        timerDisplay.textContent = '00:00';

        startBtn.style.display = 'block';
        pauseBtn.style.display = 'block';
        resumeBtn.style.display = 'none';

        const timerPage = document.querySelector('#timerPage');

        const activityPage = document.querySelector('#activityPage');
        timerPage.classList.remove('active');
        activityPage.classList.add('active');
    }
    startTimer(session.duration * 60, timerDisplay, onComplete);

    // hide the start button
    startBtn.style.display = 'none';

    const timerPage = document.querySelector('#timerPage');
    const activityPage = document.querySelector('#activityPage');

    timerPage.classList.add('active');
    activityPage.classList.remove('active');
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

    session.activity = '';
    session.duration = 0;
    session.isControlsEnabled = false;
    session.timerState = 'stopped';

    disableTimerControls();

    const timerDisplay = document.querySelector('#timer');
    timerDisplay.textContent = '00:00';

    startBtn.style.display = 'block';
    pauseBtn.style.display = 'block';
    resumeBtn.style.display = 'none';

    const timerPage = document.querySelector('#timerPage');
    const activityPage = document.querySelector('#activityPage');
    timerPage.classList.remove('active');
    activityPage.classList.add('active');
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
}
