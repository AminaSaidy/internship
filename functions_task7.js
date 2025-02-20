function makeRequestPromise(url) {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            let errorRequest = Math.random() < 0.3;
         if (errorRequest) {
            reject(new Error("Rejected. Invalid request."));
          } else {
            resolve(`Данные с ${url}`);
           }
       }, 1000)
    })
}

let arrayRequests = [
    makeRequestPromise('/users'),
    makeRequestPromise('/posts'),
    makeRequestPromise('/comments')
];

Promise.all(arrayRequests)
.then((results) => {console.log(`All ptomises are done: ${results}`)})
.catch((error) => {console.error(`Error occured. ${error.message}`)})