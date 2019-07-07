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
        this.ctx = myCanvas.getContext('2d');

        //draw background
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        //draw axes
        this.ctx.strokeStyle = "rgb(255,255,255)";
        this.ctx.beginPath();
        this.ctx.moveTo(this.margin, this.margin);
        this.ctx.lineTo(this.margin, this.height - this.margin);
        this.ctx.lineTo(this.width - this.margin, this.height - this.margin);
        this.ctx.stroke();

    }

    addData(xData, yData) {

        this.data.push({
            x: xData,
            y: yData
        });

    }

    update() {

        let pixelX = null;
        let pixelY = null;

        this.data.sort(function (a, b) {
            return (a.x - b.x);
        });

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