import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';

// io form socket.io

let chatVideo = (io) =>{ 
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

    // Check xem listener có online không
    socket.on("caller-check-listener-online-or-not",(data) =>{
      if(clients[data.listenerId]){
        // online
        let response = {
          callerId : socket.request.user._id,
          listenerId : data.listenerId,
          callerName : data.callerName
        }

        emitNotifyToArray(clients,data.listenerId,io,"server-request-peer-id-of-listener",response);
      } else {
        // offline
        socket.emit("server-send-listener-is-offline")
      }
    });
    // listerner gửi lên peerId
    socket.on("listener-emit-peer-id-to-server",(data) =>{
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName: data.listenerName,
        listenerPeerId : data.listenerPeerId
      };
      //server gửi peerId cho caller
      if(clients[data.callerId]){
        emitNotifyToArray(clients,data.callerId,io,"server-send-peer-id-of-listener-to-caller",response);
      }
    });
    // caller gọi lên server call listener
    socket.on("caller-request-call-to-server",(data) =>{
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName: data.listenerName,
        listenerPeerId : data.listenerPeerId
      };
      if(clients[data.listenerId]){
        emitNotifyToArray(clients,data.listenerId,io,"server-send-request-call-to-listener",response);
      }
    });

    // caller cancel cuộc gọi
    socket.on("caller-cancel-request-call-to-server",(data) =>{
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName: data.listenerName,
        listenerPeerId : data.listenerPeerId
      };
      //cancel cuộc gọi bên listener
      if(clients[data.listenerId]){
        emitNotifyToArray(clients,data.listenerId,io,"server-send-cancel-request-call-to-listener",response);
      }
    });

    // Listener từ chối cuộc gọi từ caller
    socket.on("listener-reject-request-call-to-server",(data) =>{
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName: data.listenerName,
        listenerPeerId : data.listenerPeerId
      };
      // phát về phía caller bị từ chối cuộc gọi
      if(clients[data.callerId]){
        emitNotifyToArray(clients,data.callerId,io,"server-send-reject-call-to-caller",response);
      }
    });

    // listener đồng ý cuộc gọi
    socket.on("listener-access-request-call-to-server",(data) =>{
      let response = {
        callerId : data.callerId,
        listenerId : data.listenerId,
        callerName : data.callerName,
        listenerName: data.listenerName,
        listenerPeerId : data.listenerPeerId
      };
      // Phát sự kiện cho caller
      if(clients[data.callerId]){
        emitNotifyToArray(clients,data.callerId,io,"server-send-access-call-to-caller",response);
      }
      // Phát sự kiện cho listener
      if(clients[data.listenerId]){
        emitNotifyToArray(clients,data.listenerId,io,"server-send-access-call-to-listener",response);
      }
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
      socket.request.user.chatGroupIds.forEach(function(group){
        clients = removeSocketIdFromArray(clients,group._id,socket);
      });
    });

  });
};

module.exports = chatVideo;