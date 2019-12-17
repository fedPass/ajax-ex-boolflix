$(document).ready(function(){
    //reazione al click
    $('#search_container button').click(function () {
        //leggere il value dell'input
        var film_searched = $('#search_container input').val();
        console.log(film_searched);
        //controllo che sia stato digitato qualcosa
        if (film_searched.length != 0) {
            cerca_film();
        } else {
            $('#display_container').append(`<div id="error">
                <strong>Non ha inserito qualcosa di valido</strong>
            </div>`);
        }
    });

    //reazione al INVIO
    $('#search_container input').keypress(function(event){
        if (event.which == 13) {
            cerca_film();
        }
    });

    function cerca_film () {
        //prima di tutto devo cancellare tutte le card eventualmente già visibili (perchè se no mi aggiunge valori sotto)
        $('.card').remove();
        $('#error').remove();
        //leggere il value dell'input
        var film_searched = $('#search_container input').val();
        console.log(film_searched);
        //fare una chiamata API per recuperare i titoli in database
        // var api_base = 'https://api.themoviedb.org/3';
        // var api_key = '545efb8b9373f473ca0a15eafe64304';
        $.ajax({
            'url':'https://api.themoviedb.org/3/search/movie?api_key=545efb8b9373f473ca0a15eafe64304c&query=' + film_searched,
            // 'url': api_base + '/search/movie',
            // 'data' : {
            //     'api_key': api_key,
            //     'query': film_searched
            // },
            'method':'get',
            'success': function(response){
                var template_html = $("#film-template").html();
                var template_function = Handlebars.compile(template_html);
                //per ogni risultato della chiamata in lista recupera Titolo, Titolo Originale, Lingua, Voto
                var film_list = response.results;
                for (var i = 0; i < film_list.length; i++) {
                    var titolo = film_list[i].title;
                    var titolo_originale = film_list[i].original_title;
                    var lingua = film_list[i].original_language;
                    var voto = film_list[i].vote_average;
                    var context = {
                        'title':titolo,
                        'original_title':titolo_originale,
                        'lang':lingua,
                        'rating':voto
                    };
                    var html = template_function(context);
                    $('#display_container').append(html);

                    var numero_stelle = Math.ceil(voto/2);
                    console.log(titolo + ': ' + numero_stelle);
                    //mostramelo in pagina
                    // $('#display_container').append(`<div class="card">
                    //     <ul>
                    //         <li>Titolo: `+ titolo + `</li>
                    //         <li>Titolo originale: `+ titolo_originale + `</li>
                    //         <li>Lingua: `+ lingua + `</li>
                    //         <li>Voto: `+ voto + `</li>
                    //         <li class="display_stelle"></li>
                    //     </ul>
                    // </div>`);
                    
                    //inserisci stelle
                    //se faccio la prova così le inserisce
                    // $('.display_stelle').append('<i class="fas fa-star"></i>');
                    //appena metto ciclo for impazzisce
                    // for (var i = 0; i < numero_stelle; i++) {
                    //     $('.display_stelle').append('<i class="fas fa-star"></i>');
                    // }

                    //prova con ciclo diverso
                    // var i = 0
                    // while (i < numero_stelle) {
                    //     $('.display_stelle').append('<i class="fas fa-star"></i>');
                    //     i++;
                    // }

                    //inserisco stelline vuote rimanenti
                    // while ($('.display_stelle').length = 5) {
                    //     $('.display_stelle').append('<i class="far fa-star"></i>');
                    // }
                }
                //svuoto il value dell'input
                $('#search_container input').val('');
            },
            'error': function(error){
                //se non inserisci nulla
                if (error.status == 422) {
                    $('#display_container').append(`<div id="error">
                        <strong>Non ha inserito qualcosa di valido</strong>
                    </div>`);
                }
            }
        });
    }
});
