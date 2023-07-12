const Store = require('electron-store');
const store = new Store();

const loginBtn = document.getElementById("loginSubmit");
loginBtn.onclick = (() => {
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    if (loginEmail && loginPassword) {
        try {
            postData("https://test-my.workstation.co.uk/auth/login", { email: loginEmail, password: loginPassword }).then((data) => {
                if (data?.access_token) {
                    store.set('accessToken', data.access_token)
                    store.set('loggedUser', JSON.stringify(data.user))
                    console.log({ data: store.get('accessToken') });
                    return window.location.href = "index.html";
                }
                alert(data?.error || data?.email)
            });
        } catch (error) {
            console.log({ error });
        }
    }
});

async function postData(url = "", data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
            "Content-Type": "application/json",
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}