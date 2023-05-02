import type { WebSocketServer } from 'ws';

function broadcast(wss: WebSocketServer, message: string) {
	wss.clients.forEach((client: { room: string | any[]; send: (message: string) => void }) => {
		if (client.room.indexOf(message.room) > -1) {
			client.send(JSON.stringify(message.payload));
		}
	});
}

export const handleWs = (wss: WebSocketServer) => {
	wss.on('connection', (ws) => {
		ws.room = [];
		ws.send(JSON.stringify({ payload: 'user joined' }));

		ws.on('message', (message) => {
			const data = JSON.parse(message.toString());

			if (data?.join) {
				ws.room.push(data.join);
			}

			if (data?.room) {
				broadcast(wss, data);
			}
		});
	});
};
