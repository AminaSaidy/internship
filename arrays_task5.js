let arr = [];
for(let i = 0; i < 10; i++) {
    arr.push(Math.floor(Math.random() * 100) + 1);
}
console.log(arr);

//with spread operator and Math.min, Math.max
console.log("Minimum value is ", Math.min(...arr));
console.log("Maximum value is ", Math.max(...arr));

//without 
let min = arr[0];
let max = arr[0];

for(let j = 0; j < arr.length; j++) {
    if (arr[j] < min) {
        min = arr[j];
    }

    if (arr[j] > max) {
        max = arr[j];
    }
}

console.log("Minimum value is ", min);
console.log("Maximum value is ", max);