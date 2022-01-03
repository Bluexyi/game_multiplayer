//Player variables
const player = {
    x: 0,
    y: 0,
    size: 20,
    speed: 5
};

//The Game is draw in Canvas HTML element
const ctx = canvas.getContext('2d');

//Fonction draw the player (Carre de cotes size)
function drawPlayers() {
    const {x, y, size} = player;
    ctx.beginPath(); //Creer un nouveau chemin
    ctx.rect(x, y, size, size); //Creer chemin en forme de rectangle
    ctx.fill(); //Remplit le chemin avec la couleur de fond en cours
}

//Loop draw, call 60 times per second
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); //met en noir transparent tous les pixels dans le rectangle défini par le point de départ de coordonnées (x, y) et par les tailles _(largeur, hauteur)*, supprimant tout contenu précédemment dessiné.
    drawPlayers();
    requestAnimationFrame(update); //notifie le navigateur que vous souhaitez exécuter une animation et demande que celui-ci exécute une fonction spécifique de mise à jour de l'animation
}

//First call
requestAnimationFrame(update);
