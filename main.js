$(document).ready(function(){
    //----dichiaro le variabili globali
    var api_base = 'https://api.themoviedb.org/3';
    var api_key = '545efb8b9373f473ca0a15eafe64304c';
    var template_html = $("#film-template").html();
    var template_function = Handlebars.compile(template_html);

    //reazione al click
    $('#search_container button').click(cerca_film);

    //reazione al INVIO
    $('#search_container input').keypress(function(event){
        if (event.which == 13) {cerca_film();}
    });

    function cerca_film () {
        // //leggere il value dell'input
        var film_searched = $('#search_container input').val();
        console.log(film_searched);
        //prima di tutto devo cancellare tutte le card eventualmente già visibili (perchè se no mi aggiunge valori sotto)
        $('.card').remove();
        $('#error').remove();
        //controllo che sia stato digitato qualcosa
        if (film_searched.length != 0) {
            //fare una chiamata API per recuperare i titoli in database
            $.ajax({
                // 'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + film_searched,
                'url': api_base + '/search/movie',
                'data' : {
                    'api_key': api_key,
                    'query': film_searched
                },
                'method':'get',
                'success': function(response){
                    //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                    var film_list = response.results;
                    //estraggo info su ogni film
                    for (var i = 0; i < film_list.length; i++) {
                        var titolo = film_list[i].title;
                        var titolo_originale = film_list[i].original_title;
                        var lingua = film_list[i].original_language;
                        var voto = film_list[i].vote_average;
                        var numero_stelle = Math.ceil(voto/2);
                        console.log(titolo + ': ' + numero_stelle);
                        //uso variabile vuota perchè stringhe
                        var stelle = '';
                        //faccio il ciclo per il num di elementi totali
                        for (var j = 0; j < 5; j++) {
                            //se il num di stelle è minore del numero_stelle stampo stella piena
                            if (j < numero_stelle) {
                                stelle += '<i class="fas fa-star"></i>';
                            } else {
                                //se non ho raggiunto numero_stelle stampo stella vuota
                                stelle += '<i class="far fa-star"></i>';
                            }
                        }
                        var context = {
                            'title':titolo,
                            'original_title':titolo_originale,
                            'lang':lingua,
                            'rating':stelle
                        };
                        var html = template_function(context);
                        $('#display_container').append(html);
                    }
                    //svuoto il value dell'input
                    $('#search_container input').val('');
                },
                'error': function(error){
                    //se non inserisci nulla
                    if (error.status == 422) {
                        display_error()
                    }
                }
            });
        }
    }
});

function display_error() {
    $('#display_container').append(`<div id="error">
        <strong>Non ha inserito qualcosa di valido</strong>
    </div>`);
}
