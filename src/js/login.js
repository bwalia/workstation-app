const dataFetch = new Fetch ();

const loginBtn = document.getElementById("loginSubmit");
loginBtn.onclick = (() => {
    const loginEmail = document.getElementById("loginEmail").value;
    const loginPassword = document.getElementById("loginPassword").value;

    if (loginEmail && loginPassword) {
        try {
            dataFetch.postData("http://localhost:8080/auth/user_login", { email: loginEmail, password: loginPassword }).then((data) => {
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