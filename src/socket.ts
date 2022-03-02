import express, { Application } from "express";
import { Socket } from "socket.io";

import http from 'http';
import { Server } from 'socket.io';
import { checkUserAdmin, getCurrentUser, userJoin, userLeave } from "./helpers/socketUsers";

export function createSocketServer() {
    const app: Application = express();
    const server = http.createServer(app);
    app.use(function (_req, res, next) {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        next();
    });
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {

        socket.on("joinRoom", ({ username, room }) => {
            const admin = checkUserAdmin(room);
            const user = userJoin(socket.id, username, room, admin);
            socket.join(user.room);
            
            io.to(socket.id).emit('adminCheck', admin);

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
