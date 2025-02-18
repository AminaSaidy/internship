let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];

//using .concat()
console.log("Объединенный массив: ", arr1.concat(arr2));
console.log("Проверка исходного массива 1: ", arr1);
console.log("Проверка исходного массива 2: ", arr2);

//without using .concat()
let mergedArr = [...arr1, ...arr2];
console.log("Объединенный массив: ", mergedArr);
console.log("Проверка исходного массива 1: ", arr1);
console.log("Проверка исходного массива 2: ", arr2);