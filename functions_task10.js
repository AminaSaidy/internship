async function requestDataFromApi () {
    let urlUsers = "https://jsonplaceholder.typicode.com/users";
    let urlPosts = "https://jsonplaceholder.typicode.com/posts";

    try {
        let [responseUsers, responsePosts] = await Promise.all([
            fetch(urlUsers),
            fetch(urlPosts)
        ]);

        if(!responseUsers.ok || !responsePosts.ok) {
            throw new Error (`Response error: ${responseUsers.status}, ${responsePosts.status}`);
        }

        let [users, posts] = await Promise.all([
            responseUsers.json(),
            responsePosts.json()
        ]);

        let result = {users, posts};
        console.log(result);
    } catch (error) {
        console.error(error.message);
    }
}

requestDataFromApi();