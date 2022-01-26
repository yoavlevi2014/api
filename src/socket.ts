import express, { Application } from "express";
import { Socket } from "socket.io";

import http from 'http';
import {Server} from 'socket.io';
import eJwt from "express-jwt";
import { getCurrentUser, userJoin, userLeave } from "@helpers/socketUsers";

export function createSocketServer() {
    const app : Application = express();
    const server = http.createServer(app);
    const io = new Server(server);

    io.on('connection', (socket: Socket) => {
        app.use(eJwt({
            secret: socket.handshake.query.token as string,
            algorithms: ["HS256"]
        }));
        
        socket.on("joinRoom", ({ username, room }) => {
            const user = userJoin(socket.id, username, room);
            socket.join(user.room);
            // below will be replaced by a message action in the future
            // console.log(user.username + " joined " + user.room);
        })

        socket.on('disconnect', () => {
            userLeave(socket.id);
            // if (user) {
            //     // below will be replaced by a message action in the future
            //     // console.log(user.username + " has left " + user.room);
            // }
        });

        socket.on('newMessage', (msg) => {
            const user = getCurrentUser(socket.id);
            if (user) socket.broadcast.to(user.room).emit('addMessage', msg);
        });

        socket.on('requestCanvasClear', () => {
            const user = getCurrentUser(socket.id);
            if(user) io.to(user.room).emit('clearCanvas');
        })

        socket.on('newObject', (object) => {
            const user = getCurrentUser(socket.id);
            if(user) socket.broadcast.to(user.room).emit('addObject', object);
        });

        socket.on('newModification', (object) => {
            const user = getCurrentUser(socket.id);
            if(user) socket.broadcast.to(user.room).emit('modifyObject', object);
        });
    });

    server.listen(8081, () => {
        // eslint-disable-next-line no-console
        console.log('listening on *:8081');
    });
}
