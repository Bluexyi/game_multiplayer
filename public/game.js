const socket = io();

//Player variables
//const player = {
//    x: 0,
//    y: 0,
//    size: 20,
//    speed: 5
//};

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
    })
    //const {x, y, size} = player;
}

//Loop draw, call 60 times per second
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //met en noir transparent tous les pixels dans le rectangle défini par le point de départ de coordonnées (x, y) et par les tailles _(largeur, hauteur)*, supprimant tout contenu précédemment dessiné.
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
//    if (keyboard['ArrowLeft']) player.x -= player.speed; // left
//    if (keyboard['ArrowUp']) player.y -= player.speed; // up
//    if (keyboard['ArrowRight']) player.x += player.speed; // right
//    if (keyboard['ArrowDown']) player.y += player.speed; // down

    //informe le serveur qu'un mouvement doit se produire
    if (keyboard['ArrowLeft']) socket.emit('move left');
    if (keyboard['ArrowUp']) socket.emit('move up');
    if (keyboard['ArrowRight']) socket.emit('move right');
    if (keyboard['ArrowDown']) socket.emit('move down');

}

//Écoutez l'événement players list et mettez à jour la liste des joueurs à chaque fois qu'il survient. 
socket.on('players list', function(list){
    players = list;
})

