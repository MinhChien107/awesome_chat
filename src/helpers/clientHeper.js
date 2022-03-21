import moment from "moment";

//Chuyển sang base 64
export let bufferToBase64 = (bufferFrom) =>{ 
  return Buffer.from(bufferFrom).toString("base64");
};

// Lấy phần tử cuối của mảng
export let lastItemOfArr = (array) =>{
  if(!array.length){
    return [];
  }
  return array[array.length - 1];
};

// Chuyển timestamp về kiểu giờ phút giây trước
export let convertTimestampToHumanTime = (timestamp) => {
  if(!timestamp){
    return "";
  }
  return moment(timestamp).locale("vi").startOf("seconds").fromNow();
}