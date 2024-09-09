const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let roles = ['MARCO', 'POLO', 'POLO ESPECIAL'];

io.on('connection', (socket) => {
	console.log('Nuevo jugador conectado:', socket.id);

	socket.on('newPlayer', (playerName) => {
		players.push({ id: socket.id, name: playerName });
		io.emit('updatePlayers', players);
	});

	socket.on('startGame', () => {
		if (players.length >= 3) {
			players.forEach((player, index) => {
				const role = roles[index % roles.length];
				io.to(player.id).emit('assignRole', role);
			});
		}
	});

	socket.on('action', (role) => {
		console.log(`El jugador con rol ${role} ha realizado una acción.`);
	});

	socket.on('disconnect', () => {
		players = players.filter((player) => player.id !== socket.id);
		io.emit('updatePlayers', players);
		console.log('Jugador desconectado:', socket.id);
	});
});

server.listen(5050, () => {
	console.log('Servidor escuchando en puerto 5050');
});
