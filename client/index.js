const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static('client'));

io.on('connection', (socket) => {
	console.log('Nuevo jugador conectado');

	// Recibe el nombre del jugador y lo agrega a la lista
	socket.on('newPlayer', (playerName) => {
		players.push({ id: socket.id, name: playerName });
		io.emit('updatePlayers', players); // Actualiza la lista de jugadores en todos los clientes
		console.log(players);
	});

	// Cuando un jugador se desconecta, lo eliminamos de la lista
	socket.on('disconnect', () => {
		players = players.filter((player) => player.id !== socket.id);
		io.emit('updatePlayers', players); // Actualiza la lista de jugadores en todos los clientes
	});
});

server.listen(5050, () => {
	console.log('Servidor corriendo en http://localhost:5050');
});
