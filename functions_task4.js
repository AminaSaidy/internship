function makeRequestPromise(url) {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            let errorRequest = Math.random() < 0.3;
            if (errorRequest) {
                reject(new Error("Rejected, invalid request."));
            } else {
                resolve(`Данные с ${url}`);
            }
        }, 1500);  
    })
}

makeRequestPromise('/user') 
.then((data) => {
    console.log(data);
    return makeRequestPromise('/posts');
})
.then((data) => {
    console.log(data);
    return makeRequestPromise('/comments');
})
.then((data) => {
    console.log(data);
})
.catch((err) => console.log(`Error: ${err.message}`))