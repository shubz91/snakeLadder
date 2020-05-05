var fs = require('fs');

var colors=['#f00','#0f0','#00f','#ff0','#f0f','#0ff','#000','#fff'];
var players={};
var io=null;
var nxtPlayerId=null;
var gameData={};
var fileLoc="players.txt"

function subtractArray(a1,a2){

  var res=[];
  for(var i=0;i<a1.length;i++){
    if(a2.indexOf(a1[i]) < 0){
      res.push(a1[i]);
    }
  }
  return(res);
}
function arrayColumn(array, columnName) {
    var res=[];
    for(var k in array){
      res.push(array[k][columnName]);
    }
    return(res);
}

var snakeLadderServer={
  onConnect:function(socket){
    // Defining Functions to trigger on receiving various data types
    socket.on('disconnect', function(){snakeLadderServer.onDisconnect(socket);});
    socket.on('userData', function(data){snakeLadderServer.onUserData(socket,data);});
    socket.on('gameData', function(data){snakeLadderServer.onGameData(socket,data);});
    socket.on('action', function(data){snakeLadderServer.onAction(socket,data);});
    socket.on('joinGame', function(data){snakeLadderServer.joinGame(socket,data);});
    socket.on('restart', function(data){snakeLadderServer.onRestart(socket,data);});
    socket.on('user_msg', function(data){snakeLadderServer.onMessage(socket,data);});
    // Creating a placeholder for storing information of a user on a socket
    players[socket.id]={};
  },
  onDisconnect:function(socket){
    if(socket.id in players & "gameId" in players[socket.id]){
      var gId=players[socket.id].gameId;
      // Delete information of player on that socket
      delete players[socket.id];
      // Inform all Users in that game about new player list
      var curPlayers=this.getPlayersInGame(gId);
      // If everyone disconnected, delete game. If not, inform everyone based on game status.
      if(Object.keys(curPlayers).length==0){
        delete gameData[gId];
        // console.log("Deleting game ", gId);
      }
      else{
        // console.log("ondisconnect",gId, Object.keys(gameData));
        if(gId in gameData & gameData[gId].active==true & gameData[gId].nextPlayerId==socket.id){
          // If Game is going on and disconnected player has to move, give chance to next player.
          gameData[gId].nextPlayerId=this.getNextPlayer(gId);
          // console.log("Player exited from ", gId);
          io.to(gId).emit('action',{act:"nextPlayer",nxtPlayerId:gameData[gId].nextPlayerId});
        }
        io.to(gId).emit('users',curPlayers);
      }
    }
  },
  createGameId:function(){
    return(Math.floor(Math.random()*8999) + 1000);
  },
  onGameData:function(socket,data){
    // If game does not exist, host it. If it exists, update and inform all players
    if(players[socket.id].gameId==undefined){
      // create a game ID
      if(data.gameId==""){
        data.gameId=this.createGameId();
        socket.emit("gameId",data.gameId);
      }
      // Creating a room with same gameId
      socket.join(data.gameId);
      // Adding Game ID information for player
      players[socket.id].gameId=data.gameId;
      players[socket.id].isHost=true;
      players[socket.id].isActivated=false;
      players[socket.id].color=colors[0];
      players[socket.id].position=0;
      // Saving hosted game data
      gameData[data.gameId]=data;
      io.to(data.gameId).emit('gameData',gameData[data.gameId]);
      // console.log("Hosted game ",data.gameId,data);

    }
    else{
      var gId=players[socket.id].gameId;
      // Updating hosted game data
      gameData[gId]=data;
      // Informing all users
      io.to(gId).emit('gameData',gameData[gId]);
      // console.log("Updated game ",gId,gameData[gId]);
    }
  },
  joinGame:function(socket,data){
    if(data.gameId!="" & (data.gameId in gameData)){
      // Check if game has already started
      if(gameData[data.gameId].active!=true){
        var pls=this.getPlayersInGame(data.gameId);
        if(Object.keys(pls).length<8){
          // Joining the room where the gameID is hosted
          socket.join(data.gameId);
          // Adding Game ID information for player
          players[socket.id].gameId=data.gameId;
          players[socket.id].isHost=false;
          players[socket.id].isActivated=false;
          players[socket.id].position=0;
          var pcolor=subtractArray(colors,arrayColumn(this.getPlayersInGame(players[socket.id].gameId),"color"))[0];
          players[socket.id].color=pcolor;
          // Sending game data to the player
          socket.emit('gameData',gameData[data.gameId]);
          // console.log("sent game data to ",socket.id, " data: ", gameData[data.gameId]);
        }
        else{
          socket.emit('sysMsg',{code:"ALERT",msg:"Cannot join! Game capacity is full with 8 players"});
        }
      }
      else{
        socket.emit('sysMsg',{code:"ALERT",msg:"Cannot join, the game has already started"});
      }
    }
    else{
      socket.emit('sysMsg',{code:"ALERT",msg:"No such game has been hosted"});
    }
  },
  onRestart:function(socket,data){
    gameData[players[socket.id].gameId]={};
    io.to(players[socket.id].gameId).emit('restart');
  },
  onUserData:function(socket,data){
    // Add data to user information
    // console.log(data);
    for(k in data){
      players[socket.id][k]=data[k];
    }
    // Update all players in that game
    var gId=players[socket.id].gameId;
    io.to(gId).emit('users',this.getPlayersInGame(gId));
    // socket.broadcast.in(gId).emit('users',players[gId]);
    if("name" in data){
      var dt = new Date().toLocaleString({timezone:"Asia/Kolkata"});
      var txt="\r\n" + dt + ", " + data.name;
      this.appendToFile(txt,fileLoc);
    }
  },
  getPlayersInGame:function(gameId){
    var res={};
    for(pid in players){
      if(players[pid].gameId==gameId){
        res[pid]=players[pid];
      }
    }
    return(res);
  },
  onAction:function(socket,data){
    var gId=players[socket.id].gameId;
    switch(data.act){
      case "start":
        //Update game variables
        gameData[gId].active=true;
        gameData[gId].Results={};
        gameData[gId].nextPlayerId=socket.id;
        // Inform all clients to start
        var act={
          act:"start",
          nxtPlayerId:gameData[gId].nextPlayerId
        };
        io.to(gId).emit('action',act);
      break;
      case "dice":
        if(gameData[gId].nextPlayerId==socket.id){

          var diceValue=Math.floor(Math.random() * 5.8) + 1;
          // console.log("Dice value is ",diceValue);
          var res=this.applyGameRules(diceValue,data.pos,socket);
          if(res.repeatChance==false){
            // console.log("rpt", gameData[gId].nextPlayerId, this.getNextPlayer(gId));
            gameData[gId].nextPlayerId=this.getNextPlayer(gId);
          }
          var act={
            act:"dice",
            playerId:socket.id,
            dV:diceValue,
            mV:res.mV, //Move Value
            repeatChance:res.repeatChance,
            msg:res.msg,
            targetPosition:{
              toX:Math.floor(Math.random()*(gameData[gId].boardEdge)),
              toY:Math.floor(Math.random()*(gameData[gId].boardEdge)),
              toA:Math.floor(Math.random()*180)
            },
            nxtPlayerId:gameData[gId].nextPlayerId
          };
          io.to(gId).emit('action',act);

          // Check if game completed
          if(gameData[gId].nextPlayerId==false){
            setTimeout(()=>{
              io.to(gId).emit('sysMsg',{code:"FUNCCOMPLETE",msg:"Game Completed"});
            },1500);
          }
        }
      break;
    }
  },
  sendStats:function(gId){
    io.to(gId).emit('gameStats',{
      Results:gameData[gId].Results
    });
  },
  getNextPlayer:function(gId){
    var curPlayers=this.getPlayersInGame(gId);
    var avPlayers = {};
    // console.log("curPlayers",curPlayers);
    for(k in curPlayers){
      if (curPlayers[k].position == 0){
        avPlayers[k]=curPlayers[k];
      }
    }
    // console.log("avplayers",avPlayers);
    var pIDs=Object.keys(avPlayers);
    if(pIDs.length>0){
      var pos=pIDs.indexOf(gameData[gId].nextPlayerId);
      return(pos==pIDs.length-1 ? pIDs[0] : pIDs[pos+1]);
    }
    else{
      return(false);
    }
  },
  getCompletedPlayers:function(gId){
    var curPlayers=this.getPlayersInGame(gId);
    var avPlayers = {};
    for(k in curPlayers){
      if (curPlayers[k].position > 0){
        avPlayers[k]=curPlayers[k];
      }
    }
    // console.log("completedPlaters", avPlayers);
    return(avPlayers);
  },
  applyGameRules:function(diceVal,position,socket){
    var res={mV:diceVal, repeatChance:false, msg:""};
    var playerName=players[socket.id].name;
    if(players[socket.id].isActivated==false){
      // Starting chance
      if(diceVal==6){
        players[socket.id].isActivated=true;
        res.mV=0;
        res.msg="Congratulations " + playerName + "! Now make your first move.";
        res.repeatChance=true;
      }
      else{
        res.msg="@" + playerName + ", You need to get 6 to start moving.";
        res.mV=0;
      }
    }
    else{
      if(diceVal==6){
        res.repeatChance=true;
        res.msg="@" + playerName + ": roll dice again!";
      }
      if(position + diceVal > 100){
        res.mV=0;
        res.msg=playerName + ", you need " + (100-position) + " to finish.";
      }
      else if(position + diceVal == 100){
        // console.log("player completed ", position, diceVal);
        var comp=this.getCompletedPlayers(players[socket.id].gameId);
        var pos=Object.keys(comp).length + 1;
        players[socket.id].position=pos;
        gameData[players[socket.id].gameId].Results[socket.id]=pos;
        this.sendStats(players[socket.id].gameId);
        res.msg="Congratulations " + playerName + "!, you finished " + pos;
      }
      else{
      }
    }
    return(res);
  },
  onMessage:function(socket,data){
    var gId=players[socket.id].gameId;
    io.to(gId).emit('user_msg',{playerId:socket.id,value:data});
  },
  appendToFile:function(data,file){
    fs.appendFile(file, data, function (err) {
      if (err) throw err;
      // console.log('Appended data: ', data);
    });
  }
}


module.exports=function init(elem){
  io=elem;
  return(snakeLadderServer);
}
