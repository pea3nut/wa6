$(function(){
    var cash_str =$(".profit-cash").html();
    var all_cash =cash_str.match(/(    |\t)([\+|\-]\d+(\.\d+)?) /gm);
    var sum =0;
    for(var i=0; i<all_cash.length ;i++){
        all_cash[i] =parseFloat( all_cash[i].replace(/ |\t/g,""));
        sum +=all_cash[i];
    };
    $('#profit_num').animateNumber(
        {
            "number" : sum,
            "font-size":"80px",
            "numberStep": function(now, tween) {
                $('#profit_num').html(now.toFixed(2));
            }
        }
        ,1500
    );
});
