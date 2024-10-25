import {randomElementFromArray, wait} from './utils.js';


// game display elements
const grid = document.querySelector('.grid');
const scoreDisplay = document.querySelector('span');
const startBtn = document.querySelector('.start-btn');


// game variables
const width = 10;
const numCells = width * width;
grid.style.width = `${width * 10 * 2}px`;
grid.style.height = `${width * 10 * 2}px`;

let score = 0;
let max_items = 10;
let item_counter = 0;

// const pos_array = Array.from(Array(width).keys());  // array of positions to sample from -- currently uniform.
const pos_array = [1, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 6]

let currentItem = 0;

let direction = width;  // corresponds to downward movement.
let intervalTime = 200; // determines speed - frequency of game loop calls
let game_interval = 0;
let item_interval = 0;

let defenses = false;  // defenses part of the game.

// Save item positions:
let items_x = [];
let defenses_x = [];
const max_defenses = 5;


// create grid cells
// TODO: Make them identifiable (best by row and column!)
for (let i = 0; i < width * width; i++) {
    const cell = document.createElement('div');
    cell.style.width = `${width * 2}px`;
    cell.style.height = `${width * 2}px`;

    // Assign a class:
    cell.className = "cell";
    cell.setAttribute("id", "cell" + i);
    grid.appendChild(cell);
}
const cells = document.querySelectorAll('.grid div');


/*
Currently unused! Creates asynchronous effects and might be used to create items asychrnonously!
May be useful for destruciton of "defenses"
*/
// async function createFood() {
//   foodItemIndex = Math.floor(Math.random() * numCells);
//   if (currentSnake.includes(foodItemIndex)) {
//     await wait(100);
//     createFood();
//   } else {
//     cells[foodItemIndex].classList.add('food-item');
//     cells[foodItemIndex].innerText = randomElementFromArray(foodItemsArray);
//   }
// }


/*
Starting the game
*/

function startGame() {

    grid.classList.remove('shake');

    // Clear everything:
    item_counter = 0;
    items_x = [];

    if (!defenses) {
        cells.forEach(cix => {
            cix.style.background = 'none';
            cix.classList.remove('item');
            cix.innerText = '';
        });
    }

    // Show score:
    scoreDisplay.textContent = score;

    // Reset direction:
    direction = width;

    // Add the initial item:
    cells[currentItem].classList.add('item');

    // currentItem.forEach(i => {
    //     cells[i].classList.add('item');
    // });

    // Hide the button:
    startBtn.style.display = "none";

    // Start the item:
    if (item_counter < max_items) {
        item_interval = setInterval(gameLoop, intervalTime);
    }

}

// Add the event litener to the start button:
startBtn.addEventListener('click', startGame);


// The game:
function gameLoop() {

    grid.classList.remove('shake');

    // currentItem = 0;
    currentItem = randomElementFromArray(pos_array);   // Randomly draw initial position.

    // Clear everything:
    // currentItem.forEach(i => {
    cells[currentItem].style.background = 'none';
    cells[currentItem].classList.remove('item');
    cells[currentItem].innerText = '';
    // });
    clearInterval(item_interval);
    direction = width;

    // Add the initial item:
    cells[currentItem].classList.add('item');

    // currentItem.forEach(i => {
    //     cells[i].classList.add('item');
    // });

    // Clear the previous item:
    if (item_counter > 0) {
        cells[items_x[item_counter - 1]].style.background = 'blue';  // 'none'.
        // TODO: Here we could have a fancy animation.
    }

    // Check if all items have fallen:
    if (item_counter < max_items) {
        // Start the item:
        item_interval = setInterval(itemLoop, intervalTime);
    } else if (!defenses) {
        // TODO: Here we would trigger the "set defenses task":
        startDefenses();

        // Show the button:
        // startBtn.style.display = "block";
        // startBtn.addEventListener('click', startGame);
    } else {
        // Hide everything and show "Finished":
        startBtn.style.display = "none";
        grid.style.display = "none";
        document.getElementById("finished").textContent = "Finished!";
    }


}

startBtn.addEventListener('click', startGame);

// One item:
function itemLoop() {
    cells[currentItem].innerText = '';  // likely not needed.

    // Detect collision:
    const hit_bottom = (currentItem + width >= width * width && direction === width);  // hits bottom wall.
    let collision = hit_bottom;

    if (defenses) {
        const hit_defense = defenses_x.includes(currentItem + direction);

        collision = hit_bottom || hit_defense;  // hist existing item.

        // Remove hit defense from list:
        if (hit_defense) {
            const ix_def = defenses_x.indexOf(currentItem + direction);
            if (ix_def > -1) { // only splice array when item is found
                defenses_x.splice(ix_def, 1); // 2nd parameter means remove one item only
            }

            cells[currentItem + direction].style.backgroundColor = 'white';

            // Increment score:
            score++;
            scoreDisplay.textContent = score;

        }

        if (hit_bottom) {
            // Decrement score:
            score--;
            scoreDisplay.textContent = score;
        }
    }
    if (collision) {
        items_x.push(currentItem);  // add the current item to array of positions.
        console.log(items_x);
        grid.classList.add('shake');
        clearInterval(item_interval);

        // Run the next item:
        item_interval = setInterval(gameLoop, intervalTime);
        item_counter++;


        return;
    }

    // Move the item through the grid:
    cells[currentItem].classList.remove('item');
    cells[currentItem].style.background = 'none';
    currentItem += direction; // adds the direction to the item.
    // Style the new positions:
    cells[currentItem].classList.add('item');
    cells[currentItem].style.background = 'red';
}

function startDefenses() {
    cells.forEach(cix => {
        cix.style.background = 'none';
        cix.classList.remove('item');
        cix.innerText = '';
        cix.addEventListener('click', toggleDefense);
    });

    defenses = true;  // set the defenses task to true.
    max_items = 5;

    // Show the start button again:
    startBtn.style.display = "block";
    startBtn.addEventListener('click', startGame);
}


/*
 Adding defenses:
 */

function toggleDefense() {
    // this.clear();
    this.classList.toggle("defense");
    const cell_id = parseInt(this.id.replace("cell", ""));
    console.log(cell_id);

    if (defenses_x.length < max_defenses) {

        if (this.classList.contains("defense")) {
            this.style.backgroundColor = "orange";
            // Save ID to array:
            defenses_x.push(cell_id);
        } else {
            this.style.backgroundColor = "white";

            // Remove ID:
            const ix_def = defenses_x.indexOf(cell_id);
            if (ix_def > -1) { // only splice array when item is found
                defenses_x.splice(ix_def, 1); // 2nd parameter means remove one item only
            }
        }
    } else {
        // TODO: If no more defenses left, oputput a mesage!
    }


}

// function clear() {
//     for(var i=0; i < divItems.length; i++) {
//         var item = divItems[i];
//         item.style.backgroundColor = 'white';
//     }
// }