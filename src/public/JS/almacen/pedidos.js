const socket = io(); 


socket.on('table:data',function (data) {
    console.log(data);
})
console.log();
