// Initialize matrix parameters
let width;
let height;
let color;

// Generic function to create a copy of an array
const clone = (variable) => {
  return JSON.parse(JSON.stringify(variable));
};

// Generate a matrix
const generateMatrix = (width, height, nbColors) => {
  const matrix = [];

  // List of base colors to choose the number
  //of colors when generating the matrix
  const colors = [
    "black",
    "green",
    "red",
    "orange",
    "yellow",
    "blue",
    "cyan",
    "gray",
  ];

  // List of colors chosen when calling the function "generateMatrix"
  const chooseListColors = colors.slice(0, nbColors);

  // Create the matrix with colors
  for (y = 0; y < height; y++) {
    // add a new array at each iteration because matrix[y+1] does not exist
    if (!matrix[y]) {
      matrix[y] = [];
    }

    for (x = 0; x < width; x++) {
      const colorIndex = Math.floor(Math.random() * chooseListColors.length);
      matrix[y][x] = chooseListColors[colorIndex];
    }
  }
  return matrix;
};

// Draw matrix in DOM
function drawMatrixDom(matrix) {
  const body = document.querySelector("body");
  const container = document.createElement("div");
  container.classList.add("matrix");
  container.style.width = matrix[0].length * 20 + "px";
  matrix.forEach((row) => {
    row.forEach((cellColor) => {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.style.backgroundColor = cellColor;
      container.appendChild(cellElement);
    });
    body.appendChild(container);
  });
}

//check the surrounding pixel have the same color
function checkPixel(matrix, x, y, area) {
  const row = matrix[y];
  const color = matrix[y][x];

  // pass the cell already counted to avoid an infinite recursion loop
  matrix[y][x] = false;

  // check right pixel color
  if (x < row.length - 1) {
    const rightPixel = matrix[y][x + 1];

    if (rightPixel === color) {
      // Find the area that has the same color and store it in the array
      area.push({
        x: x + 1,
        y: y,
        color: color,
      });

      // The function calls itself to check all pixels to the right
      checkPixel(matrix, x + 1, y, area);
    }
  }

  // check bottom pixel color
  if (y < matrix.length - 1) {
    const bottomPixel = matrix[y + 1][x];
    if (bottomPixel === color) {
      area.push({
        x: x,
        y: y + 1,
        color: color,
      });
      // The function calls itself to check all pixels to the bottom
      checkPixel(matrix, x, y + 1, area);
    }
  }

  // check left pixel color
  if (x > 0) {
    // check pixel color
    const test = (direction, x, y) => {
      if (direction === color) {
        area.push({
          x: x - 1,
          y: y,
          color: color,
        });
        // The function calls itself to check all pixels to the left
        checkPixel(matrix, x - 1, y, area);
      }
    };
    const leftPixel = matrix[y][x - 1];
    if (leftPixel === color) {
      area.push({
        x: x - 1,
        y: y,
        color: color,
      });
      // The function calls itself to check all pixels to the left
      checkPixel(matrix, x - 1, y, area);
    }
  }

  // check top pixel color
  if (y > 0) {
    const topPixel = matrix[y - 1][x];
    if (topPixel === color) {
      area.push({
        x: x,
        y: y - 1,
        color: color,
      });

      // The function calls itself to check all pixels to the top
      checkPixel(matrix, x, y - 1, area);
    }
  }
}

// extract all areas withe same colors
function findAreas(originalMatrix) {
  const matrix = clone(originalMatrix);

  const areas = [];
  matrix.forEach((row, y) => {
    row.forEach((color, x) => {
      if (!color) {
        return;
      }

      const area = [];
      area.push({
        x: x,
        y: y,
        color: color,
      });

      checkPixel(matrix, x, y, area);
      areas.push(area);
    });
  });

  return areas;
}

// Find the biggest area
function findBiggestAreas(orginalMatrix) {
  const matrix = clone(orginalMatrix);
  const areas = findAreas(matrix);
  let lengthOfAreas = [];

  areas.map((area, i) => {
    lengthOfAreas = [...lengthOfAreas, area.length];
  });
  let maxLength = Math.max(...lengthOfAreas);

  const biggestAreas = areas.filter((area) => area.length === maxLength);

  biggestAreas.map((area) =>
    area.map((cell) => (matrix[cell.y][cell.x] = "magenta"))
  );

  return matrix;
}

// draw the matrix in the dom
const render = () => {
  //initialize an object to store input values
  let values = {};

  // target all inputs in the Dom
  const inputs = document.querySelectorAll(".input");

  //  get the values from inputs
  inputs.forEach(({ name, value }) => {
    values = { ...values, [name]: value };
  });

  let { width, height, color } = values;

  const matrix = generateMatrix(width, height, color);
  const biggestAreas = findBiggestAreas(matrix);

  drawMatrixDom(biggestAreas);

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    values = { [name]: value };
    location.reload();
  });
};

render();
