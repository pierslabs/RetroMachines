class juego {
  constructor() {
    // ATRIBUTOS
    this.attr = {
      width: 1000,
      height: 600,
      map: "circuitotornillos.png",
      x: 0,
      y: 0,
    };

    this.colors = {
      background: { r: 237, g: 28, b: 36 },
      oil: { r: 0, g: 0, b: 0 },
      glue: { r: 255, g: 255, b: 255 },
      crash: { r: 63, g: 72, b: 204 },
      lap: { r: 63, g: 210, b: 0 },
    };

    this.car = {
      speed: 15,
      x: -2800,
      y: -3000,
      numLap: 0,
      direction: "top", //arriba, abajo, derecha, izquierda, arriba-izquierda...
      sprite: {
        top: { x: 0, y: 0, width: 300, height: 300 },
        top_right: { x: 300, y: 0, width: 310, height: 295 },
        right: { x: 595, y: 0, width: 300, height: 300 },
        down_right: { x: 900, y: 0, width: 300, height: 330 },
        down: { x: 1200, y: 0, width: 292, height: 300 },
        down_left: { x: 1500, y: 0, width: 300, height: 300 },
        left: { x: 1900, y: 0, width: 300, height: 300 },
        top_left: { x: 2210, y: 0, width: 300, height: 300 },
      },
    };

    // CARGAR
    this.loading = 3;

    // Canvas 1
    this.map = document.getElementById("canvas1");
    this.map.width = this.attr.width;
    this.map.height = this.attr.height;
    this.mapcnx = this.map.getContext("2d");
    this.circuito = new Image();
    this.circuito.src = "img/" + this.attr.map;
    this.circuito.addEventListener("load", () => {
      this.loading--;
    });

    // Canvas 2
    this.map2 = document.getElementById("canvas2");
    this.map2.width = this.attr.width;
    this.map2.height = this.attr.height;
    this.mapcnx2 = this.map2.getContext("2d");
    this.map_circuito = new Image();
    this.map_circuito.src = "img/map_" + this.attr.map;
    this.map_circuito.crossOrigin = "Anonymous";
    this.map_circuito.addEventListener("load", () => {
      this.loading--;
    });

    // Coche
    this.coche = new Image();
    this.coche.src = "img/cocheverde.png";
    this.coche.addEventListener("load", () => {
      this.loading--;
    });

    this.interval = setInterval(() => this.render(), this.car.speed);
  }

  render() {
    // Comprobamos que esté cargado todo
    if (this.loading > 0) {
      return;
    }
    var next = this.siguintePaso();
    // Comprobamos crash
    switch (next) {
      case "oil":
        this.mueve_coche(3);
        this.car.y += 10;
        break;
      case "glue":
        this.mueve_coche(0.1);
        break;
      case "crash":
        this.crashParar();
        break;

      default:
        this.mueve_coche(1);
        break;
    }

    //  contador de vueltas
    this.vueltas = this.countLap();
    if (
      this.vueltas === true &&
      (this.car.direction == "top") |
        (this.car.direction == "top_left") |
        (this.car.direction == "top_right")
    ) {
      this.car.numLap++;
    }

    // Render
    // Carga mapa
    this.mapcnx.drawImage(this.circuito, this.car.x, this.car.y, 4592, 5270);
    this.mapcnx.fillStyle = "rgb(0, 51, 255)";
    this.mapcnx.fillRect(5, 5, 100, 35);
    this.mapcnx.fillStyle = "rgb(255, 214, 8)";
    this.mapcnx.font = "25px Verdana";
    this.mapcnx.fillText("Lap:" + this.car.numLap, 10, 30);
    // Carga mapeado
    this.mapcnx2.drawImage(
      this.map_circuito,
      this.car.x,
      this.car.y,
      4592,
      5270
    );
    // Carga coche
    this.pinta_coche();
    // this.phantom();
  }

  mueve_coche(multi) {
    // Realmente mueve el mapa...

    // 1º Saber la dirección del coche
    var cardir = this.car.direction;
    // 1.1º Sumar o restar al X e Y
    if (cardir == "top") {
      this.car.y += 6 * multi;
    }
    if (cardir == "top_right") {
      this.car.x -= 5 * multi;
      this.car.y += 5 * multi;
    }
    if (cardir == "right") {
      this.car.x -= 7 * multi;
    }
    if (cardir == "down_right") {
      this.car.x -= 5 * multi;
      this.car.y -= 5 * multi;
    }
    if (cardir == "down") {
      this.car.y -= 6 * multi;
    }
    if (cardir == "down_left") {
      this.car.x += 5 * multi;
      this.car.y -= 5 * multi;
    }
    if (cardir == "top_left") {
      this.car.x += 5 * multi;
      this.car.y += 5 * multi;
    }
    if (cardir == "left") {
      this.car.x += 7 * multi;
    }
  }

  pinta_coche() {
    this.mapcnx.drawImage(
      this.coche,
      this.car.sprite[this.car.direction].x,
      this.car.sprite[this.car.direction].y,
      this.car.sprite[this.car.direction].width,
      this.car.sprite[this.car.direction].height,
      490,
      330,
      25,
      25
    );
  }

  /**
	//  @return (string) "free", "crash", "oil", "glue"
	 */
  siguintePaso() {
    var dir = game.car.direction;
    var gmap2 = game.mapcnx2;
    // game.mapcnx.fillStyle="green";
    // game.mapcnx.fillRect(488,333, 2, 10)
    if (dir == "top") {
      var pixel = gmap2.getImageData(495, 330, 20, 1);
    }
    if (dir == "top_right") {
      var pixel = gmap2.getImageData(519, 330, 1, 12);
    }
    if (dir == "right") {
      var pixel = gmap2.getImageData(520, 336, 1, 20);
    }
    if (dir == "down_right") {
      var pixel = gmap2.getImageData(522, 348, 1, 10);
    }
    if (dir == "down") {
      var pixel = gmap2.getImageData(490, 360, 25, 1);
    }
    if (dir == "down_left") {
      var pixel = gmap2.getImageData(485, 365, 15, 1);
    }
    if (dir == "left") {
      var pixel = gmap2.getImageData(485, 375, 1, 10);
    }
    if (dir == "top_left") {
      var pixel = gmap2.getImageData(485, 325, 1, 15);
    }

    // RGBA 4
    // 25x2 = 50 pixeles x 4 canales = 200
    var paso = "ok";
    for (let i = 0; i < pixel.data.length; i = i + 4) {
      if (
        pixel.data[i] == game.colors.background.r &&
        pixel.data[i + 1] == game.colors.background.g &&
        pixel.data[i + 2] == game.colors.background.b
      ) {
        // Fondo todo OK
        paso = "ok";
      } else if (
        pixel.data[i] == game.colors.oil.r &&
        pixel.data[i + 1] == game.colors.oil.g &&
        pixel.data[i + 2] == game.colors.oil.b
      ) {
        // OIL
        paso = "oil";
      } else if (
        pixel.data[i] == game.colors.glue.r &&
        pixel.data[i + 1] == game.colors.glue.g &&
        pixel.data[i + 2] == game.colors.glue.b
      ) {
        // GLUE
        paso = "glue";
      } else if (
        pixel.data[i] == game.colors.crash.r &&
        pixel.data[i + 1] == game.colors.crash.g &&
        pixel.data[i + 2] == game.colors.crash.b
      ) {
        // CRASH
        paso = "crash";
      }
      return paso;
    }
  }

  crashParar() {
    if (this.car.direction == "top") {
      this.car.y -= 0;
    }
    if (this.car.direction == "top_right") {
      this.car.y -= 0;
      this.car.x += 0;
    }
    if (this.car.direction == "top_left") {
      this.car.y -= 0;
      this.car.x -= 0;
    }

    if (this.car.direction == "right") {
      this.car.x += 0;
    }
    if (this.car.direction == "left") {
      this.car.x -= 0;
    }
    if (this.car.direction == "down") {
      this.car.y += 0;
    }
    if (this.car.direction == "down_right") {
      this.car.y += 0;
      this.car.x += 0;
    }
    if (this.car.direction == "down_left") {
      this.car.y += 0;
      this.car.x -= 0;
    }
  }

  countLap() {
    var gmap2 = game.mapcnx2.getImageData(495, 330, 1, 1);
    if (
      gmap2.data[0] == game.colors.lap.r &&
      gmap2.data[1] == game.colors.lap.g &&
      gmap2.data[2] == game.colors.lap.b
    ) {
      return true;
    }
  }

  fullScreen() {
    document.getElementById("canvas1").requestFullscreen();
  }
}

class keyboard {
  constructor() {
    //onkeydown y onkeyup
    this.letters = {
      ArrowLeft: false,
      ArrowUp: false,
      ArrowRight: false,
      ArrowDown: false,
    };

    document.onkeydown = (e) => {
      // Detectamos cuál se ha pulsado y le metemos true
      this.letters[e.key] = true;
      this.save_position();
    };

    document.onkeyup = (e) => {
      // Detectamos cuál se ha pulsado y le metemos false
      this.letters[e.key] = false;
      this.save_position();
    };
  }

  save_position() {
    if (
      this.letters.ArrowUp &&
      !this.letters.ArrowDown &&
      this.letters.ArrowRight &&
      !this.letters.ArrowLeft
    ) {
      game.car.direction = "top_right";
    } else if (
      this.letters.ArrowUp &&
      !this.letters.ArrowDown &&
      !this.letters.ArrowRight &&
      this.letters.ArrowLeft
    ) {
      game.car.direction = "top_left";
    } else if (
      !this.letters.ArrowUp &&
      this.letters.ArrowDown &&
      this.letters.ArrowRight &&
      !this.letters.ArrowLeft
    ) {
      game.car.direction = "down_right";
    } else if (
      !this.letters.ArrowUp &&
      this.letters.ArrowDown &&
      !this.letters.ArrowRight &&
      this.letters.ArrowLeft
    ) {
      game.car.direction = "down_left";
    } else if (this.letters.ArrowUp) {
      game.car.direction = "top";
    } else if (this.letters.ArrowDown) {
      game.car.direction = "down";
    } else if (this.letters.ArrowLeft) {
      game.car.direction = "left";
    } else if (this.letters.ArrowRight) {
      game.car.direction = "right";
    }
  }
}

window.onload = function () {
  game = new juego();
  keyb = new keyboard();
};
