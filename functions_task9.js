async function loadUsers() {
    let url = "https://jsonplaceholder.typicode.com/users";
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response error: ${response.status}`);
        }

        let json = await response.json();
        console.log(json);
    } catch (error) {
        console.error(error.message);
    }
}

async function loadUsers2() {
    let url = "https://jsonplaceholder.typicode.com/users";
    fetch(url)
    .then((response) => {
        if(!response.ok) {
            throw new Error(`Response error: ${response.status}`);
        }
        return response.json();
    })
    .then((json) => {console.log(json)})
    .catch((error) => {console.error(error.message)})
}

loadUsers();
loadUsers2();