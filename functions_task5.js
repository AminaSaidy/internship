function getRandomNumberPromise() {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
           let randomNum = Math.floor(Math.random() * 100) + 1; 
           if (randomNum > 90) {
             reject(new Error("Rejected, random number is greater than 90"));
           } else {
             resolve(randomNum);
           }
        }, 1500)
    }) 
}

function doubleNumberPromise(num) {
    return new Promise ((resolve, reject) => {
        setTimeout (() => {
            if (num > 50) {
                reject(new Error("Rejected, random number is greater than 50"))
            } else {
                resolve(num * 2);
            }
        }, 1000) 
    }) 
}

async function processNumber() {
    try {
        let number = await getRandomNumberPromise();
        console.log("Random number is ", number);

        let doubledNum = await doubleNumberPromise(number);
        console.log("Doubled number is", doubledNum);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

processNumber();