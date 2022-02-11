(function () {
    self.Board = function (width, heigth) {
        this.width = width;
        this.heigth = heigth;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
    }

    self.Board.prototype = {
        get elements() {
            var elements = this.bars;
            // elements.push(this.ball);
            return elements;
        }
    }

})();

(function() {
    self.Ball = function(x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;

        board.ball = this;
        this.kind = "circle";
    }
})();

(function () {
    self.Bar = function (x, y, width, height, board) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.board = board;
        this.board.bars.push(this);
        this.kind = "rectangle";
        this.speed = 20;
    }

    self.Bar.prototype = {
        down: function () {
            this.y += this.speed;
        },
        up: function () {
            this.y -= this.speed;
        },
        toString: function () {
            return "x: " + this.x + " y:" + this.y;
        }
    }
})();

(function () {
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.heigth;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }


    self.BoardView.prototype = {
        clean: function () {
            console.log(":p");
            this.ctx.clearRect(0, 0, this.board.width, this.board.heigth)
        },
        draw: function () {
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el)
            }
        },
        play: function () {
            this.clean();
            this.draw();
        }
    }

    function draw(ctx, element) {
        switch (element.kind) {
            case "rectangle":
                ctx.fillRect(element.x, element.y, element.width, element.height);
                break;
            case "circle":
                ctx.beginPath();
                ctx.arc(element.x, element.y, element.radius, 0, 7);
                ctx.fill();
                ctx.closePath();
                break;
        }
    }
})();

var board = new Board(800, 400);
var bar = new Bar(20, 100, 40, 100, board);
var bar2 = new Bar(700, 100, 40, 100, board);
var canvas = document.getElementById('canvas');
var board_view = new BoardView(canvas, board);
// var ball = new Ball(350, 100, 10, board);

document.addEventListener('keydown', function (ev) {
    ev.preventDefault();
    if (ev.key == 'ArrowUp') {
        bar2.up();
    } else if (ev.key == 'ArrowDown') {
        bar2.down();
    } else if (ev.key == 'w') {
        bar.up();
    } else if (ev.key == 's') {
        bar.down();
    }
})
//self.addEventListener("load", main());
window.requestAnimationFrame(controller);

function controller() {
    board_view.play();
    // board_view.clean();
    // board_view.draw();
    window.requestAnimationFrame(controller);
}
