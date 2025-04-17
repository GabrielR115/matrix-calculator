let matrixA = [];
let matrixB = [];

function generateMatrixInput(matrixName) {
  const rows = document.getElementById(`rows${matrixName}`).value;
  const cols = document.getElementById(`cols${matrixName}`).value;
  const container = document.getElementById(`matrixContainer${matrixName}`);
  container.innerHTML = "";

  for (let i = 0; i < rows; i++) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "matrix-row";
    for (let j = 0; j < cols; j++) {
      const input = document.createElement("input");
      input.type = "text";
      input.className = `matrix-input-${matrixName}`;
      input.dataset.row = i;
      input.dataset.col = j;
      rowDiv.appendChild(input);
    }
    container.appendChild(rowDiv);
  }
}

function readMatrixInputs(matrixName) {
  const inputs = document.querySelectorAll(`.matrix-input-${matrixName}`);
  const matrix = [];

  inputs.forEach(input => {
    const row = Number(input.dataset.row);
    const col = Number(input.dataset.col);
    if (!matrix[row]) matrix[row] = [];
    
    try {
        matrix[row][col] = math.evaluate(input.value);
      } catch {
        alert("Invalid expression: " + input.value);
        throw new Error("Parse error");
      }      

  });

  return matrix;
}

function readBothMatrices() {
  matrixA = readMatrixInputs('A');
  matrixB = readMatrixInputs('B');
  displayMatrix(matrixA, "previewA");
  displayMatrix(matrixB, "previewB");
}

function performOperation() {
  if (!matrixA.length || !matrixB.length) {
    alert("Please submit both matrices first.");
    return;
  }

  const op = document.getElementById("operation").value;
  let result;

  try {
    if (op === "add") result = addMatrices(matrixA, matrixB);
    else if (op === "subtract") result = subtractMatrices(matrixA, matrixB);
    else if (op === "multiply") result = multiplyMatrices(matrixA, matrixB);
    displayMatrix(result, "matrixOutput");
  } catch (error) {
    alert("Error performing operation: " + error.message);
  }
}

function displayMatrix(matrix, elementId) {
  const output = document.getElementById(elementId);
  output.innerHTML = "";
  const wrapper = document.createElement("div");
  wrapper.className = "matrix-wrapper";

  const left = document.createElement("div");
  left.className = "matrix-bracket left";
  left.textContent = "[";

  const right = document.createElement("div");
  right.className = "matrix-bracket right";
  right.textContent = "]";

  const body = document.createElement("div");
  body.className = "matrix-body";

  for (let row of matrix) {
    const rowDiv = document.createElement("div");
    rowDiv.className = "matrix-row";
    rowDiv.textContent = row.join("  ");
    body.appendChild(rowDiv);
  }

  wrapper.appendChild(left);
  wrapper.appendChild(body);
  wrapper.appendChild(right);
  output.appendChild(wrapper);
}

function performLU(which) {
    const mat = which === 'A' ? matrixA : matrixB;
    if (!mat || !mat.length) {
      alert(`Matrix ${which} is not defined.`);
      return;
    }
    
    try {
      const { L, U } = luDecompose(mat);
  
      // Decide output IDs based on A or B
      const outL = which === 'A' ? 'luA_L' : 'luB_L';
      const outU = which === 'A' ? 'luA_U' : 'luB_U';
  
      // Show L and U
      displayMatrix(L, outL);
      displayMatrix(U, outU);
  
    } catch (err) {
      alert("LU Decomposition failed: " + err.message);
    }
  }
  
  

function luDecompose(A) {
  const n = A.length;
  const L = Array.from({ length: n }, () => Array(n).fill(0));
  const U = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    // Compute U (upper triangular)
    for (let k = i; k < n; k++) {
      let sum = 0;
      for (let j = 0; j < i; j++) {
        sum += L[i][j] * U[j][k];
      }
      U[i][k] = A[i][k] - sum;
    }
    // Compute L (lower triangular)
    for (let k = i; k < n; k++) {
      if (i === k) {
        L[i][i] = 1;
      } else {
        let sum = 0;
        for (let j = 0; j < i; j++) {
          sum += L[k][j] * U[j][i];
        }
        if (U[i][i] === 0) throw new Error("Division by zero in LU");
        L[k][i] = (A[k][i] - sum) / U[i][i];
      }
    }
  }
  return { L, U };
}
