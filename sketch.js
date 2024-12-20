let cellSize = 4;
let columnCount;
let rowCount;
let currentCells = [];
let nextCells = [];
let lastChangeTime = 0; // Track the time since the last change
let startTime = 0; // Track the start time of the simulation

function setup() {
  // Set simulation framerate to 10 to avoid flickering
  frameRate(10);
  createCanvas(720, 1080);

  // Calculate columns and rows
  columnCount = floor(width / cellSize);
  rowCount = floor(height / cellSize);

  // Set each column in current cells to an empty array
  // This allows cells to be added to this array
  // The index of the cell will be its row number

  // Repeat the same process for the next cells
  for (let column = 0; column < columnCount; column++) {
    currentCells[column] = [];
    nextCells[column] = [];
  }

  randomizeBoard(); // Initialize the board with random values
  startTime = millis(); // Record the start time
  loop(); // Start the draw loop automatically

  describe(
    "Grid of squares that switch between white and black, demonstrating a simulation of John Conway's Game of Life. When clicked, the simulation resets."
  );
}

function draw() {
  background('#1841eb');
  generate();
  let hasChanged = false;

  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Get cell value (0 or 1)
      let cell = currentCells[column][row];

      // Convert cell value to get black (0) for alive or white (255 (white) for dead
      fill(cell === 1 ? '#1841eb' : '#000000');
      stroke(0, 0, 0, 0);
      rect(column * cellSize, row * cellSize, cellSize, cellSize);

      // Check if the cell has changed
      if (currentCells[column][row] !== nextCells[column][row]) {
        hasChanged = true;
      }
    }
  }

  // Update the timer if there was a change
  if (hasChanged) {
    lastChangeTime = millis();
  }

  // Check if 5 seconds have passed since the last change
  if (millis() - lastChangeTime > 5000) {
    randomizeBoard();
    lastChangeTime = millis(); // Reset the timer
  }
  // Check if 120 seconds have passed since the start of the simulation
  if (millis() - startTime > 120000) {
    noLoop(); // Stop the draw loop
    console.log("Simulation ended after 120 seconds.");
  }
}

// Reset board when mouse is pressed
function mousePressed() {
  randomizeBoard();
  loop();
}

// Fill board randomly
function randomizeBoard() {
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Randomly select value of either 0 (dead) or 1 (alive)
      currentCells[column][row] = random([0, 1]);
    }
  }
}

// Create a new generation
function generate() {
  // Loop through every spot in our 2D array and count living neighbors
  for (let column = 0; column < columnCount; column++) {
    for (let row = 0; row < rowCount; row++) {
      // Column left of current cell
      // if column is at left edge, use modulus to wrap to right edge
      let left = (column - 1 + columnCount) % columnCount;

      // Column right of current cell
      // if column is at right edge, use modulus to wrap to left edge
      let right = (column + 1) % columnCount;

      // Row above current cell
      // if row is at top edge, use modulus to wrap to bottom edge
      let above = (row - 1 + rowCount) % rowCount;

      // Row below current cell
      // if row is at bottom edge, use modulus to wrap to top edge
      let below = (row + 1) % rowCount;

      // Count living neighbors surrounding current cell
      let neighbours =
        currentCells[left][above] +
        currentCells[column][above] +
        currentCells[right][above] +
        currentCells[left][row] +
        currentCells[right][row] +
        currentCells[left][below] +
        currentCells[column][below] +
        currentCells[right][below];

      // Rules of Life
      // 1. Any live cell with fewer than two live neighbours dies
      // 2. Any live cell with more than three live neighbours dies
      if (neighbours < 2 || neighbours > 3) {
        nextCells[column][row] = 0;
        // 4. Any dead cell with exactly three live neighbours will come to life.
      } else if (neighbours === 3) {
        nextCells[column][row] = 1;
        // 3. Any live cell with two or three live neighbours lives, unchanged, to the next generation.
      } else nextCells[column][row] = currentCells[column][row];
    }
  }

  // Swap the current and next arrays for next generation
  let temp = currentCells;
  currentCells = nextCells;
  nextCells = temp;

  // Check if 120 seconds have passed since the start of the simulation
if (millis() - startTime > 120000) {
  noLoop(); // Stop the draw loop
  console.log("Simulation ended after 120 seconds.");
  randomizeBoard(); // Reset the board
  startTime = millis(); // Reset the start time
  loop(); // Restart the draw loop
}
}