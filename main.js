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
    $("#playerPoints").html(table.player.points);

    if(table.status != 0){
        $("#stand").prop('disabled', true);
        $("#hit").prop('disabled', true);
        $("#draw").prop('disabled', false);
    }
    if(table.status==1){
        $("#playerPoints").css('color','red');
    }
    if(table.status==3){
        $("#playerPoints").css('color','green');
    }

}

socket.on('draw',function(data){
    console.log(data);
    updateTable(data);
    $("#stand").prop('disabled', false);
    $("#hit").prop('disabled', false);
});
$("#draw").click(function(){
    socket.emit('draw',10);
    $(this).prop('disabled', true);
});
$("#stand").click(function(){
    socket.emit('stand');
    socket.on('update', function(data){
        console.log(data);
        updateTable(data);
    });
});
$("#hit").click(function(){
    socket.emit('hit');
    socket.on('update', function(data){
        console.log(data);
        updateTable(data);
    });
});