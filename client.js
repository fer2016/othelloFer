// client.js 
// Fer Flores
// Implementación del protocolo.

const myModule = require('./intelligence');

var numTiros=0;
var socket;

var io = require('socket.io-client')  

start();

function start(){
    socket = io.connect('http://localhost:3000', {reconnect: true});

    socket.on('connect',function(){
        console.log("Conectado.");
        socket.emit("signin",{game:"othello",user_name:"fer77",tournament_id:12,user_role:"player"});

    });

    socket.on('ok_signin',function(data){

        console.log("Signin succesful. Waiting for ready....");
    });

    socket.on('error_signin',function(data){
        console.log("Connection Error.");
    });

    socket.on('ready',function(data){
        var player_turn_id = data.player_turn_id;
        var num = myModule.intelligentMove(data.board,data.player_turn_id);
        socket.emit("play",{game_id:data.game_id,player_turn_id:data.player_turn_id,movement:num,tournament_id:12});
        numTiros++;
    });

    socket.on("finish",function(data){
        var game_id = data.game_id;
        var player_turn_id = data.player_turn_id;
        numTiros =0;
        console.log("Game Finished.");
        socket.emit("player_ready",{tournament_id:12,game_id:data.game_id,player_turn_id:data.player_turn_id});
    });

};