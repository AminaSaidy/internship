function makeRequestCallback(url, callback) {
    setTimeout (() => {
        let result = `Данные с ${url}`;
        console.log(result);
        callback(result);
    }, 2500);
}