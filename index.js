require('dotenv').config();
const express = require('express');
const port = process.env.PORT;
const http = require('http');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');

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
const storage = {};

io.on('connection',(socket)=>{
    socket.emit('message', {message:`connected to socket server with id ${socket.id}`});
});



app.post('/send',function(req, res, next){
    const nsp = req.query.nsp;
    const body = req.body;
    if(nsp){
        io.of(nsp).emit('message', body);
        // io.emit('message', body);
        res.json({message:'success'});
    } else {
        io.emit('message', body);
        res.json({message:'success'});
    }
});

app.use('/room/:nsp', async function(req, res, next){
    const nsp = req.params.nsp;
    const template = path.join(__dirname,'./public/index.ejs');
    /**
     * 1. get all users;
     * 2. 
     */

    if(!storage[nsp]){
        io.of(nsp).on('connection',(socket)=>{
            socket.emit('message', {message:`tes connected to socket server with id ${socket.id}`});
            
        });
        storage[nsp] = true;
    };
    
    const html = await ejs.renderFile(template, {
        nsp:nsp,        
    });
    res.send(html);
});

app.use('/', function(req, res, next){
    res.sendFile(path.join(__dirname, './public/index.html'));
});