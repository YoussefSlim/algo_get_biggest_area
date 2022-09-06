let width = 20;
let height = 20;
let color = 5;

const clone = (variable) => {
  return JSON.parse(JSON.stringify(variable));
};

// generate a matrix
const generateMatrix = (width, height, nbColors) => {
  const matrix = [];
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
  const chooseArraySlice = colors.slice(0, nbColors);

  for (y = 0; y < height; y++) {
    // add a new array at each iteration because matrix[j+1] does not exist
    if (!matrix[y]) {
      matrix[y] = [];
    }

    for (x = 0; x < width; x++) {
      const colorIndex = Math.floor(Math.random() * chooseArraySlice.length);
      matrix[y][x] = chooseArraySlice[colorIndex];
    }
  }
  return matrix;
};

// draw matrix in DOM
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
  if (!color) {
    return 0;
  }

  matrix[y][x] = false;
  let count = 0;

  // check right pixel color
  if (x < row.length - 1) {
    const rightPixel = matrix[y][x + 1];

    if (rightPixel === color) {
      count++;

      area.push({
        x: x + 1,
        y: y,
        color: color,
      });

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
      count += checkPixel(matrix, x, y - 1, area);
    }
  }

  return count;
}

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

      let count = 1;
      count += checkPixel(matrix, x, y, area);
      areas.push(area);
    });
  });

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

  return biggestAreas;
}

// highlight the large areas
function highlightArea(originalMatrix, area, color) {
  const matrix = clone(originalMatrix);

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
