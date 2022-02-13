import express, { Application } from "express";
import { Socket } from "socket.io";

import http from 'http';
import { Server } from 'socket.io';
import { getCurrentUser, userJoin, userLeave } from "./helpers/socketUsers";

export function createSocketServer() {
    const app: Application = express();
    const server = http.createServer(app);
    const io = new Server(server, {
        cors: {
            origin: "*"
        }
    });

    io.on('connection', (socket: Socket) => {

        socket.on("joinRoom", ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);

            const msg = `${user.username} joined the room`
            io.to(user.room).emit('addStatus', msg);
        })

        socket.on('disconnect', () => {
            const user = userLeave(socket.id);
            if (user) {
                const msg = `${user.username} left the room`;
                io.to(user.room).emit('addStatus', msg);
            }
        });

        socket.on('newMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            if (user) socket.broadcast.to(user.room).emit('addMessage', msg);
        });

        socket.on('requestCanvasClear', () => {
            const user = getCurrentUser(socket.id);
            if (user) io.to(user.room).emit('clearCanvas');
        })

        socket.on('newObject', (object) => {
            const user = getCurrentUser(socket.id);
            if (user) socket.broadcast.to(user.room).emit('addObject', object);
        });

        socket.on('newModification', (object) => {
            const user = getCurrentUser(socket.id);
            if (user) socket.broadcast.to(user.room).emit('modifyObject', object);
        });
    });

    server.listen(8081, () => {
        // eslint-disable-next-line no-console
        console.log('socket IO server listening on *:8081');
    });
}
