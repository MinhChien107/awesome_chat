import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let newGroupChat = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);

    socket.request.user.chatGroupIds.forEach(function(group){
      clients = pushSocketIdToArray(clients,group._id,socket.id);
    });
   
    // Lắng nghe sự kiện khi có người tạo nhóm thì push id của nhóm chát này client và socketId của thằng tạo
    socket.on("new-group-created",(data) =>{
      clients = pushSocketIdToArray(clients,data.groupChat._id,socket.id);

      let response = {
        groupChat: data.groupChat
      };
      // Phát sự kiện tạo nhóm cho những user vừa thêm vào nhóm
      data.groupChat.members.forEach(member =>{
        if(clients[member.userId] && member.userId != socket.request.user._id){
          emitNotifyToArray(clients, member.userId , io, "response-new-group-created",response);
        }
      });
    });

    // Khi mời menber vào thì add socketid của thằng đó vào cái groupChatId
    socket.on("member-received-group-chat", data =>{
      clients = pushSocketIdToArray(clients,data.groupChatId,socket.id);
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._id,socket);
      });
    });

  });
};

module.exports = newGroupChat;