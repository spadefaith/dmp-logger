require('dotenv').config();
const express = require('express');
const port = 9080;
const http = require('http');
const path = require('path');
const cors = require('cors');
const ejs = require('ejs');

const socket = require('socket.io');

const app = express();

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors({
    origin:function(origin, callback){
        callback(null, true)
    }
}));

const server = http.createServer(app).listen(port, function(err){
    if(err){
        console.error(err);
    } else {
        console.log('listening to port ',port);
    };
});

const io = new socket.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

const storage = {};

io.on('connection',(socket)=>{
    socket.emit('message', {message:`connected to socket server with id ${socket.id}`});
});



app.post('/send',function(req, res, next){
    const nsp = req.query.nsp;
    const body = req.body;
    console.log(47,nsp)
    console.log(48,body)
    if(nsp){
        io.of(nsp).emit('message', body);
        // io.emit('message', body);
        res.json({message:'success'});
    } else {
        io.emit('message', body);
        res.json({message:'success'});
    }
});

app.get('/activate/room/:nsp', function(req, res, next){
    const nsp = req.params.nsp;

    if(!storage[nsp]){
        io.of(nsp).on('connection',(socket)=>{
            socket.emit('message', {message:`tes connected to socket server with id ${socket.id}`});
            
        });
        storage[nsp] = true;
    };
    res.json({message:'activated'});
});


app.use('/room/:nsp', async function(req, res, next){
    const nsp = req.params.nsp;
    const template = path.join(__dirname,'./public/index.ejs');
    /**
     * 1. get all users;
     * 2. 
     */

    const action = req.query.action || null;
    
    if(!storage[nsp]){
        io.of(nsp).on('connection',(socket)=>{
            socket.emit('message', {message:`tes connected to socket server with id ${socket.id}`});
            
        });
        storage[nsp] = true;
    };
    
    const html = await ejs.renderFile(template, {
        nsp:nsp,      
        action  
    });
    res.send(html);
});


app.get('/allocate/:nsp', async function(req, res, next){
    const nsp = req.params.nsp;
    // const template = path.join(__dirname,'./public/index.ejs');
    /**
     * 1. get all users;
     * 2. 
     */

    // const action = req.query.action || null;
    
    if(!storage[nsp]){
        io.of(nsp).on('connection',(socket)=>{
            socket.emit('message', {message:`tes connected to socket server with id ${socket.id}`});
            
        });
        storage[nsp] = true;
    };
    
    // const html = await ejs.renderFile(template, {
    //     nsp:nsp,      
    //     action  
    // });
    // res.send(html);
    res.json({status:1,message:'allocated'});
});

app.use('/', function(req, res, next){
    res.sendFile(path.join(__dirname, './public/index.html'));
});