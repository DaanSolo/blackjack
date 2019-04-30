var socket = io();
var balance = 1000;
dealerPoints = 0;
playerPoints = 0;

function cardString(cards){
    var cardStr = "";

    cards.forEach(card => {
        if(card){
            switch(card.suit){
                case "hearts":
                    cardStr += '<li><div class="card rank-'+card.value+' hearts"><span class="rank">'+card.value+'</span><span class="suit">♥</span></div></li>';
                    break;
                case "diamonds":
                    cardStr +='<li><div class="card rank-'+card.value+' diams"><span class="rank">'+card.value+'</span><span class="suit">♦</span></div></li>';
                    break;
                case "spades":
                  cardStr += '<li><div class="card rank-'+card.value+' spades"><span class="rank">'+card.value+'</span><span class="suit">♠</span></div></li>';
                    break;
                case "clubs":
                   cardStr +='<li><div class="card rank-'+card.value+' clubs"><span class="rank">'+card.value+'</span><span class="suit">♣</span></div></li>';
                    break;
            }
        }
        else{
            cardStr += '<li><div class="card back"></div></li>';
        }
    });

    return cardStr;
}
function updateTable(table){
    var dealerString = cardString(table.dealer.cards);
    var playerString = cardString(table.player.cards);

    $("#table-dealer").html(dealerString);
    $("#dealerPoints").html(table.dealer.points);

    $("#table-player").html(playerString);
    $("#playerPoints").html(table.player.points);

    if(table.status != 0){
        $("#stand").prop('disabled', true);
        $("#hit").prop('disabled', true);
        $("#draw").prop('disabled', false);
    }
    if(table.status==1){
        $("#playerPoints").css('color','red');
        $("#dealerPoints").css('color','green');
    }
    if(table.status==3){
        $("#playerPoints").css('color','green');
        $("#dealerPoints").css('color','red');
    }
}

socket.on('draw',function(data){
    console.log(data);
    updateTable(data);
    $("#stand").prop('disabled', false);
    $("#hit").prop('disabled', false);
});
socket.on('update', function(data){
    console.log(data);
    updateTable(data);
});
$("#draw").click(function(){
    socket.emit('draw',10);
    $(this).prop('disabled', true);
    $("#playerPoints").css('color','black');
    $("#dealerPoints").css('color','black');
});
$("#stand").click(function(){
    socket.emit('stand');
});
$("#hit").click(function(){
    socket.emit('hit');
});