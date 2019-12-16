$(document).ready(function(){

    //al click sul button devo
    $('#search_container button').click(function () {
        //leggere il value dell'input
        var film_searched = $('#search_container input').val();
        console.log(film_searched);
        //fare una chiamata API per recuperare i titoli in database
        $.ajax({
            // Esempio chiamata:
            // https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=ritorno+al+futuro
            //link base dell'api https://api.themoviedb.org/3
            //useremo la chiamata --> /search/movie
            //Passiamo come parametri api_key e query
            //API Key: 545efb8b9373f473ca0a15eafe64304c (key ottenuta da moviedb)
            //query dovrebbe coindidere con il value passato dall'utente
            'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + film_searched,
            'method':'get',
            'success': function(response){
                //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                var film_list = response.results;

                console.log(film_list);
                for (var i = 0; i < film_list.length; i++) {
                    var titolo = film_list[i].title;
                    var titolo_originale = film_list[i].original_title;
                    var lingua = film_list[i].original_language;
                    var voto = film_list[i].vote_average;
                    console.log('titolo: ' + titolo);
                    console.log('titolo originale: ' + titolo_originale);
                    console.log('lingua: ' + lingua);
                    console.log('voto: ' + voto);
                }

                // se le parole cercate sono contenute nel titolo in lista --> mostrarlo
            },
            'error': function(){
                alert('errore');
            }

        });
    });
});
