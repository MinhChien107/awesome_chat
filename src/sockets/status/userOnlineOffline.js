import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let userOnlineOffline = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);

    socket.request.user.chatGroupIds.forEach(function(group){
      clients = pushSocketIdToArray(clients,group._id,socket.id);
    });
    // Lắng nghe sự kiện khi có người tạo nhóm thì push id của nhóm chát này client và socketId của thằng tạo
    socket.on("new-group-created",(data) =>{
      clients = pushSocketIdToArray(clients,data.groupChat._id,socket.id);
    });
    // Khi mời menber vào thì add socketid của thằng đó vào cái groupChatId
    socket.on("member-received-group-chat", data =>{
      clients = pushSocketIdToArray(clients,data.groupChatId,socket.id);
    });
    
    // Lắng nghe sự kiện trả check status để trả về danh sách những người online
    socket.on("check-status",()=>{
      let listUsersOnline = Object.keys(clients);
      // phát sự kiện về những user đã online trước đó 
      socket.emit("server-send-list-users-online",listUsersOnline);

      //phát sự kiện cho những user đã online trước đó có người vừa mới online
      io.broadcast.emit('server-send-when-new-user-online',socket.request.user._id);
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._id,socket);
      });
      // Phát sự kiện cho mọi người là user hiện tại vừa mới offline
      io.broadcast.emit('server-send-when-new-user-offline',socket.request.user._id);
    });

  });
};

module.exports = userOnlineOffline;