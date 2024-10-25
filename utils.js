export function wait(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Select a random element from an array. May be used to select a position?
 * @param arr
 * @returns {*}
 */
export function randomElementFromArray(arr) {
  const element = arr[Math.floor(Math.random() * arr.length)];
  return element;
}
