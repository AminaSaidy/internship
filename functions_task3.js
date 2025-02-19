function geRandomNumberPromise() {
    return new Promise ((recolve, reject) => {
        setTimeout (() => {
            let randomNum = Math.floor(Math.random() * 100) + 1;
            if (randomNum > 90) {
                reject(new Error("Random number is greater than 90"));
            } else {
                resolve("Resolved, random number: ", randomNum);
            }
        }, 1000);
    });
}