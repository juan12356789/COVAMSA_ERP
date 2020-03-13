const  socket = io ();  



socket.on('chat:message',function(data){
    console.log(data);
    
});