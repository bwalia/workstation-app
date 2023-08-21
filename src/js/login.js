const dataFetch = new Fetch();

const loginBtn = document.getElementById("loginSubmit");
loginBtn.onclick = (() => {
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;
    console.log({ loginEmail, loginPassword });
    if (loginEmail && loginPassword) {
        try {
            dataFetch.postData("http://localhost:8080/auth/user_login", { email: loginEmail, password: loginPassword }).then((data) => {
                console.log({ data: data?.access_token });
                if (data?.access_token) {
                    store.set('accessToken', data.access_token)
                    store.set('businessID', data.user.uuid_business_id)
                    store.set('loggedUser', JSON.stringify(data.user))
                    return window.location.href = "projects.html";
                }
                alert(data?.error || data?.email)
            });
        } catch (error) {
            console.log({ error });
        }
    }
});

//livestreamed at
// https://youtu.be/kSBT669yLyU


function updateClock(hours, minutes, seconds) {

    var hourDegrees = hours * 30;
    var minuteDegrees = minutes * 6;
    var secondDegrees = seconds * 6;

    document.getElementById("hour-pin").style.transform = `rotate(${hourDegrees}deg)`;
    document.getElementById("minute-pin").style.transform = `rotate(${minuteDegrees}deg)`;
    document.getElementById("second-pin").style.transform = `rotate(${secondDegrees}deg)`;

}

setClockWithCurrentTime();

function setClockWithCurrentTime() {
    var date = new Date();

    var hours = ((date.getHours() + 11) % 12 + 1);
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();

    updateClock(hours, minutes, seconds);
}



setInterval(setClockWithCurrentTime, 1000);
