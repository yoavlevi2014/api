import { Socket } from "socket.io";

import { Server } from 'socket.io';
import { Server as httpServer } from "http";
import { checkRoomEmpty, checkUserAdmin, getCurrentUser, userJoin, userLeave } from "./helpers/socketUsers";
import { v1 } from "uuid";

export function createSocketServer(server: httpServer) {
    
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket: Socket) => {

        socket.on("joinRoom", ({ username, room }) => {
            const fetchID = checkRoomEmpty(room);
            if(fetchID){
                io.to(fetchID).emit('requestCanvas', {id : socket.id, instance : v1()});
            }

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

        socket.on('sendCanvas', ({data, id}) => {
            io.to(id).emit('fillCanvas', data);     
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

}
