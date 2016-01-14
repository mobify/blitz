var roomMap = {
        "yvr-mens" : {"name":"🚹 Men's Bathroom","max":2},
        "yvr-womens" : {"name":"🚺 Women's Bathroom","max":3},
        "yvr-shower" : {"name":"🚿 Shower","max":1}
};
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

var roomSelected = getParameterByName('room');

if(roomSelected) {
    $.ajax({
        url: "https://pushpush.herokuapp.com/api/v1/status/",
        dataType: "text",
        success: function(data) {
            var roomData = $.parseJSON(data);
            $(".roomStatus").text(roomData[roomSelected]);
        }
    })
} else {
    $.getJSON( "https://pushpush.herokuapp.com/api/v1/status/", function( data ) {
        $.each( data, function( key, val ) {
            $(".js-rooms").append('' +
                '<article class="c-rooms_room">' +
                '   <div class="c-grid">' +
                '       <div class="c-grid_col -md-1-2">' +
                '           <h1 class="c-heading -level4">' + roomMap[key]['name'] + '</h1>' +
                '       </div> ' +
                '       <div class="c-grid_col -md-1-2 ' + key + '">' +
                '       </div>' +
                '   </div> ' +
                '</article>');
            if(val === 1) {
                $("." + key).append('' +
                    '           <p class="-color-free u-right ' + key + '-num">' + val + ' stall is free <i class="fa fa-check-circle"></i></p>');
            } else if (val === 0 && roomMap[key]['max'] == 1 ) {
                $("." + key).append('' +
                    '           <p class="-color-occupied u-right ' + key + '-num">the stall is occupied <i class="fa fa-minus-circle"></i></p>');
            } else if (val === 0) {
                $("." + key).append('' +
                    '           <p class="-color-occupied u-right ' + key + '-num">all stalls are occupied <i class="fa fa-minus-circle"></i></p>');
            } else {
                $("." + key).append('' +
                    '           <p class="-color-free u-right ' + key + '-num">' + val + ' stalls are free <i class="fa fa-check-circle"></i></p>');
            }
        });
    });

}

function startRefresh() {
    $.get('', function(data) {
        $.getJSON( "https://pushpush.herokuapp.com/api/v1/status/", function( data ) {
            $.each( data, function( key, val ) {
                console.log(key + " " + val)
                if(val === 1) {
                    $("." + key + "-num").replaceWith('' +
                        '           <p class="-color-free u-right ' + key + '-num">' + val + ' stall is free <i class="fa fa-check-circle"></i></p>');
                } else if (val === 0 && roomMap[key]['max'] == 1 ) {
                    $("." + key + "-num").replaceWith('' +
                        '           <p class="-color-occupied u-right ' + key + '-num">the stall is occupied <i class="fa fa-minus-circle"></i></p>');
                } else if (val === 0) {
                    $("." + key + "-num").replaceWith('' +
                        '           <p class="-color-occupied u-right ' + key + '-num">all stalls are occupied <i class="fa fa-minus-circle"></i></p>');
                } else {
                    $("." + key + "-num").replaceWith('' +
                        '           <p class="-color-free u-right ' + key + '-num">' + val + ' stalls are free <i class="fa fa-check-circle"></i></p>');
                }
            });
        });
    })
    setTimeout(startRefresh,10000);
}
$(function() {
    setTimeout(startRefresh,10000);
});