function getRandomNumberCallback (callback) {
    setTimeout (() => {
        let randomNum = Math.floor(Math.random() * 100) + 1;
        console.log("Random number: ", randomNum);
        callback(randomNum);
    }, 3000);
}

function doubleNumberCallback (number) {
    setTimeout (() => {
        let doubledNum = number * 2;
        console.log("Doubled number: ", doubledNum);
    }, 2000);
}

getRandomNumberCallback(doubleNumberCallback);