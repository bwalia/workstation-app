const db = require('electron-db');
const Store = require('electron-store');
const store = new Store();

document.getElementById('startButton').addEventListener('click', () => {
    let startTime;
    let isPreviousRecord = false;
    let loggedUser = store.get("loggedUser");
    loggedUser = JSON.parse(loggedUser);
    const trackerMemo = document.getElementById("trackerMemo").value;
    if (!trackerMemo) return alert("Please insert the memo before starting the counter.");
    startTime = new Date().getTime();
    if (db.valid('progress')) {
        db.getRows('progress', {
            user_uuid: loggedUser.uuid,
            user_email: loggedUser.email,
            memo: trackerMemo,
        }, (succ, result) => {
            console.log({ result, length: Object.keys(result) });
            if (succ && Object.keys(result).length) {
                startTime = result[0].time;
                isPreviousRecord = true;
            }
        })
    }
    timerInterval = setInterval(updateTimer, 1000);
    document.getElementById("startButton").classList.add("d-none")
    document.getElementById("stopButton").classList.remove("d-none")
});

document.getElementById('stopButton').addEventListener('click', () => {
    let loggedUser = store.get("loggedUser");
    loggedUser = JSON.parse(loggedUser);
    const trackerMemo = document.getElementById("trackerMemo").value;
    console.log({ startTime });
    let progress = new Object();
    progress.user_uuid = loggedUser.uuid;
    progress.user_email = loggedUser.email;
    progress.memo = trackerMemo;
    progress.time = startTime;
    if (db.valid('progress')) {
        db.insertTableContent('progress', progress, (succ, msg) => {
            // succ - boolean, tells if the call is successful
            console.log("Success: " + succ);
            console.log("Message: " + msg);
        });
        db.getAll('progress', (succ, data) => {
            // succ - boolean, tells if the call is successful
            // data - array of objects that represents the rows.
            console.log({ data });
        })
        // db.getRows('progress', {
        //     memo: trackerMemo,
        // }, (succ, result) => {
        //     // succ - boolean, tells if the call is successful
        //     console.log("Success: " + succ);
        //     console.log(result);
        // })
    }
    clearInterval(timerInterval);
    document.getElementById("stopButton").classList.add("d-none")
    document.getElementById("startButton").classList.remove("d-none")
});

function updateTimer() {
    const currentTime = new Date().getTime();
    let elapsedTime;
    if (isPreviousRecord) {
        elapsedTime = startTime;
    } else {
        elapsedTime = currentTime - startTime;
    }

    let seconds = Math.floor(elapsedTime / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);

    seconds %= 60;
    minutes %= 60;

    const timerText = hours + "h " + minutes + "m " + seconds + "s";
    //   alert(timerText)
    document.getElementById("timer").innerHTML = timerText;
}
