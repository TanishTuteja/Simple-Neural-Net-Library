class Matrix {
  /**
   * Creates a new Matrix object to store data.
   * @constructor
   * @param {Number} rows - The number of rows in the matrix.
   * @param {Number} cols - The number of columns in the matrix.
   */

  constructor(rows, cols) {
    if (isNaN(rows) || isNaN(cols)) {
      throw new MatrixTypeError("constructor", "Number and Number");
    }

    rows = Math.floor(rows);
    cols = Math.floor(cols);

    if (rows <= 0 || cols <= 0) {
      throw new Error("Invalid values in Matrix constructor, rows and cols must be greater than or equal to 1");
    }

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

  /**
   * Randomizes the elements of the matrix with floating point numbers ranging from min to max.
   * @param {Number} [min=0] - The minimum value of elements (inclusive).
   * @param {Number} [max=1] - The maximum value of elements (exclusive).
   */
  randomize(min, max) {
    if (isNaN(min)) {
      min = 0;
      max = 1;
    } else if (isNaN(max)) {
      max = min;
      min = 0;
    }

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.matrix[i][j] = Math.random() * (max - min) + min;
      }
    }
  }

  /**
   * Applies a function to all elements of the matrix.
   * @param {function} func - The function to be applied to the elements.
   */
  map(func) {
    if (!(func instanceof Function)) {
      throw new MatrixTypeError("map", "function");
    }
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let val = this.matrix[i][j];
        this.matrix[i][j] = func(val, i, j);
      }
    }
  }

  /**
   * Converts this matrix to a 1-D array by going from left to right for each row.
   * @returns {Number[]} result - A 1-D array containing the elements of the matrix.
   */
  toArray() {
    let result = [];

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        result.push(this.matrix[i][j]);
      }
    }

    return result;
  }

  addElementwise(m) {
    if (!(m instanceof Matrix)) {
      throw new MatrixTypeError("addElementwise", "Matrix");
    }
    if (m.rows !== this.rows && m.cols !== this.cols) {
      throw new DimensionError(false, "addElementwise", this, m);
    }
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let value = this.matrix[i][j] + m.matrix[i][j];
        this.matrix[i][j] = value;
      }
    }
  }

  addScalar(scalar) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let value = this.matrix[i][j] + scalar;
        this.matrix[i][j] = value;
      }
    }
  }

  subtractElementwise(m) {
    if (!(m instanceof Matrix)) {
      throw new MatrixTypeError("subtractElementwise", "Matrix");
    }
    if (m.rows !== this.rows && m.cols !== this.cols) {
      throw new DimensionError(false, "subtractElementwise", this, m);
    }
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let value = this.matrix[i][j] - m.matrix[i][j];
        this.matrix[i][j] = value;
      }
    }
  }

  subtractScalar(scalar) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let value = this.matrix[i][j] - scalar;
        this.matrix[i][j] = value;
      }
    }
  }

  multiplyElementwise(m) {
    if (!(m instanceof Matrix)) {
      throw new MatrixTypeError("multiplyElementwise", "Matrix");
    }
    if (m.rows !== this.rows && m.cols !== this.cols) {
      throw new DimensionError(false, "multiplyElementwise", this, m);
    }
    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let value = this.matrix[i][j] * m.matrix[i][j];
        this.matrix[i][j] = value;
      }
    }
  }

  multiplyScalar(scalar) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        let value = this.matrix[i][j] * scalar;
        this.matrix[i][j] = value;
      }
    }
  }

  static map(m, func) {
    if (!(m instanceof Matrix && func instanceof Function)) {
      throw new MatrixTypeError("map", "Matrix and function");
    }
    let result = new Matrix(m.rows, m.cols);

    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        let val = m.matrix[i][j];
        result.matrix[i][j] = func(val, i, j);
      }
    }

    return result;
  }

  static fromArray(array) {
    if (!Array.isArray(array)) {
      throw new MatrixTypeError("fromArray", "array");
    }
    let result = new Matrix(array.length, 1);

    for (let i = 0; i < array.length; i++) {
      result.matrix[i][0] = array[i];
    }

    return result;
  }

  /**
   * Converts the specified matrix to a 1-D array by going from left to right for each row of the matrix.
   * @param {Matrix} m - The matrix object to be converted to array.
   * @returns {Number[]} result - A 1-D array containing the elements of the matrix m.
   * @static
   */
  static toArray(m) {
    if (!(m instanceof Matrix)) {
      throw new MatrixTypeError("toArray", "Matrix");
    }

    let result = [];

    for (let i = 0; i < m.rows; i++) {
      for (let j = 0; j < m.cols; j++) {
        result.push(m.matrix[i][j]);
      }
    }

    return result;
  }

  static addElementwise(a, b) {
    if (!(a instanceof Matrix && b instanceof Matrix)) {
      throw new MatrixTypeError("addElementwise", "Matrix and Matrix");
    }

    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new DimensionError(true, "addElementwise", a, b);
    }

    let result = new Matrix(a.rows, a.cols);

    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.matrix[i][j] = a.matrix[i][j] + b.matrix[i][j];
      }
    }

    return result;
  }

  static addScalar(matrix, scalar) {
    if (!(matrix instanceof Matrix)) {
      throw new MatrixTypeError("addScalar", "Matrix");
    }

    let result = new Matrix(matrix.rows, matrix.cols);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.matrix[i][j] = matrix.matrix[i][j] + scalar;
      }
    }

    return result;
  }

  static subtractElementwise(a, b) {
    if (!(a instanceof Matrix && b instanceof Matrix)) {
      throw new MatrixTypeError("subtractElementwise", "Matrix and Matrix");
    }

    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new DimensionError(true, "subtractElementwise", a, b);
    }

    let result = new Matrix(a.rows, a.cols);

    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.matrix[i][j] = a.matrix[i][j] - b.matrix[i][j];
      }
    }

    return result;
  }

  static subtractScalar(matrix, scalar) {
    if (!(matrix instanceof Matrix)) {
      throw new MatrixTypeError("subtractScalar", "Matrix");
    }

    let result = new Matrix(matrix.rows, matrix.cols);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.matrix[i][j] = matrix.matrix[i][j] - scalar;
      }
    }

    return result;
  }

  static multiplyElementwise(a, b) {
    if (!(a instanceof Matrix && b instanceof Matrix)) {
      throw new MatrixTypeError("multiplyElementwise", "Matrix and Matrix");
    }

    if (a.rows !== b.rows || a.cols !== b.cols) {
      throw new DimensionError(true, "multiplyElementwise", a, b);
    }

    let result = new Matrix(a.rows, a.cols);

    for (let i = 0; i < a.rows; i++) {
      for (let j = 0; j < a.cols; j++) {
        result.matrix[i][j] = a.matrix[i][j] * b.matrix[i][j];
      }
    }

    return result;
  }

  static multiplyScalar(matrix, scalar) {
    if (!(matrix instanceof Matrix)) {
      throw new MatrixTypeError("multiplyScalar", "Matrix");
    }

    let result = new Matrix(matrix.rows, matrix.cols);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.matrix[i][j] = matrix.matrix[i][j] * scalar;
      }
    }

    return result;
  }

  /**
   * Multiplies two matrices according to the rules of matrix product. The number of columns of a must be equal to the number of rows of b.
   * @param {Matrix} a - First matrix object.
   * @param {Matrix} b - Second matrix object.
   * @returns {Matrix} result - The resultant matrix having number of rows equal to a and number of columns equal to b.
   * @static
   */
  static matrixProduct(a, b) {
    if (!(a instanceof Matrix && b instanceof Matrix)) {
      throw new MatrixTypeError("matrixProduct", "Matrix and Matrix");
    }
    if (a.cols !== b.rows) {
      throw new Error("Invalid matrix dimensions in matrixProduct, cols of a must be equal to rows of b");
    }

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
  }

  static transpose(matrix) {
    if (!(matrix instanceof Matrix)) {
      throw new MatrixTypeError("transpose", "Matrix");
    }
    let result = new Matrix(matrix.cols, matrix.rows);

    for (let i = 0; i < matrix.rows; i++) {
      for (let j = 0; j < matrix.cols; j++) {
        result.matrix[j][i] = matrix.matrix[i][j];
      }
    }

    return result;
  }
}

var errors = require("./Errors.js");
var MatrixTypeError = errors.MatrixTypeError;
var DimensionError = errors.DimensionError;

if (typeof module !== "undefined") {
  module.exports = Matrix;
}
