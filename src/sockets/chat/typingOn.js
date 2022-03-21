import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let typingOn = (io) =>{ 
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

    // Lắng nghe user gõ phím
    socket.on("user-is-typing",(data) =>{ 
      if(data.groupId){
        let response = {
          currentGroupId: data.groupId,
          currentUserId: socket.request.user._id,
          message : data.message
        };

        // Phát sự kiện đến group hiện user gõ phím
        if(clients[data.groupId]){
          emitNotifyToArray(clients,data.groupId,io,'response-user-is-typing',response);
        }
      }
      if(data.contactId){
        let response = {
          currentUserId: socket.request.user._id,
          message : data.message
        };

        // Phát sự kiện đến contact hiện user gõ phím
        if(clients[data.contactId]){
          emitNotifyToArray(clients,data.contactId,io,'response-user-is-typing',response);
        }
      };

    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._id,socket);
      });
    });

  });
};

module.exports = typingOn;