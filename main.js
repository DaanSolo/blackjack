var socket = io();
var balance = 1000;
dealerPoints = 0;
playerPoints = 0;

function updateTable(table){
    var dealerString = "";
    var playerString = "";
    table.dealer.cards.forEach(card => {
        dealerString += card[0]
    });
    $("#dealer").html(dealerString);
    $("#dealerPoints").html(table.dealer.points);
    table.player.cards.forEach(card => {
        playerString += card[0]
    });
    $("#player").html(playerString);
    $("#playerPoints").html(table.dealer.points);
}

socket.on('draw',function(data){
    console.log(data);
    updateTable(data);
});
$("#draw").click(function(){
    socket.emit('draw',10);
});
$("#stand").click(function(){
    socket.emit('stand');
    socket.on('stand', function(data){
        console.log(data);
        updateTable(data);
    });
});
