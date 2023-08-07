const dataFetch = new Fetch ();
const db = require('electron-db');

try {
    const businessID = store.get('businessID');
    dataFetch.getData(`http://localhost:8080/api/v2/business/${businessID}/projects`).then((data) => {
        // if (db.valid('projects')) {
            db.insertTableContent('projects', data, (succ, msg) => {
              // succ - boolean, tells if the call is successful
              console.log("Success: " + succ);
              console.log("Message: " + msg);
            })
        //   }
    });
} catch (error) {
    console.log({ error });
}