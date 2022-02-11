
(function () {
    /**
     * Es el contructor del objeto tablero de juego
     * @param {int} width Ancho del tablero
     * @param {int} heigth Alto del tablero
     */
    self.Board = function (width, heigth) {
        this.width = width;
        this.heigth = heigth;
        this.playing = false;
        this.game_over = false;
        this.bars = [];
        this.ball = null;
        this.playing = false;
    }
    /**
     * Guarda los elementos de juego
     */
    self.Board.prototype = {
        get elements() {
            var elements = this.bars.map(function (bar) {
                return bar
            });
            elements.push(this.ball);
            return elements;
        }
    }

})();

(function () {
    /**
     * Se crea el objeto pelota
     * @param {int} x Posición eje x en el tablero
     * @param {int} y Posición eje y en el tablero
     * @param {int} radius Tamaño de la pelora
     * @param {objeto} board Tablero de juego
     */
    self.Ball = function (x, y, radius, board) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed_y = 0;
        this.speed_x = 3;
        this.board = board;
        this.direction = 1;
        this.bounce_angle = 0;
        this.max_bounce_angle = Math.PI/12;
        this.speed = 3;

        board.ball = this;
        this.kind = "circle";
    }
    self.Ball.prototype = {
        /**
         * Permite modificar la dirección de la pelota
         */
        move: function () {
            this.x += (this.speed_x * this.direction);
            this.y += (this.speed_y);
        },
        get width(){
            return this.radius * 2;
        },
        get height(){
            return this.radius * 2;
        },
        /**
         * Calcula el rebote de la pelota después de colisionar con las barras
         * @param {objeto} bar Barra de juego
         */
        collision: function (bar) {
            var relative_intersect_y = (bar.y + (bar.height / 2)) - this.y;

            var normalized_intersect_y = relative_intersect_y / (bar.height / 2);

            this.bounce_angle = normalized_intersect_y * this.max_bounce_angle;

            this.speed_y = this.speed * -Math.sin(this.bounce_angle);
            this.speed_x = this.speed * Math.cos(this.bounce_angle);

            if (this.x > (this.board.width / 2)) {
                this.direction = -1;
            } else {
                this.direction = 1;
            }
        }
    }
})();

(function () {
    /**
     * Crea la barra de juego
     * @param {int} x Posición eje x
     * @param {int} y Posición eje y
     * @param {int} width Tamaño ancho
     * @param {int} height Tamaño alto
     * @param {objeto} board Tablero de juego
     */
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
    /**
     * Métodos que brindan la capacidad de mover las barras en el eje y del tablero
     */
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
    /**
     * Dibuja el tablero de juego en la pantalla
     * @param {objeto html} canvas Objeto dentro del html que permite rederizar
     * @param {objeto} board Tablero de juego
     */
    self.BoardView = function (canvas, board) {
        this.canvas = canvas;
        this.canvas.width = board.width;
        this.canvas.height = board.heigth;
        this.board = board;
        this.ctx = canvas.getContext("2d");
    }


    self.BoardView.prototype = {
        /**
         * Borra el tablero
         */
        clean: function () {
            this.ctx.clearRect(0, 0, this.board.width, this.board.heigth)
        },
        /**
         * Dibuja el tablero
         */
        draw: function () {
            for (let i = this.board.elements.length - 1; i >= 0; i--) {
                var el = this.board.elements[i];

                draw(this.ctx, el)
            }
        },
        /**
         * Verfica las colisiones
         */
        check_collisions: function () {
            for (let i = this.board.bars.length -1; i >= 0; i--) {
                var bar = this.board.bars[i];
                if (hit(bar, this.board.ball)) {
                    this.board.ball.collision(bar);
                }
            }
        },
        play: function () {
            if (this.board.playing) {
                this.clean();
                this.draw();
                this.check_collisions();
                this.board.ball.move();
            }
        }
    }
    /**
     * Si hay una colisión entre los dos objetos cambia hit a true
     * @param {objeto} a Barras de juego
     * @param {objeto} b Pelota de juego
     * @returns boolean
     */
    function hit(a, b) {
        var hit = false;

        if (b.x + b.width >= a.x && b.x < a.x + a.width) {
            if (b.y + b.height >= a.y && b.y < a.y + a.height) {
                hit = true;
            }
        }

        if (b.x <= a.x && b.x + b.width >= a.x + a.width) {
            if (b.y <= a.y && b.y + b.height >= a.y + a.height) {
                hit = true;
            }
        }

        if (a.x <= b.x && a.x + a.width >= b.x + b.width) {
            if (a.y <= b.y && a.y + a.height >= b.y + b.height) {
                hit = true;
            }
        }
        return hit;
    }
    /**
     * Renderiza en pantalla un objeto
     * @param {propiedad canvas} ctx específica el método de renderizado
     * @param {objeto} element objeto que se quiere dibujar en pantalla
     */
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
var ball = new Ball(350, 100, 10, board);

/**
 * Escucha las teclas que se presionan y asigna una acción determinada a algunas de ellas
 */
document.addEventListener('keydown', function (ev) {
    if (ev.key == 'ArrowUp') {
        ev.preventDefault();
        bar2.up();
    } else if (ev.key == 'ArrowDown') {
        ev.preventDefault();
        bar2.down();
    } else if (ev.key == 'w') {
        ev.preventDefault();
        bar.up();
    } else if (ev.key == 's') {
        ev.preventDefault();
        bar.down();
    } else if (ev.key == 'p') {
        ev.preventDefault();
        board.playing = !board.playing;
    }
})
board_view.draw();
window.requestAnimationFrame(controller);

/**
 * Renderiza todo el juego en pantalla y sus funcionalidades, se autoejecuta a sí mismo
 */
function controller() {
    board_view.play();
    window.requestAnimationFrame(controller);
}
