function makeRequestCallback(url, callback) {
    setTimeout (() => {
        let result = `Данные с ${url}`;
        console.log(result);
        callback(result);
    }, 2500);
}

makeRequestCallback("some url", (result1) => {
    makeRequestCallback("next url", (result2) => {
        makeRequestCallback("one more url", (result3) => {
            console.log("Результат: ", result3);
        })
    })
});