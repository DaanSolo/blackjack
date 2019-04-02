var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var deck = require('./deck.json');

var Dealer = function(){
    this.cards = [randomCard()],
    this.aces = 0,
    this.points = 0
}

var Player = function(){
    this.cards = [randomCard(),randomCard()],
    this.aces = 0,
    this.points = 0
}

function randomCard(){
    return deck[parseInt(Math.random() * 51)];
}
function updatePoints(player){
    var points = 0;
    var aces = 0;

    console.log(player);
    player.cards.forEach(card => {
        if(card){
            switch(card.value){
                case "j":
                    points += 10;
                    break;
                case "q":
                    points += 10;
                    break;
                case "k":
                    points += 10;
                    break;
                case "a":
                    aces += 1;
                    break;
                default:
                    points += card.value;
                    break;
            }
        }
    });

    player.points = points;
    player.aces = aces;

    return player;
}

function updateDealer(table){
    while(table.dealer.points<17){
        table.dealer.cards.push(randomCard());
        table.dealer = updatePoints(table.dealer);
    }
}
function checkStatus(table, checkPlayer){
    if(table.player.points>21){
        table.status = 1;
        updateDealer(table);
    }
    if(checkPlayer){
        if(table.player.points<table.dealer.points){
            table.status = 1;
        }
        else if(table.player.points==table.dealer.points){
            table.status = 2;
        }
        else if(table.player.points>table.dealer.points){
            table.status = 3;
        }
    }
}

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});
app.get('/main.css', function(req, res){
    res.sendFile(__dirname + '/main.css');
});
app.get('/cards.css', function(req, res){
    res.sendFile(__dirname + '/cards.css');
});
app.get('/main.js', function(req, res){
    res.sendFile(__dirname + '/main.js');
});

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('user disconnected');
      });
    socket.on('draw', function (data) {
        console.log(data);

        var table = {
            "status" : 0,
            "dealer" : new Dealer,
            "player" : new Player
        };

        updatePoints(table.dealer);
        updatePoints(table.player);

        socket.emit('draw',table);

        socket.on('stand',function(){
            checkStatus(table, true);
            updateDealer(table);
            socket.emit('update',table);
        });
        socket.on('hit', function(){
            console.log("hit");
            table.player.cards.push(randomCard());
            table.player = updatePoints(table.player);
            checkStatus(table);
            socket.emit('update',table);
        });
    })
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});