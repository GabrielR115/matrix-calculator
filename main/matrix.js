console.log("✅ matrix.js loaded!");

function gaussianEliminationWithEs(A) {
    const n = A.length;
    let M = math.clone(A);
    const Es = [];
  
    for (let i = 0; i < n; i++) {
      if (M[i][i] === 0) throw new Error("Zero pivot encountered");
  
      for (let j = i + 1; j < n; j++) {
        const factor = M[j][i] / M[i][i];
  
        // Create identity matrix
        const E = math.identity(n)._data;
        E[j][i] = -factor;
  
        // Record this elementary matrix
        Es.push(math.clone(E));
  
        // Apply row operation
        const rowI = M[i].map(val => factor * val);
        M[j] = M[j].map((val, k) => val - rowI[k]);
      }
    }
  
    return { U: M, elementaryMatrices: Es };
}
  

function addMatrices(A, B) {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error("Matrix dimensions must match for addition.");
  }

  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] + B[i][j];
    }
  }
  return result;
}

function subtractMatrices(A, B) {
  if (A.length !== B.length || A[0].length !== B[0].length) {
    throw new Error("Matrix dimensions must match for subtraction.");
  }

  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < A[0].length; j++) {
      result[i][j] = A[i][j] - B[i][j];
    }
  }
  return result;
}

function multiplyMatrices(A, B) {
  if (A[0].length !== B.length) {
    throw new Error("Number of columns in A must equal number of rows in B for multiplication.");
  }

  const result = [];
  for (let i = 0; i < A.length; i++) {
    result[i] = [];
    for (let j = 0; j < B[0].length; j++) {
      let sum = 0;
      for (let k = 0; k < A[0].length; k++) {
        sum += A[i][k] * B[k][j];
      }
      result[i][j] = sum;
    }
  }
  return result;
}

function showElementaryMatrices(which) {
    const mat = which === 'A' ? matrixA : matrixB;
    if (!mat || !mat.length) {
      alert(`Matrix ${which} is not defined.`);
      return;
    }
  
    try {
      const { U, elementaryMatrices } = gaussianEliminationWithEs(mat);
      const container = document.getElementById(`elementaryOutput${which}`);
      container.innerHTML = '';
  
      elementaryMatrices.forEach((E, index) => {
        const label = document.createElement('h4');
        label.textContent = `E${index + 1}`;
        container.appendChild(label);
        const id = `elemMatrix_${which}_${index}`;
        const div = document.createElement('div');
        div.id = id;
        container.appendChild(div);
        displayMatrix(E, id);
      });
  
      const labelU = document.createElement('h4');
      labelU.textContent = 'Final U (after elimination)';
      container.appendChild(labelU);
      const finalU = document.createElement('div');
      finalU.id = `finalU_${which}`;
      container.appendChild(finalU);
      displayMatrix(U, finalU.id);
  
    } catch (err) {
      alert('Elementary matrix computation failed: ' + err.message);
    }
  }
  