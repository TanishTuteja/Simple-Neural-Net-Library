class Matrix {
  constructor(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.matrix = [];

    for (let i = 0; i < rows; i++) {
      this.matrix[i] = [];

      for (let j = 0; j < cols; j++) {
        this.matrix[i][j] = 0;
      }
    }
  }

  display() {
    console.table(this.matrix);
  }

  randomize(min, max) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random() * (max - min) + min;
      }
    }
  }

  //This method uses p5.js, to be implemented independently
  /*randomizeGaussian() {

        for (let i = 0; i < this.rows; i++) {

            for (let j = 0; j < this.cols; j++) {

                this.matrix[i][j] = randomGaussian();

            }

        }

    }*/

  map(func) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.matrix[i][j];
        this.matrix[i][j] = func(val, i, j);
      }
    }
  }

  static map(m, func) {
    var result = new Matrix(m.rows, m.cols);

    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let val = m.matrix[i][j];
        result.matrix[i][j] = func(val, i, j);
      }
    }

    return result;
  }

  static fromArray(array) {
    var result = new Matrix(array.length, 1);

    for (var i = 0; i < array.length; i++) {
      result.matrix[i][0] = array[i];
    }

    return result;
  }

  static toArray(m) {
    var result = [];

    for (var i = 0; i < m.rows; i++) {
      for (var j = 0; j < m.cols; j++) {
        result.push(m.matrix[i][j]);
      }
    }

    return result;
  }

  static addElementwise(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      let result = new Matrix(a.rows, a.cols);

      for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.cols; j++) {
          result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
        }
      }

      return result;
    } else {
      console.log("Invalid types in addElementWise, Matrix expected");
      return null;
    }
  }

  static addScalar(matrix, scalar) {
    if (matrix instanceof Matrix) {
      let result = new Matrix(matrix.rows, matrix.cols);

      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.matrix[i][j] = matrix.matrix[i][j] + scalar;
        }
      }

      return result;
    } else {
      console.log("Invalid types in addScalar, Matrix expected");
      return null;
    }
  }

  static subtractElementwise(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      let result = new Matrix(a.rows, a.cols);

      for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.cols; j++) {
          result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
        }
      }

      return result;
    } else {
      console.log("Invalid types in subtractElementWise, Matrix expected");
      return null;
    }
  }

  static subtractScalar(matrix, scalar) {
    if (matrix instanceof Matrix) {
      let result = new Matrix(matrix.rows, matrix.cols);

      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.matrix[i][j] = matrix.matrix[i][j] - scalar;
        }
      }

      return result;
    } else {
      console.log("Invalid types in subtractScalar, Matrix expected");
      return null;
    }
  }

  static multiplyElementwise(a, b) {
    if (a instanceof Matrix && b instanceof Matrix) {
      let result = new Matrix(a.rows, a.cols);

      for (let i = 0; i < a.rows; i++) {
        for (let j = 0; j < a.cols; j++) {
          result.matrix[i][j] = a.matrix[i][j] * b.matrix[i][j];
        }
      }

      return result;
    } else {
      console.log("Invalid types in multiplyElementWise, Matrix expected");
      return null;
    }
  }

  static multiplyScalar(matrix, scalar) {
    if (matrix instanceof Matrix) {
      let result = new Matrix(matrix.rows, matrix.cols);

      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.matrix[i][j] = matrix.matrix[i][j] * scalar;
        }
      }

      return result;
    } else {
      console.log("Invalid types in multiplyScalar, Matrix expected");
      return null;
    }
  }

  static matrixProduct(a, b) {
    if (a instanceof Matrix && b instanceof Matrix && a.cols === b.rows) {
      let result = new Matrix(a.rows, b.cols);

      for (let i = 0; i < result.rows; i++) {
        for (let j = 0; j < result.cols; j++) {
          let sum = 0;

          for (let k = 0; k < a.cols; k++) {
            sum += a.matrix[i][k] * b.matrix[k][j];
          }

          result.matrix[i][j] = sum;
        }
      }

      return result;
    } else {
      console.log(
        "Invalid types in matrixProduct, cols of matrix a should be equal to rows of matrix b expected"
      );
      return null;
    }
  }

  static transpose(matrix) {
    if (matrix instanceof Matrix) {
      let result = new Matrix(matrix.cols, matrix.rows);

      for (let i = 0; i < matrix.rows; i++) {
        for (let j = 0; j < matrix.cols; j++) {
          result.matrix[j][i] = matrix.matrix[i][j];
        }
      }

      return result;
    } else {
      console.log("Invalid types in transpose, Matrix expected");
      return null;
    }
  }
}

exports.Matrix = Matrix;
