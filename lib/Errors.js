class DimensionError extends Error {
  constructor(isStatic, functionName, m1, m2) {
    let message = "Different Dimensions in " + functionName + ". ";
    let dim1 = m1.rows + "x" + m1.cols;
    let dim2 = m2.rows + "x" + m2.cols;

    if (isStatic) {
      message += "Dimensions of matrix 1 => " + dim1 + " while dimensions of matrix 2 => " + dim2;
    } else {
      message += "Dimensions of object => " + dim1 + " while dimensions of passed argument => " + dim2;
    }

    super(message);
  }
}

class MatrixTypeError extends Error {
  constructor(functionName, expectedType) {
    super("Invalid types in " + functionName + ", " + expectedType + " expected");
  }
}

exports.MatrixTypeError = MatrixTypeError;
exports.DimensionError = DimensionError;
