const path = require("path") ;
const express = require("express") ;
const http = require('http') ;
// const bodyParser = require("body-parser") ;
const socketio = require('socket.io') ;
const formatMessage = require('./utils/messages') ;
const { userJoin , getCurrentUser , userLeave , getRoomUsers } = require('./utils/users') ;



const app = express() ;
const server = http.createServer(app) ;
const io = socketio(server) ;
//set static folder
app.use(express.static(path.join(__dirname + "public" )));


const botName = "ChatCord Bot" ;
// run when clients connects 
io.on( 'connection' , socket => 
{    
    socket.on( 'joinRoom' , ({ username , room }) =>{

      const user = userJoin( socket.id , username , room  ) ;  
       
        // welcomes the current user
    socket.emit('Messsage' , formatMessage( botName , "welcome to Let's Chat..!")) ;

    // broadcast to all the user  of that room when a new  user connects 
    socket.broadcast.to(user.room).emit('message' , formatMessage( botName ,`${user.username} has joined  the chat` )) ;

    } )

    // send users and room info
    io.to(user.room).emit('roomUsers' , {
       room : user.room ,
       users : getRoomUsers(user.room)
     });
     


    //listen for chat message 
    socket.on('chatMessage' , (msg)=>{
        
        const user = getCurrentUser(socket.id) ;


        io.to(user.room).emit('message' , formatMessage(  user.username , 'msg') );
    })



    // runs when clients disconnects
    socket.on('disconnect' , ()=>
    {
        const user = userLeave(socket.id) ;
        
        io.to(user.room).emit('message' , formatMessage( botName ,`${user.username} has left the chat`)) ;

    });

    // send users and room info
    io.to(user.room).emit('roomUsers' , {
        room : user.room ,
        users : getRoomUsers(user.room)
      });
      

});



const PORT = 3000 || process.env.PORT ;


server.listen( PORT , ()=>console.log('server is running  at port ' + PORT ));

console.log('server is running  at port ' + PORT );

