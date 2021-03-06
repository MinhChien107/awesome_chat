import {pushSocketIdToArray,emitNotifyToArray,removeSocketIdFromArray} from '../../helpers/socketHelpers';


// io form socket.io
let removeRequestContactSent = (io) =>{ 
  let clients = {};
  io.on('connection',(socket) =>{
    clients = pushSocketIdToArray(clients,socket.request.user._id,socket.id);
    // Lắng nghe từ chối yêu cầu kết bạn từ contact
    socket.on("remove-request-contact-received",(data) =>{ 
      let currentUser = {
        id: socket.request.user._id
      };

      // Phát ra từ chối yêu cầu kết bạn từ contact
      if(clients[data.contactId]){
        emitNotifyToArray(clients,data.contactId,io,'response-remove-request-contact-received',currentUser);
      }
    });

    socket.on("disconnect",() =>{
      clients = removeSocketIdFromArray(clients,socket.request.user._id,socket);
    });
  });
};

module.exports = removeRequestContactSent;