function makeRequestPromise(url) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
              let errorRequest = Math.random() < 0.3;
          if(errorRequest) {
                 reject(new Error("Rejected. Invalid Request."));
         } else {
                resolve(`Данные с ${url}`);
            }
        }, 1000) 
    })
}

Promise.race([
    makeRequestPromise('/users'),
    makeRequestPromise('/posts'),
    makeRequestPromise('/comments')
])
.then((results) => {console.log(results)})
.catch((error) => {console.error(error.message)})