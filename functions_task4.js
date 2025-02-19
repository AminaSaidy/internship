function makeRequestPromise(url) {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            let errorRequest = Math.random < 0.3;
            if (errorRequest) {
                reject(new Error("Rejected, invalid request."));
            } else {
                resolve(`Данные с ${url}`);
            }
        }, 1500);  
    })
}