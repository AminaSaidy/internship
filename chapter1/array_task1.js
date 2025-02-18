let numbers = [15, 2, 9, 8, 11];

console.log("Length of the array: ", numbers.length);
console.log("First element: ", numbers[0], ", last element: ", numbers[numbers.length - 1]);

numbers.push(20);
console.log("Array after .push(20): ", numbers);

let poppedEl = numbers.pop();
console.log("Popped element: ", poppedEl);
console.log("Array after .pop(): ", numbers);

numbers.unshift(17);
console.log("Array after .unshift(17): ", numbers);

let shiftEl = numbers.shift();
console.log("Deleted element: ", shiftEl);
console.log("Array after .shift(): ", numbers);