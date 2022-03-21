import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io

let approveRequestContactReceived = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
    // lắng nghe sự kiện đồng kết bạn
    socket.on("approve-request-contact-received",(data) =>{ 
      let currentUser = {
        id: socket.request.user._id,
        username: socket.request.user.username,
        avatar: socket.request.user.avatar,
        address: (socket.request.user.address !== null) ? socket.request.user.address : ""
      };

      // phát ra sự kiện kết bạn đến contact
      if(clients[data.contactId]){
        emitNotifyToArray(clients,data.contactId,io,'response-approve-request-contact-received',currentUser);
      }
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
    });

  });
};

module.exports = approveRequestContactReceived;