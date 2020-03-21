class LineGraph {
  constructor(xScale, yScale, xGridSize, yGridSize) {
    //variable to hold canvas element
    let myCanvas = document.createElement("canvas");

    //height and width of canvas
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    //setting properties of canvas
    myCanvas.setAttribute("class", "myCanvas");
    myCanvas.setAttribute("width", this.width);
    myCanvas.setAttribute("height", this.height);

    //hiding scrollbars
    document.body.style.margin = 0;
    document.body.style.overflow = "hidden";

    //get context of canvas to draw with
    this.ctx = myCanvas.getContext("2d");

    //margin of canvas
    this.margin = this.width / 34;

    //Scaling Factors ------ Datanumbers per unit (box)
    this.xScale = xScale;
    this.yScale = yScale;

    //Size of grid boxes in pixels (pixels per unit)
    if (xGridSize) {
      this.xGridSize = xGridSize;
    } else {
      //default value - display 10 grid boxes
      this.xGridSize = (this.width - 2 * this.margin) / 10;
    }
    if (xGridSize) {
      this.yGridSize = yGridSize;
    } else {
      //default value - display 10 grid boxes
      this.yGridSize = (this.height - 2 * this.margin) / 10;
    }

    //Set min gridSize
    if (this.xGridSize < 10) {
      this.xGridSize = 10;
    }
    if (this.yGridSize < 10) {
      this.yGridSize = 10;
    }

    //Calculate pixel per data
    this.xPixelScale = this.xGridSize / this.xScale;
    this.yPixelScale = this.yGridSize / this.yScale;

    //array to hold data ------- data is an array of objects {x: ____ , y: ______}
    this.data = [];

    //radius of points
    this.pointRadius = 3;

    //Background Color
    this.colorBG = "rgb(0,0,0)";

    //Color of axes
    this.colorAxes = "rgb(255,0,0)";

    //Color of ticks
    this.colorTicks = "rgb(255,255,255)";

    //Color of grid lines
    this.colorGridLines = "rgba(128,128,128,0.5)";

    //Color of data points
    this.colorPoints = "rgb(0,0,255)";

    //Color of line graph
    this.colorLines = "rgb(255,255,255)";

    //Font of ticks
    this.fontTicks = "14px Arial";

    //Line Width of axes
    this.widthAxes = 4;

    //default line width
    this.widthDefault = 1;

    //adding canvas to body
    document.body.appendChild(myCanvas);

    this.drawStuff();
  }

  addData(xData, yData, optimizedUpdate) {
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

    if (optimizedUpdate) {
      this.ctx.fillStyle = this.colorBG;

      if (insertedPosition != 0 && insertedPosition != this.data.length - 1) {
        let prevX = this.data[insertedPosition - 1].x;
        let nextX = this.data[insertedPosition + 1].x;

        let w = (nextX - prevX) * this.xPixelScale;

        this.ctx.fillRect(
          this.getXPixel(prevX),
          this.margin,
          w,
          this.height - 2 * this.margin
        );
      }

      this.drawGridLines();

      this.ctx.strokeStyle = this.colorLines;

      let currentPixelX = this.getXPixel(xData);
      let currentPixelY = this.getYPixel(yData);

      if (insertedPosition != 0) {
        let prevData = this.data[insertedPosition - 1];

        let pixelX = this.getXPixel(prevData.x);
        let pixelY = this.getYPixel(prevData.y);

        this.ctx.strokeStyle = this.colorLines;
        this.drawLine(pixelX, pixelY, currentPixelX, currentPixelY);

        this.ctx.fillStyle = this.colorPoints;
        this.fillPoint(pixelX, pixelY);
      }

      if (insertedPosition != this.data.length - 1) {
        let nextData = this.data[insertedPosition + 1];

        let pixelX = this.getXPixel(nextData.x);
        let pixelY = this.getYPixel(nextData.y);

        this.ctx.strokeStyle = this.colorLines;
        this.drawLine(currentPixelX, currentPixelY, pixelX, pixelY);

        this.ctx.fillStyle = this.colorPoints;
        this.fillPoint(pixelX, pixelY);
      }

      this.ctx.fillStyle = this.colorPoints;
      this.fillPoint(currentPixelX, currentPixelY);
    }
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

  update() {
    this.drawStuff();

    let pixelX = null;
    let pixelY = null;

    for (let i = 0; i < this.data.length; i++) {
      const dataPoint = this.data[i];

      let newPixelX = this.getXPixel(dataPoint.x);
      let newPixelY = this.getYPixel(dataPoint.y);

      if (pixelX != null && pixelY != null) {
        this.ctx.strokeStyle = this.colorLines;
        this.drawLine(pixelX, pixelY, newPixelX, newPixelY);
      }

      pixelX = newPixelX;
      pixelY = newPixelY;

      this.ctx.fillStyle = this.colorPoints;
      this.fillPoint(pixelX, pixelY);
    }
  }

  drawStuff() {
    this.drawBackground();
    this.drawAxes();
    this.drawGridLines();
  }

  drawBackground() {
    this.ctx.fillStyle = this.colorBG;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawAxes() {
    this.ctx.strokeStyle = this.colorAxes;
    this.ctx.lineWidth = this.widthAxes;
    this.ctx.beginPath();
    this.ctx.moveTo(this.margin, this.margin);
    this.ctx.lineTo(this.margin, this.height - this.margin);
    this.ctx.lineTo(this.width - this.margin, this.height - this.margin);
    this.ctx.stroke();
    this.ctx.lineWidth = this.widthDefault;
  }

  drawGridLines() {
    this.ctx.font = this.fontTicks;
    this.ctx.fillStyle = this.colorTicks;
    this.ctx.strokeStyle = this.colorGridLines;

    this.ctx.fillText(
      (0).toFixed(2),
      this.margin - 18,
      this.height - this.margin + 20
    );
    this.ctx.fillText(
      (0).toFixed(2),
      this.margin - 40,
      this.height - this.margin
    );

    for (let i = 1; i < (this.width - 2 * this.margin) / this.xGridSize; i++) {
      let currX = this.margin + i * this.xGridSize;
      let currY = this.height - this.margin;
      this.ctx.fillText((i * this.xScale).toFixed(2), currX - 18, currY + 20);
      this.drawLine(currX, currY, currX, this.margin);
    }

    for (let i = 1; i < (this.height - 2 * this.margin) / this.yGridSize; i++) {
      let currX = this.margin;
      let currY = this.height - (this.margin + i * this.yGridSize);
      this.ctx.fillText((i * this.yScale).toFixed(2), currX - 40, currY + 5);
      this.drawLine(currX, currY, this.width - this.margin, currY);
    }
  }

  drawLine(x1, y1, x2, y2) {
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  drawPoint(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    this.ctx.stroke();
  }

  fillPoint(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, this.pointRadius, 0, 2 * Math.PI);
    this.ctx.fill();
  }

  getXPixel(xData) {
    return xData * this.xPixelScale + this.margin;
  }

  getYPixel(yData) {
    return this.height - (yData * this.yPixelScale + this.margin);
  }
}
