import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io
let removeRequestContactSent = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);

    // lắng nghe xóa yêu cầu kết bạn gửi đi lên 
    socket.on("remove-request-contact-sent",(data) =>{ 
      let currentUser = {
        id: socket.request.user._id
      };

      // Phát sự kiện xóa yêu cầu kết bạn gửi đi đến contactId
      if(clients[data.contactId]){
        emitNotifyToArray(clients,data.contactId,io,'response-remove-request-contact-sent',currentUser);
      }
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
    });
  });
};

module.exports = removeRequestContactSent;