require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const http = require('http');
const path = require('path');
const cors = require('cors');

const socket = require('socket.io');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());



const server = http.createServer(app).listen(port, function(err){
    if(err){
        console.error(err);
    } else {
        console.log('listening to port ',port);
    };
});

const io = new socket.Server(server);

io.on('connection',(socket)=>{
    io.emit('message', {message:`connected to socket server with id ${socket.id}`});
});


app.post('/send',function(req, res, next){
    const body = req.body;
    io.emit('message', body);


    res.json({message:'success'});
});


app.use('/', function(req, res, next){
    res.sendFile(path.join(__dirname, './public/index.html'));
});