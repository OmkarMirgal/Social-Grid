import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
const morgan =require('morgan')
require('dotenv').config()
import {read, readdirSync} from 'fs' //to access the folder and read the files within (rather than importing each file.)


//initailize app
const app = express();
const http = require('http').createServer(app);

//socket.io config
const io = require('socket.io')(http,{
    path : "/socket.io",
    cors :{
        origin : process.env.CLIENT_URL,
        method : ["GET", "POST"],
        allowedHeaders : ["Content-type"],
    },
});


//db
mongoose.connect(process.env.DATABASE,
    {
        useNewUrlParser :true,
        useUnifiedTopology:true,
    })
    .then(() => console.log('DB CONNECTED'))
    .catch((err) =>console.log('DB CONNECTION ERROR',err));


//middelware
app.use(express.json(
    {
        limit : "5mb"
    }
));


app.use(express.urlencoded({ extended: true }))

app.use(cors(
    {
    origin : [process.env.CLIENT_URL]
    }
))

// app.post('/api/register',(req,res) =>{
//     console.log(`REGISTER ENDPOINT => ${req.body}`)
// })


//autoload routes
readdirSync('./routes').map((r) => app.use('/api',require(`./routes/${r}`))) //looping each file in the routes folder dir and applying the middleware

//socket.io
// io.on('connect', (socket) => {
//     // console.log("Socket.io =>", socket.id)
//     socket.on("send-message",(message)=>{
//         // console.log("new msg received",message);
//         socket.broadcast.emit('receive-message',message)
//     })
// } )

io.on('connect',(socket) => {
    socket.on("new-post",(newPost) => {
        // console.log("socketio new Post",newPost);
        socket.broadcast.emit("new-post",newPost)
    })
})

const port = process.env.PORT || 8000
http.listen(port , () => console.log(`server running on port${port}`))