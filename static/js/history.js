//  we will store the history of activities in local storage

// 1. we will create a function to save the history in local storage

export function saveHistory(history) {
    // get the history from local storage first

    const existingHistory = getHistory();
    console.log(existingHistory);
    if (existingHistory === null) {
        localStorage.setItem('history', JSON.stringify([history]));
        return;
    }
    const updatedHistory = [...existingHistory, history];
    localStorage.setItem('history', JSON.stringify(updatedHistory));
}

// 2. we will create a function to get the history from local storage

export function getHistory() {
    return JSON.parse(localStorage.getItem('history'));
}

// 3. we will create a function to add the history to the history page

export function addHistoryToPage(history) {
    const historyList = document.querySelector('#historyList');

    if (historyList === null) return;
    historyList.innerHTML = '';

    history.forEach((historyItem) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="history-item">
                <div class="history-item__activity">${historyItem.activity}</div>
                <div class="history-item__time">${historyItem.duration}</div>
                <div class="history-item__date">${historyItem.date}</div>
                <div class="history-item__time">${historyItem.timerState}</div>

            </div>
        `;
        historyList.appendChild(li);
    });
}

addHistoryToPage(getHistory());
