class Graph {
  constructor(xScale, yScale) {
    //variable to hold canvas element
    let myCanvas = document.createElement("canvas");

    //height and width of canvas
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //margin of canvas
    this.margin = 40;

    //array to hold data ------- data is an array of objects {x: ____ , y: ______}
    this.data = [];

    //radius of points
    this.pointRadius = 2;

    //Scaling Factors ------ Datanumbers per pixel
    this.xScale = xScale;
    this.yScale = yScale;

    //setting properties of canvas
    myCanvas.setAttribute("class", "myCanvas");
    myCanvas.setAttribute("width", this.width);
    myCanvas.setAttribute("height", this.height);

    //hiding scrollbars
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";

    //adding canvas to body
    document.body.appendChild(myCanvas);

    //get context of canvas to draw with
    this.ctx = myCanvas.getContext("2d");

    this.drawStuff();
  }

  addData(xData, yData) {
    let position = 0;

    while (position < this.data.length && this.data[position].x < xData) {
      position++;
    }

    let insertedPosition = position;

    let currentData = { x: xData, y: yData };

    while (position < this.data.length) {
      let temp = this.data[position];
      this.data[position] = currentData;
      currentData = temp;
      position++;
    }

    this.data[position] = currentData;

    this.ctx.fillStyle = "rgb(0, 0, 0)";

    if (insertedPosition != 0 && insertedPosition != this.data.length - 1) {
      let prevX = this.data[insertedPosition - 1].x;
      let nextX = this.data[insertedPosition + 1].x;

      let w = (nextX - prevX) / this.xScale;

      this.ctx.fillRect(
        this.margin + prevX / this.xScale,
        this.margin,
        w,
        this.height - 2 * this.margin
      );
    }

    let currentPixelX = xData / this.xScale + this.margin;
    let currentPixelY = this.height - (yData / this.yScale + this.margin);

    if (insertedPosition != 0) {
      let prevData = this.data[insertedPosition - 1];

      let pixelX = prevData.x / this.xScale + this.margin;
      let pixelY = this.height - (prevData.y / this.yScale + this.margin);

      this.ctx.beginPath();
      this.ctx.moveTo(pixelX, pixelY);
      this.ctx.lineTo(currentPixelX, currentPixelY);
      this.ctx.stroke();
    }

    if (insertedPosition != this.data.length - 1) {
      let nextData = this.data[insertedPosition + 1];

      let pixelX = nextData.x / this.xScale + this.margin;
      let pixelY = this.height - (nextData.y / this.yScale + this.margin);

      this.ctx.beginPath();
      this.ctx.moveTo(currentPixelX, currentPixelY);
      this.ctx.lineTo(pixelX, pixelY);
      this.ctx.stroke();
    }

    this.ctx.beginPath();
    this.ctx.arc(
      currentPixelX,
      currentPixelY,
      this.pointRadius,
      0,
      2 * Math.PI
    );
    this.ctx.stroke();
  }

  addDataArray(xData, yData) {
    if (xData.length != yData.length) {
      console.log(
        "Error! xData and yData contain different number of elements"
      );
    } else {
      for (let i = 0; i < xData.length; i++) {
        this.addData(xData[i], yData[i]);
      }
    }
  }

  drawStuff() {
    //draw background
    this.ctx.fillStyle = "rgb(0, 0, 0)";
    this.ctx.fillRect(0, 0, this.width, this.height);

    //draw axes
    this.ctx.strokeStyle = "rgb(255,255,255)";
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin, this.margin);
    this.ctx.lineTo(this.margin, this.height - this.margin);
    this.ctx.lineTo(this.width - this.margin, this.height - this.margin);
    this.ctx.stroke();

    let maxX = (this.width - 2 * this.margin) * this.xScale;
    let y = this.height - this.margin + 10;
    let pixelGap = 40;
    let incX = pixelGap * this.xScale;

    this.ctx.font = "20x Arial";
    this.ctx.fillStyle = "white";
    for (let i = 0; i < maxX; i += incX) {
      this.ctx.fillText(i.toFixed(2), this.margin + i / this.xScale, y);
    }

    let maxY = (this.height - 2 * this.margin) * this.yScale;
    let x = 0;
    let incY = pixelGap * this.yScale;

    this.ctx.font = "20x Arial";
    this.ctx.fillStyle = "white";
    for (let i = 0; i < maxY; i += incY) {
      this.ctx.fillText(
        i.toFixed(2),
        x,
        this.height - this.margin - i / this.yScale
      );
    }
  }

  update() {
    this.drawStuff();

    let pixelX = null;
    let pixelY = null;

    for (let i = 0; i < this.data.length; i++) {
      const dataPoint = this.data[i];

      let newPixelX = dataPoint.x / this.xScale + this.margin;
      let newPixelY = this.height - (dataPoint.y / this.yScale + this.margin);

      if (pixelX != null && pixelY != null) {
        this.ctx.beginPath();
        this.ctx.moveTo(pixelX, pixelY);
        this.ctx.lineTo(newPixelX, newPixelY);
        this.ctx.stroke();
      }

      pixelX = newPixelX;
      pixelY = newPixelY;

      this.ctx.beginPath();
      this.ctx.arc(pixelX, pixelY, this.pointRadius, 0, 2 * Math.PI);
      this.ctx.stroke();
    }
  }
}
