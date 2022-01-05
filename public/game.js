const socket = io();

const ctx = canvas.getContext('2d');
let players = [];

let scaled_size = 32;// Zoom/definition de la MAP
let sprite_size = 16;// The actual size of sprites / tiles in the tile_sheet image

function drawPlayers() {
  let x_min = Math.floor(viewport.x / scaled_size);
  let y_min = Math.floor(viewport.y / scaled_size);
  let x_max = Math.ceil((viewport.x + viewport.w) / scaled_size);
  let y_max = Math.ceil((viewport.y + viewport.h) / scaled_size);
  players.forEach(function ({ x, y, size, c }) {
    let playerPosX = Math.floor( ( x ) / scaled_size + ( scaled_size / columns)) ;
    let playerPosY = Math.floor( (y ) / scaled_size + ( scaled_size / rows + 1));
    if((playerPosX < x_max && playerPosY < y_max && playerPosX > x_min && playerPosY > y_min)){
      ctx.drawImage(tile_sheet, 64, 0, sprite_size, sprite_size, Math.round(x - viewport.x + width * 0.5 - viewport.w * 0.5), Math.round(y - viewport.y + height * 0.5 - viewport.h * 0.5), scaled_size, scaled_size);
    }
  })
}

const Player = function (x, y) {
  this.x = x;
  this.y = y;
  this.speed = 1;
};

/*
Player.prototype = {
  moveTo: function (x, y) {
    // Gradually moves the player closer to x, y every time moveTo is called. 
    this.x += (x - this.x - scaled_size * 0.5) * 0.05;
    this.y += (y - this.y - scaled_size * 0.5) * 0.05;
  }
};
*/

const Viewport = function (x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
};

Viewport.prototype = {
  scrollTo: function (x, y) {
    // Rigid scrolling
    this.x = x - this.w * 0.5;
    this.y = y - this.w * 0.5;
    // Smooth scrolling (forgot to put this in the video)
    //this.x += (x - this.x - this.w * 0.5) * 0.05;
    //this.y += (y - this.y - this.h * 0.5) * 0.05;
  }
};


let viewport = new Viewport(200, 200, 500, 500);
let player = new Player(32, 32);


let height = document.documentElement.clientHeight;
let width = document.documentElement.clientWidth;

let columns = 24;
let rows = 44;

let map = [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 2, 1, 1, 0, 0, 3, 3, 3, 2, 1, 0, 3, 0, 0, 0, 3, 0, 0, 1, 2, 2, 2, 3,
            3, 1, 1, 0, 0, 0, 3, 3, 3, 1, 0, 0, 3, 0, 2, 0, 3, 0, 1, 1, 2, 1, 1, 3,
            3, 0, 0, 0, 0, 0, 3, 3, 2, 0, 0, 0, 3, 0, 0, 0, 3, 1, 2, 2, 2, 1, 1, 3,
            3, 1, 1, 0, 0, 0, 3, 1, 1, 0, 0, 0, 3, 3, 3, 0, 1, 1, 2, 2, 1, 0, 0, 3,
            3, 0, 0, 1, 2, 1, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 3,
            3, 0, 1, 2, 2, 1, 3, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 3,
            3, 0, 0, 1, 1, 1, 3, 1, 1, 1, 0, 1, 0, 0, 0, 3, 0, 0, 3, 3, 3, 0, 0, 3,
            3, 0, 0, 0, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 3, 3, 3, 3, 3, 3,
            3, 3, 0, 3, 3, 3, 3, 3, 3, 3, 3, 1, 0, 0, 0, 3, 0, 0, 3, 3, 3, 2, 1, 3,
            3, 3, 1, 0, 0, 1, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 3,
            3, 3, 3, 3, 1, 1, 3, 3, 3, 3, 3, 1, 0, 0, 0, 0, 1, 1, 2, 2, 1, 0, 0, 3,
            3, 3, 3, 3, 0, 1, 0, 0, 3, 3, 1, 0, 0, 1, 1, 2, 1, 2, 0, 1, 2, 1, 0, 3,
            3, 2, 3, 0, 0, 0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 2, 1, 2, 2, 1, 2, 1, 1, 3,
            3, 1, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 2, 1, 1, 1, 2, 0, 1, 3,
            3, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 0, 0, 0, 1, 1, 1, 2, 2, 2, 1, 1, 2, 3,
            3, 0, 0, 0, 1, 0, 1, 1, 3, 3, 1, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 3,
            3, 1, 1, 0, 0, 0, 0, 3, 3, 3, 1, 1, 2, 2, 0, 0, 3, 3, 3, 3, 3, 3, 3, 3,
            3, 0, 1, 0, 1, 0, 1, 3, 3, 3, 3, 2, 2, 2, 2, 1, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 1, 0, 0, 0, 1, 3, 3, 3, 2, 1, 0, 1, 2, 0, 1, 0, 0, 0, 1, 1, 0, 0, 3,
            3, 2, 0, 0, 0, 0, 3, 3, 3, 3, 1, 1, 0, 1, 1, 0, 3, 0, 1, 2, 2, 1, 0, 3,
            3, 3, 1, 0, 1, 1, 3, 3, 3, 3, 3, 3, 0, 0, 1, 1, 3, 0, 0, 1, 1, 0, 0, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3, 3, 1, 0, 1, 2, 3, 1, 0, 0, 0, 0, 1, 3,
            3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3];

function listToMatrix(list, elementsPerSubArray) {
  let matrix = [], i, k;

  for (i = 0, k = -1; i < list.length; i++) {
      if (i % elementsPerSubArray === 0) {
          k++;
          matrix[k] = [];
      }

      matrix[k].push(list[i]);
  }

  return matrix;
}

let mat = listToMatrix(map, columns);

console.log(mat);

let tile_sheet = new Image();
tile_sheet.addEventListener("load", (event) => { update(); });
tile_sheet.src = "tile-scroll.png";

function drawMap() {
  height = document.documentElement.clientHeight;
  width = document.documentElement.clientWidth;

  /* Resize canvas on every frame */
  ctx.canvas.height = height;
  ctx.canvas.width = width;

  ctx.imageSmoothingEnabled = false;// prevent antialiasing of drawn image

  viewport.scrollTo(player.x, player.y);

  /* Obtenez la colonne et la ligne min et max de la carte à dessiner. Pour la colonne et la ligne min
  colonne et la ligne (x et y), nous utilisons floor pour arrondir vers le bas et pour le max, nous utilisons ceil pour arrondir vers le haut.
  et pour le maximum, nous utilisons ceil pour arrondir. Nous voulons obtenir les rangées et les colonnes sous les frontières
  du rectangle de la fenêtre. Ceci est visualisé par le carré blanc dans l'exemple. */
  let x_min = Math.floor(viewport.x / scaled_size);
  let y_min = Math.floor(viewport.y / scaled_size);
  let x_max = Math.ceil((viewport.x + viewport.w) / scaled_size);
  let y_max = Math.ceil((viewport.y + viewport.h) / scaled_size);

  /* les valeurs min et max de la colonne et de la ligne ne peuvent pas dépasser les limites
  de la carte. Ces valeurs sont 0 et le nombre de colonnes et de lignes de la carte. */
  if (x_min < 0) x_min = 0;
  if (y_min < 0) y_min = 0;
  if (x_max > columns) x_max = columns;
  if (y_max > rows) y_max = rows;

  /* Maintenant, nous parcourons en boucle les tuiles de la carte, mais seulement entre les colonnes et les rangées min.
  et max des colonnes et lignes sur lesquelles se trouve la fenêtre d'affichage. Pour ce faire, nous utilisons deux boucles
  for, une pour les colonnes (x) et une pour les rangées (y) de la carte. */
  for (let x = x_min; x < x_max; x++) {
    for (let y = y_min; y < y_max; y++) {
      let value = map[y * columns + x];// Tile value
      let tile_x = Math.floor(x * scaled_size - viewport.x + width * 0.5 - viewport.w * 0.5);// Tile x destination for drawing
      let tile_y = Math.floor(y * scaled_size - viewport.y + height * 0.5 - viewport.h * 0.5);// Tile y destination for drawing
      // Draw tile from tile_sheet
      ctx.drawImage(tile_sheet, value * sprite_size, 0, sprite_size, sprite_size, tile_x, tile_y, scaled_size, scaled_size);
    }
  }
}

//Loop draw, call 60 times per second
function update(time) {
  requestAnimationFrame(update); //notifie le navigateur que vous souhaitez exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation
 /* let dt = (time - lastUpdate) / 1000;

  if(dt < (1 / 60) - 0.001){
    return
  }
  lastUpdate = time;*/


  movePlayer();
  drawMap();
  drawBorderCanvas()
  drawPlayers();
}

//First call
requestAnimationFrame(update);


// ------ KEYBOARD ------ 
const keyboard = {};

window.onkeydown = function (e) {
  keyboard[e.key] = true;
};

window.onkeyup = function (e) {
  delete keyboard[e.key];
};

//Function move Player
function movePlayer() {
  if (keyboard['ArrowLeft'] || keyboard['q']) {
    if(canMove('left')){
      player.x -= player.speed; // left
      socket.emit('move left');
    }
  }
  if (keyboard['ArrowUp'] || keyboard['z']) {
    if(canMove('up')){
      player.y -= player.speed; // up
      socket.emit('move up');
    }
  }
  if (keyboard['ArrowRight'] || keyboard['d']) {
    if(canMove('right')){
      player.x += player.speed; // right
      socket.emit('move right');
    }
  }
  if (keyboard['ArrowDown'] || keyboard['s']) {
    if(canMove('down')){
      player.y += player.speed; // down
      socket.emit('move down');
    }
  }
}

function canMove(direction){
  let playerPosX;
  let playerPosY;
  switch (direction) {
    case "left":
      playerPosX = Math.floor((player.x + scaled_size * 0.8) / scaled_size + ( scaled_size / columns - 1));
      playerPosY = Math.floor( (player.y ) / scaled_size + ( scaled_size / rows));
      if((mat[playerPosY][playerPosX-1]) == 3) return false;
      return true;
    case "up":
      playerPosX = Math.floor( ( player.x ) / scaled_size + ( scaled_size / columns - 1)) ;
      playerPosY = Math.floor((player.y + scaled_size * 0.6) / scaled_size + ( scaled_size / rows));
      if((mat[playerPosY-1][playerPosX]) == 3) return false;
      return true;
    case "right":
      playerPosX = Math.floor((player.x - scaled_size * 0.4) / scaled_size + ( scaled_size / columns - 1));
      playerPosY = Math.floor( (player.y ) / scaled_size + ( scaled_size / rows));
      if((mat[playerPosY][playerPosX+1]) == 3) return false;
      return true;
    case "down":
      playerPosX = Math.floor( ( player.x ) / scaled_size + ( scaled_size / columns - 1)) ;
      playerPosY = Math.floor((player.y - scaled_size * 0.5) / scaled_size + ( scaled_size / rows));
      if((mat[playerPosY+1][playerPosX]) == 3) return false;
      return true;
    default:
      return false;
  }
}

function drawBorderCanvas() {
  /* Dessinez le rectangle de la fenêtre d'affichage. */
  ctx.strokeStyle = "#ffffff";
  ctx.rect(width * 0.5 - viewport.w * 0.5, height * 0.5 - viewport.h * 0.5, viewport.w, viewport.h);
  ctx.stroke();
}

//Écoutez l'événement players list et mettez à jour la liste des joueurs à chaque fois qu'il survient. 
socket.on('players list', function (list) {
  players = list;
})
