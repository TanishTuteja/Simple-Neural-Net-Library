class Snake {
  constructor(gameSize, gridNum) {
    let self = this;

    this.alive = true;

    this.gameSize = gameSize;
    this.gridNum = gridNum;
    this.gridSize = gameSize / gridNum;

    this.noRender = false;

    this.snake = [{ x: Math.floor(gridNum / 2), y: Math.floor(gridNum / 2) }];
    this.snakeVel = { x: 0, y: -1 };

    this.generateFood();

    this.updateTime = 200;

    let myCanvas = document.createElement("canvas");

    //height and width of canvas
    this.width = this.gameSize + 2 * this.gridSize;
    this.height = this.gameSize + 2 * this.gridSize;

    //setting properties of canvas
    myCanvas.setAttribute("class", "myCanvas");
    myCanvas.setAttribute("width", this.width);
    myCanvas.setAttribute("height", this.height);

    document.body.style.margin = 0;

    //get context of canvas to draw with
    this.ctx = myCanvas.getContext("2d");

    //adding canvas to body
    document.body.appendChild(myCanvas);

    if (!this.noRender) {
      this.drawWalls();
      this.render();
    }

    document.onkeydown = function checkKey(e) {
      e = e || window.event;

      switch (e.keyCode) {
        case 38:
          self.doAction(0);
          break;
        case 40:
          self.doAction(1);
          break;
        case 37:
          self.doAction(2);
          break;
        case 39:
          self.doAction(3);
          break;
      }
    };
  }

  update() {
    if (this.alive) {
      let temp = {
        x: this.snake[this.snake.length - 1].x,
        y: this.snake[this.snake.length - 1].y
      };
      let newHead = {
        x: this.snake[0].x + this.snakeVel.x,
        y: this.snake[0].y + this.snakeVel.y
      };

      let collided = false;

      for (let i = this.snake.length - 1; i > 0; i--) {
        this.snake[i].x = this.snake[i - 1].x;
        this.snake[i].y = this.snake[i - 1].y;
        if (newHead.x == this.snake[i].x && newHead.y == this.snake[i].y) {
          collided = true;
        }
      }

      this.snake[0].x += this.snakeVel.x;
      this.snake[0].y += this.snakeVel.y;

      if (!collided) {
        collided = this.checkCollisions();
      }

      this.alive = !collided;

      let gotFood = this.checkFood(temp);

      if (!this.noRender) {
        this.render();
      }
    }
  }

  render() {
    this.drawBG();
    this.drawSnake();
    this.drawFood();
  }

  checkCollisions() {
    let head = this.snake[0];

    if (
      head.x < 0 ||
      head.x >= this.gridNum ||
      head.y < 0 ||
      head.y >= this.gridNum
    ) {
      return true;
    } else {
      return false;
    }
  }

  checkFood(temp) {
    let head = this.snake[0];

    if (head.x == this.food.x && head.y == this.food.y) {
      this.snake.push({ x: temp.x, y: temp.y });
      this.generateFood();
      return true;
    } else {
      return false;
    }
  }

  generateFood() {
    let approved;
    let x, y;
    do {
      approved = true;

      x = Math.floor(Math.random() * this.gridNum);
      y = Math.floor(Math.random() * this.gridNum);

      for (let i = 0; i < this.snake.length; i++) {
        const currPart = this.snake[i];
        if (currPart.x == x && currPart.y == y) {
          approved = false;
          break;
        }
      }
    } while (!approved);

    this.food = { x: x, y: y };
  }

  drawWalls() {
    this.ctx.fillStyle = "rgb(255,0,0)";
    this.ctx.fillRect(0, 0, (this.gridNum + 2) * this.gridSize, this.gridSize);
    this.ctx.fillRect(
      0,
      this.gridSize,
      this.gridSize,
      this.gridNum * this.gridSize
    );
    this.ctx.fillRect(
      (this.gridNum + 1) * this.gridSize,
      this.gridSize,
      this.gridSize,
      this.gridNum * this.gridSize
    );
    this.ctx.fillRect(
      0,
      (this.gridNum + 1) * this.gridSize,
      (this.gridNum + 2) * this.gridSize,
      this.gridSize
    );
  }

  drawBG() {
    this.ctx.fillStyle = "rgb(0,0,0)";
    this.ctx.fillRect(
      this.gridSize,
      this.gridSize,
      this.gameSize,
      this.gameSize
    );
  }

  drawSnake() {
    this.ctx.fillStyle = "rgb(255,255,255)";
    for (let i = 0; i < this.snake.length; i++) {
      const currPart = this.snake[i];
      this.ctx.fillRect(
        currPart.x * this.gridSize + this.gridSize,
        currPart.y * this.gridSize + this.gridSize,
        this.gridSize,
        this.gridSize
      );
    }
  }

  drawFood() {
    this.ctx.fillStyle = "rgb(0,0,255)";
    this.ctx.fillRect(
      this.food.x * this.gridSize + this.gridSize,
      this.food.y * this.gridSize + this.gridSize,
      this.gridSize,
      this.gridSize
    );
  }

  doAction(action) {
    switch (action) {
      case 0:
        this.snakeVel = { x: 0, y: -1 };
        break;
      case 1:
        this.snakeVel = { x: 0, y: 1 };
        break;
      case 2:
        this.snakeVel = { x: -1, y: 0 };
        break;
      case 3:
        this.snakeVel = { x: 1, y: 0 };
        break;
    }
  }
}
