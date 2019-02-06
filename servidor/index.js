var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

notaServidor =[];
nickServidor = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('NuevaTarea', function (nueva) {
    socket.broadcast.emit('NuevaTarea',nueva);
    console.log(nueva);
  });
    socket.on('Notas', function (notas) {
    notaServidor = notas;
    socket.broadcast.emit('Notas',notaServidor);
 
  });

  socket.on('NuevoNick', function (datos) {
    
    if(nickServidor.includes(datos.nick)){
      datos.estado=false;
      socket.emit('NuevoNick',datos);
    }
    else{
      datos.estado=true;
      nickServidor.push(datos.nick);
      socket.emit('NuevoNick',datos);
    }
    console.log(nickServidor);
  });

  
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
