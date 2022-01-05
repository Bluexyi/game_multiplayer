//Gestion de la connexion et deconnexion d'un joueur
const socketio = require('socket.io');

module.exports = function (server) {
  // io server
  const io = socketio(server);

  // Game state (player List)
  const players = {};

  io.on('connection', function (socket) {
    //refister new player
    players[socket.id] = {
      x: 32,
      y: 32,
      speed: 1,
      c: "#" + ((1 << 24) * Math.random() | 0).toString(16)
    };

    //Delete disconnected player
    socket.on('disconnect', function () {
      delete players[socket.id];
    });
  });

  // envoyez l'état du jeu à tous les joueurs connectés, 60 fois par secondes 
  function update() {
    io.volatile.emit('players list', Object.values(players)); //Le flag volatile signifie que le paquet de données peut être perdu (à cause d'une latence, d'une déconnexion, etc...).
  }

  setInterval(update, 1000 / 60);

  //Update player position
  io.on('connection', function (socket) {
    socket.on('move left', function () { players[socket.id].x -= players[socket.id].speed; });
    socket.on('move up', function () { players[socket.id].y -= players[socket.id].speed; });
    socket.on('move right', function () { players[socket.id].x += players[socket.id].speed; });
    socket.on('move down', function () { players[socket.id].y += players[socket.id].speed; });
  });

};
