function getRandomNumberCallback (callback) {
    setTimeout (() => {
        const randomNum = Math.floor(Math.random() * 100) + 1;
        console.log("Random number: ", randomNum);
        callback(randomNum);
    }, 1000);
}

