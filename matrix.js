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
  console.log("matrix original", matrix);
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
  let count = 0;

  // check right pixel color
  if (x < row.length - 1) {
    const rightPixel = matrix[y][x + 1];

    if (rightPixel === color) {
      count++;

      // Find the area that has the same color and store it in the array
      area.push({
        x: x + 1,
        y: y,
        color: color,
      });

      // The function calls itself to check all pixels to the right
      count += checkPixel(matrix, x + 1, y, area);
    }
  }

  // check bottom pixel color
  if (y < matrix.length - 1) {
    const bottomPixel = matrix[y + 1][x];
    if (bottomPixel === color) {
      count++;

      area.push({
        x: x,
        y: y + 1,
        color: color,
      });
      // The function calls itself to check all pixels to the bottom
      count += checkPixel(matrix, x, y + 1, area);
    }
  }

  // check left pixel color
  if (x > 0) {
    const leftPixel = matrix[y][x - 1];
    if (leftPixel === color) {
      count++;

      area.push({
        x: x - 1,
        y: y,
        color: color,
      });
      // The function calls itself to check all pixels to the left
      count += checkPixel(matrix, x - 1, y, area);
    }
  }

  // check top pixel color
  if (y > 0) {
    const topPixel = matrix[y - 1][x];

    if (topPixel === color) {
      count++;
      area.push({
        x: x,
        y: y - 1,
        color: color,
      });

      // The function calls itself to check all pixels to the top
      count += checkPixel(matrix, x, y - 1, area);
    }
  }

  return count;
}

// extract all areas withe same colors
function findAreas(originalMatrix) {
  const matrix = clone(originalMatrix);
  console.log("matrix dans fimdareas", matrix);
  console.log("originalMatrix; dans fimdareas", originalMatrix);

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
  console.log("areas", areas);
  return areas;
}

// Find the biggest area
function findBiggestAreas(matrix) {
  const areas = findAreas(matrix);
  let biggestAreas = [];

  let maxSize = 0;
  areas.forEach((area) => {
    if (area.length >= maxSize) {
      maxSize = area.length;
    }
  });

  areas.forEach((area) => {
    if (area.length === maxSize) {
      biggestAreas.push(area);
    }
  });
  console.log("biggestAreas", biggestAreas);
  return biggestAreas;
}

// highlight the large areas
function highlightArea(matrix, area, color) {
  area.forEach((cell) => {
    matrix[cell.y][cell.x] = color;
  });

  return matrix;
}

// highlight the large areas
function highlightAreas(matrix, areas) {
  let highlightedMatrix = clone(matrix);

  areas.forEach((area) => {
    highlightedMatrix = highlightArea(highlightedMatrix, area, "magenta");
  });

  return highlightedMatrix;
}

// draw the matrix in the dom
const render = () => {
  let initialWidth = document.querySelector("#width").value;
  let initialHeight = document.querySelector("#height").value;
  let initialColor = document.querySelector("#color").value;

  const matrix = generateMatrix(initialWidth, initialHeight, initialColor);
  const biggestAreas = findBiggestAreas(matrix);
  const highlightedMatrix = highlightAreas(matrix, biggestAreas);

  drawMatrixDom(highlightedMatrix);

  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();

    width = e.target.width.value;
    height = e.target.height.value;
    color = e.target.color.value;

    reRender([width, height, color]);
  });
};

// update rendering
const reRender = (args) => {
  const previousMatrixElement = document.querySelector(".matrix");
  previousMatrixElement.style.filter = "blur(3px)";

  const matrix = generateMatrix(...args);
  const biggestAreas = findBiggestAreas(matrix);
  const highlightedMatrix = highlightAreas(matrix, biggestAreas);

  previousMatrixElement.parentNode.removeChild(previousMatrixElement);

  drawMatrixDom(highlightedMatrix);
};

render();
