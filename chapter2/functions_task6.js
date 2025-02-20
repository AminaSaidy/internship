function makeRequestPromise (url) {
    return new Promise ((resolve, reject) => {
        setTimeout(() => {
            let errorRequest = Math.random() < 0.3;
            if(errorRequest) {
                reject(new Error("Rejected, invalid request"));
            } else {
                resolve(`Данные с ${url}`);
            }
        }, 1500)
    })
}

async function getData () {
    try {
        let data1 = await makeRequestPromise('/users');
      console.log(data1);

         let data2 = await makeRequestPromise('/posts');
     console.log(data2);

         let data3 = await makeRequestPromise('/comments');
     console.log(data3);
    } catch (error) {
        console.error(`Error occured. ${error.message}`);
    }
}

getData();