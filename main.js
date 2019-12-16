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
                //confrontare il titolo cercato con titoli in lista
                // se le parole cercate sono contenute nel titolo in lista --> mostrarlo (Titolo, Titolo Originale, Lingua, Voto)
                console.log(response);
                //
            },
            'error': function(){
                alert('errore');
            }

        });
    });
});
