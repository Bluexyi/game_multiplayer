const socket = io();
/*
//Player variables
const player = {
    x: 0,
    y: 0,
    size: 20,
    speed: 5
};*/

//Player list
let players = [];

//The Game is draw in Canvas HTML element
const ctx = canvas.getContext('2d');

//Fonction draw all players (Carre de cotes size)
function drawPlayers() {
    players.forEach(function({x, y, size, c}) {
        ctx.beginPath(); //Creer un nouveau chemin
        ctx.rect(x, y, size, size); //Creer chemin en forme de rectangle
        ctx.fill(); //Remplit le chemin avec la couleur de fond en cours    
        let player_index = Math.floor((y + scaled_size * 0.5) / scaled_size) * columns + Math.floor((x + scaled_size * 0.5) / scaled_size);
        if (map[player_index] == 2) map[player_index] = 1;
        ctx.drawImage(tile_sheet, 64, 0, sprite_size, sprite_size, Math.round(x - viewport.x + width * 0.5 - viewport.w * 0.5), Math.round(y - viewport.y + height * 0.5 - viewport.h * 0.5), scaled_size, scaled_size);  
    })
    /*
    const {x, y, size} = player;
    ctx.beginPath(); //Creer un nouveau chemin
    ctx.rect(x, y, size, size); //Creer chemin en forme de rectangle
    ctx.fill(); //Remplit le chemin avec la couleur de fond en cours
    */   
}

function drawPlayer() {
    /* Ce bout de code récupère la position du joueur dans le monde en termes de colonnes et de lignes et la convertit en un index dans le tableau de la carte.
     colonnes et rangées et la convertit en un index dans le tableau de la carte */
    let player_index = Math.floor((player.y + scaled_size * 0.5) / scaled_size) * columns + Math.floor((player.x + scaled_size * 0.5) / scaled_size);

    /* Si le joueur se tient sur une tuile d'herbe, faites-en une tuile d'herbe courte. */
    if (map[player_index] == 2) map[player_index] = 1;

    /* Dessinez le joueur. N'oubliez pas de compenser par la position du viewport et
    position centrale de l'écran. */
    ctx.drawImage(tile_sheet, 64, 0, sprite_size, sprite_size, Math.round(player.x - viewport.x + width * 0.5 - viewport.w * 0.5), Math.round(player.y - viewport.y + height * 0.5 - viewport.h * 0.5), scaled_size, scaled_size);
  }


const Player = function (x, y) {

    this.x = x;
    this.y = y;
    this.speed = 3;

  };

  Player.prototype = {

    moveTo: function (x, y) {

      /* Gradually moves the player closer to x, y every time moveTo is called. */
      this.x += (x - this.x - scaled_size * 0.5) * 0.05;
      this.y += (y - this.y - scaled_size * 0.5) * 0.05;

    }

  };
  let player = new Player(100, 100);

const Viewport = function (x, y, w, h) {

    this.x = x; 
    this.y = y; 
    this.w = w; 
    this.h = h;

  };

  Viewport.prototype = {

    scrollTo: function (x, y) {

      this.x = x - this.w * 0.5;// Rigid scrolling
      this.y = y - this.w * 0.5;

      // Smooth scrolling (forgot to put this in the video)
      //this.x += (x - this.x - this.w * 0.5) * 0.05;
      //this.y += (y - this.y - this.h * 0.5) * 0.05;

    }

  };
  let viewport = new Viewport(200, 200, 500, 500); //Taille du canvas
      /* The width and height of the inside of the browser window */
      var height = document.documentElement.clientHeight;
      var width = document.documentElement.clientWidth;

  var scaled_size = 32;// The size I want my sprites to be;
  var sprite_size = 16;// The actual size of sprites / tiles in the tile_sheet image
  var columns = 24;// columns and rows in map below
  var rows = 54;
  var map = [ 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
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








              var tile_sheet = new Image();

              tile_sheet.addEventListener("load", (event) => { update(); });
          
              tile_sheet.src = "tile-scroll.png";
          





              function drawMap() {
                  console.log(players)

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
                var x_min = Math.floor(viewport.x / scaled_size);
                var y_min = Math.floor(viewport.y / scaled_size);
                var x_max = Math.ceil((viewport.x + viewport.w) / scaled_size);
                var y_max = Math.ceil((viewport.y + viewport.h) / scaled_size);
          
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
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //met en noir transparent tous les pixels dans le rectangle défini par le point de départ de coordonnées (x, y) et par les tailles _(largeur, hauteur)*, supprimant tout contenu précédemment dessiné.
    drawMap();
    movePlayer();
    drawPlayers();
    requestAnimationFrame(update); //notifie le navigateur que vous souhaitez exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation
}

//First call
requestAnimationFrame(update);


// ------ KEYBOARD ------ 
const keyboard = {};

window.onkeydown = function(e){
    keyboard[e.key] = true;
};

window.onkeyup = function(e){
    delete keyboard[e.key];
};
//Cette implémentation nous permet de détecter l'appui de plusieurs touches simultanément. 


//Function move Player
function movePlayer(){
    if (keyboard['ArrowLeft'] || keyboard['q']){
        player.x -= player.speed; // left
        socket.emit('move left');
      } 
      if (keyboard['ArrowUp'] || keyboard['z']){
        player.y -= player.speed; // up
        socket.emit('move up');
      } 
      if (keyboard['ArrowRight'] || keyboard['d']){
        player.x += player.speed; // right
        socket.emit('move right');
      }
      if (keyboard['ArrowDown']|| keyboard['s']){
        player.y += player.speed; // down
        socket.emit('move down');
       } 
/*
    //informe le serveur qu'un mouvement doit se produire
    if (keyboard['ArrowLeft']) socket.emit('move left');
    if (keyboard['ArrowUp']) socket.emit('move up');
    if (keyboard['ArrowRight']) socket.emit('move right');
    if (keyboard['ArrowDown']) socket.emit('move down');*/

}

//Écoutez l'événement players list et mettez à jour la liste des joueurs à chaque fois qu'il survient. 
socket.on('players list', function(list){
    players = list;
})

