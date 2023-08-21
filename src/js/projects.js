const dataFetch = new Fetch();
const db = require('electron-db');
const path = require('path')
const businessID = store.get('businessID');

document.getElementById('logout').addEventListener('click', () => {
    console.log("clicked");
    dataFetch.logout();
})

const saveProjectsToDisk = async () => {
    const location = path.join(__dirname, '../');
    try {
        // Call the Projects API to get the business projects from CRM
        const projectsFromAPI = await dataFetch.getData(
            `http://localhost:8080/api/v2/business/${businessID}/projects`
        );
        if (projectsFromAPI?.error) {
            store.delete('accessToken')
            store.delete('businessID')
            store.delete('loggedUser')
            return window.location.href = "login.html";
        }
        const projectsData = new Object();
        projectsData.businessID = businessID;
        projectsData.data = [...projectsFromAPI.data];

        const where = {
            businessID: businessID,
        };
        const set = {
            data: [...projectsFromAPI.data]
        }

        db.getRows('projects', location, where, (succ, result) => {
            console.log({succ, result});
            if (succ && result.length) {
                db.updateRow('projects', location, where, set, (succ, msg) => {
                    // succ - boolean, tells if the call is successful
                    console.log("Success: " + succ);
                    console.log("Message: " + msg);
                });
            } else {
                db.insertTableContent('projects', location, projectsData, (succ, msg) => {
                    // succ - boolean, tells if the call is successful
                    console.log("Success: " + succ);
                    console.log("Message: " + msg);
                })
            }
        })
    } catch (error) {
        console.log({ error });
    }
}
const updateInternetStatus = (event)  => {
    console.log({event});
    let myNotification = new Notification
    (
        "com.myapp.id",
        { body: (event.type === 'online') ? "Internet available" : "No internet" }
    ); 

    if (event.type === "online") saveProjectsToDisk();
}

const showProjects = () => {
    const location = path.join(__dirname, '../');
    const where = {
        businessID: businessID,
    };
    const selectElement = document.getElementById('projectListing');
    db.getRows('projects', location, where, (succ, result) => {
        console.log({succ, result});
        if (succ && result.length) {
            result[0]?.data.forEach((item, idx) => {
                if (idx === 0) {
                    const defaultOption = document.createElement('option');
                    console.log("here");
                    defaultOption.value = '';
                    defaultOption.textContent = "-- Select Task --";
                    defaultOption.classList.add("tasks-option")
                    selectElement.appendChild(defaultOption);
                }
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.name;
                option.classList.add("project-option")
                selectElement.appendChild(option);
            });
        }
    })
}
const handleOptionClick = (evt) => {
    if (evt.target.value) {
        store.set('projectId', evt.target.value)
        return window.location.href = "index.html";
    }
}
const listingElement = document.getElementById('projectListing');
listingElement.addEventListener('change', handleOptionClick);

showProjects();
window.addEventListener ('online', updateInternetStatus, false);
window.addEventListener ('offline', updateInternetStatus, false);
