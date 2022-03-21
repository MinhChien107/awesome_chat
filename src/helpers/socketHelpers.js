//thêm vào đối tượng clients giá trị socketsId của thuộc tính userId vào mảng
export let pushSocketIdToArray = (clients, userId, socketId) => {
    if (clients[userId]) {
        clients[userId].push(socketId);
    } else {
        clients[userId] = [socketId];
    }
    return clients;
};
// Emit thông báo cho userId trong clients bằng soceketId
export let emitNotifyToArray = (clients, userId, io, eventName, data) => {
    clients[userId].forEach(socketId => io.sockets.connected[socketId].emit(eventName, data));
};
//xóa giá trị socketsId của thuộc tính userId trong clients
export let removeSocketIdFromArray = (clients, userId, socket) => {
    clients[userId] = clients[userId].filter(socketId => {
        return socketId !== socket.id;
    });
    if (!clients[userId].length) {
        delete clients[userId];
    }
    return clients;
};