function getRandomNumberPromise() {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            let randomNum = Math.floor(Math.random() * 100);
            if (randomNum > 90) {
                reject(new Error("Rejected, random number is greater than 90"));
            } else {
                resolve(randomNum);
            }
        }, 1000);
    })
}

function doubleNumberPromise(num) {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            if (num > 50) {
                reject(new Error("Rejected, number is greater than 50"));
            } else {
                resolve(num * 2);
            }
        }, 500);
    })
}

getRandomNumberPromise()
.then((randomNum) => doubleNumberPromise(randomNum)) 
.then((doubledNum) => console.log(`Result: ${doubledNum}`))
.catch((err) => console.log(err))