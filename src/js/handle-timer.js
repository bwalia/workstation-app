const db = require('electron-db');
const dataFetch = new Fetch();
const path = require('path')
const businessID = store.get('businessID');

document.getElementById('startButton').addEventListener('click', () => {
    let startTime;
    let isPreviousRecord = false;
    let loggedUser = store.get("loggedUser");
    loggedUser = JSON.parse(loggedUser);
    // const trackerMemo = document.getElementById("trackerMemo").value;
    // if (!trackerMemo) return alert("Please insert the memo before starting the counter.");
    // startTime = new Date().getTime();
    // if (db.valid('progress')) {
    //     db.getRows('progress', {
    //         user_uuid: loggedUser.uuid,
    //         user_email: loggedUser.email,
    //         memo: trackerMemo,
    //     }, (succ, result) => {
    //         console.log({ result, length: Object.keys(result) });
    //         if (succ && Object.keys(result).length) {
    //             startTime = result[0].time;
    //             isPreviousRecord = true;
    //         }
    //     })
    // }
    tick();
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

document.getElementById('logout').addEventListener('click', () => {
    console.log("clicked");
    dataFetch.logout();
})

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

const showProjects = () => {
    const location = path.join(__dirname, '../');
    const selectedProjectId = store.get("projectId")
    const where = {
        businessID: businessID,
        projectId: selectedProjectId
    };
    const selectElement = document.getElementById('taskListing');
    db.getRows('tasks', location, where, (succ, result) => {
        console.log({ succ, result });
        if (succ && result.length) {
            console.log({ result });
            result[0]?.data.forEach((item, idx) => {
                const option = document.createElement('option');
                if (idx === 0) {
                    const defaultOption = document.createElement('option');
                    console.log("here");
                    defaultOption.value = '';
                    defaultOption.textContent = "-- Select Task --";
                    defaultOption.classList.add("tasks-option")
                    selectElement.appendChild(defaultOption);
                }
                option.value = item.id;
                option.textContent = item.name;
                option.classList.add("tasks-option")
                selectElement.appendChild(option);
            });
        }
    })
}

const getTaskByPId = async () => {
    const location = path.join(__dirname, '../');
    const selectedProjectId = store.get("projectId")
    console.log({ selectedProjectId, businessID });
    const tasksFromAPI = await dataFetch.getData(
        `http://localhost:8080/api/v2/business/${businessID}/projects/${selectedProjectId}/tasks`
    );
    if (tasksFromAPI?.error) {
        store.delete('accessToken')
        store.delete('businessID')
        store.delete('loggedUser')
        return window.location.href = "login.html";
    }

    const projectsData = new Object();
    projectsData.businessID = businessID;
    projectsData.projectId = selectedProjectId;
    projectsData.data = [...tasksFromAPI.data];

    const where = {
        businessID: businessID,
        projectId: selectedProjectId
    };
    const set = {
        data: [...tasksFromAPI.data]
    }

    db.getRows('tasks', location, where, (succ, result) => {
        console.log({ succ, result });
        if (succ && result.length) {
            db.updateRow('tasks', location, where, set, (succ, msg) => {
                // succ - boolean, tells if the call is successful
                console.log("Success: " + succ);
                console.log("Message: " + msg);
                showProjects();
            });
        } else {
            db.insertTableContent('tasks', location, projectsData, (succ, msg) => {
                // succ - boolean, tells if the call is successful
                console.log("Success: " + succ);
                console.log("Message: " + msg);
                showProjects();
            })
        }
    })
}
getTaskByPId();

const handleOptionClick = (evt) => {
    store.set('taskId', evt.target.value)
    alert(evt.target.value)
}
const listingElement = document.getElementById('taskListing');
listingElement.addEventListener('change', handleOptionClick);


// Timer JS Started
var defaults = {}
    , one_second = 1000
    , one_minute = one_second * 60
    , one_hour = one_minute * 60
    , one_day = one_hour * 24
    , startDate = new Date()
    , face = document.getElementById('lazy');

var requestAnimationFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
}());

function tick() {

    var now = new Date()
        , elapsed = now - startDate
        , parts = [];

    parts[0] = '' + Math.floor(elapsed / one_hour);
    parts[1] = '' + Math.floor((elapsed % one_hour) / one_minute);
    parts[2] = '' + Math.floor(((elapsed % one_hour) % one_minute) / one_second);

    parts[0] = (parts[0].length == 1) ? '0' + parts[0] : parts[0];
    parts[1] = (parts[1].length == 1) ? '0' + parts[1] : parts[1];
    parts[2] = (parts[2].length == 1) ? '0' + parts[2] : parts[2];

    face.innerText = parts.join(':');

    requestAnimationFrame(tick);

}

// Timer JS End
