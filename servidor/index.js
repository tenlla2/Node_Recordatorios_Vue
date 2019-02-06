var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

notaServidor =[];
nickServidor = [];

io.on('connection', function(socket){
  console.log('a user connected');
  socket.emit('Inicio',JSON.stringify(notaServidor));

  socket.on('NuevaTarea', function (nueva) {
    notaServidor.push(JSON.parse(nueva));
    socket.broadcast.emit('NuevaTarea',JSON.stringify(notaServidor));
  });
    socket.on('Notas', function (notas) {
    notaServidor = JSON.parse(notas);
    socket.broadcast.emit('Notas',notas);
 
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
