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

loadUsers();