var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var deck = [['🂡',11],['🂱',11],['🃁',11],['🃑',11],
['🂢',2],['🂲',2],['🃂',2],['🃒',2],
['🂣',3],['🂳',3],['🃃',3],['🃓',3],
['🂤',4],['🂴',4],['🃄',4],['🃔',4],
['🂥',5],['🂵',5],['🃅',5],['🃕',5],
['🂦',6],['🂶',6],['🃆',6],['🃖',6],
['🂧',7],['🂷',7],['🃇',7],['🃗',7],
['🂨',8],['🂸',8],['🃈',8],['🃘',8],
['🂩',9],['🂹',9],['🃉',9],['🃙',9],
['🂪',10],['🂺',10],['🃊',10],['🃚',10],
['🂫',10],['🂻',10],['🃋',10],['🃛',10],
['🂭',10],['🂽',10],['🃍',10],['🃝',10],
['🂮',10],['🂾',10],['🃎',10],['🃞',10]];

var Dealer = function(){
    this.cards = [randomCard(),['🂠',0]];
    this.points = updatePoints(this.cards);
}

var Player = function(){
    this.cards = [randomCard(),randomCard()],
    this.points = updatePoints(this.cards);
}

function randomCard(){
    return deck[parseInt(Math.random() * 51)];
}
function updatePoints(cards){
    var points = 0;
    console.log(cards);
    cards.forEach(card => {
        points += card[1];
    });
    return points;
}
function updateDealer(table){
    while(table.dealer.points<17){
        table.dealer.cards.push(randomCard());
        table.dealer.points = updatePoints(table.dealer.cards);
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

        socket.emit('draw',table);

        socket.on('stand',function(){
            checkStatus(table, true);
            updateDealer(table);
            socket.emit('update',table);
        });
        socket.on('hit', function(){
            table.player.cards.push(randomCard());
            table.player.points = updatePoints(table.player.cards);
            checkStatus(table);
            socket.emit('update',table);
        });
    })
  });
http.listen(3000, function(){
  console.log('listening on *:3000');
});