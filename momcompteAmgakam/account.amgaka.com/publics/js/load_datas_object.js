$.get('https://ipinfo.io', function (datas) {
}, "jsonp").done(function(datas) {
    les_datas = datas;
    console.log(datas);
}).fail(function() {
    //alertify.alert("Veuillez recharger la page SVP");
});