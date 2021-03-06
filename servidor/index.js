var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var formidableMiddleware = require('express-formidable');

// Settings for CORS
app.use(function (req, res, next) {

// Website you wish to allow to connect
res.header('Access-Control-Allow-Origin', 'http://localhost:8080');

// Request methods you wish to allow
res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

// Request headers you wish to allow
res.header('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

// Set to true if you need the website to include cookies in the requests sent
// to the API (e.g. in case you use sessions)
res.setHeader('Access-Control-Allow-Credentials', true);

// Pass to next layer of middleware
next();
});


app.use(formidableMiddleware({
  encoding: 'utf-8',
  uploadDir: './files',
  multiples: true, // req.files to be arrays of files
  keepExtensions: true,
  maxFieldsSize : 2 * 1024 * 1024,
}));
app.post('/files', (req, res) => {
  console.log(req.files)
  res.send(req.files)

})
app.get('/files', (req, res) => {

  res.send(req.files[0])

})


notaServidor =[];
nickServidor = [];
ChatUsuarios=[];
cont=1;
fondoChat='https://iconsplace.com/wp-content/uploads/_icons/40e0d0/256/png/connected-icon-17-256.png'

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
  socket.on('borrar', function (notas) {
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
      suID='user'+cont;
      ChatUsuarios.push({
        id: suID,
        name: datos.nick,
        imageUrl: ''
      });
     
      cont ++;
      console.log(ChatUsuarios);
      socket.emit('NuevoNick',datos);
      // socket.emit('Typing',suID);
      io.emit('UsuariosChat',JSON.stringify(ChatUsuarios));
      io.emit('Fondo',fondoChat);

      socket.on('borrar', function (notas) {
        socket.broadcast.emit('borrar',datos.nick);
     
      });

      socket.on('disconnect', function(){
        indice = nickServidor.indexOf(datos.nick);
        indice2 = nickServidor.indexOf(datos.nick);
        nickServidor.splice(indice,1);
        ChatUsuarios.splice(indice,1);
        io.emit('UsuariosChat',JSON.stringify(ChatUsuarios));
        for(i=0; i<ChatUsuarios.length; i++){
          ChatUsuarios[i].id="user"+(i+1);
        }
        cont--;
        console.log('user '+datos.nick+ ' disconnected');
        console.log(ChatUsuarios);
        console.log(nickServidor);
        io.emit('Desconectado',datos.nick);
      });
    }

    
  });

  socket.on('Mensaje', function (msg) {
    console.log(msg);
    socket.broadcast.emit('Mensaje',msg);
 
  });

  


});

http.listen(3000, function(){
  console.log('listening on *:3000');
  
});
